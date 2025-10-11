import os
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from kiteconnect import KiteConnect
from .models import ZerodhaUser
from .models import RiskProfile
from .stocks_list import stocks
from django.utils import timezone
from datetime import datetime, timedelta
import yfinance as yf
import json

from config import KITE_API_KEY, KITE_API_SECRET

if not KITE_API_KEY or not KITE_API_SECRET:
    raise Exception("Please set KITE_API_KEY and KITE_API_SECRET in your environment variables.")

# Initialize KiteConnect with redirect URL
kite = KiteConnect(api_key=KITE_API_KEY)

def is_token_expired(zerodha_user):
    """Check if access token is expired based on update time"""
    if not zerodha_user.updated_at:
        return True
    
    # Zerodha tokens expire after market hours (around 3:30 PM IST)
    # We'll consider tokens older than 18 hours as expired
    token_age = timezone.now() - zerodha_user.updated_at
    return token_age > timedelta(hours=18)

def handle_token_error(zerodha_user, error_message):
    """Handle token expiration by clearing the stored token"""
    if "api_key" in error_message.lower() or "access_token" in error_message.lower() or "token" in error_message.lower():
        print(f"Token expired for user {zerodha_user.user.username}, clearing stored data")
        zerodha_user.delete()
        return True
    return False

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_login_url(request):
    """Get Zerodha login URL"""
    try:
        # Get the login URL from KiteConnect
        login_url = kite.login_url()
        return Response({"login_url": login_url})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def kite_callback(request):
    """Handle Zerodha callback and generate session"""
    try:
        request_token = request.GET.get('request_token')
        if not request_token:
            return Response({"error": "request_token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"Processing callback with request_token: {request_token[:10]}...")
        
        # Check if user already has a valid Zerodha account linked
        try:
            existing_user = ZerodhaUser.objects.get(user=request.user)
            if not is_token_expired(existing_user):
                print(f"User already has valid Zerodha account linked: {existing_user.user_name}")
                return Response({
                    "message": "Zerodha account already linked",
                    "profile": {
                        "user_name": existing_user.user_name,
                        "user_id": existing_user.zerodha_user_id,
                        "email": existing_user.email,
                        "broker": existing_user.broker
                    }
                })
            else:
                print(f"Existing token expired for user {existing_user.user_name}, proceeding with re-auth")
                existing_user.delete()  # Remove expired token
        except ZerodhaUser.DoesNotExist:
            pass  # Continue with linking process
        
        # Check if this token was already processed (prevent duplicate processing)
        from django.core.cache import cache
        cache_key = f"processed_token_{request_token}"
        if cache.get(cache_key):
            print(f"Token {request_token[:10]}... already processed, returning success")
            # Get the user that was created with this token
            try:
                existing_user = ZerodhaUser.objects.get(user=request.user)
                return Response({
                    "message": "Zerodha account already linked",
                    "profile": {
                        "user_name": existing_user.user_name,
                        "user_id": existing_user.zerodha_user_id,
                        "email": existing_user.email,
                        "broker": existing_user.broker
                    }
                })
            except ZerodhaUser.DoesNotExist:
                return Response({
                    "error": "Token already processed but user not found. Please try connecting again.",
                    "code": "TOKEN_ALREADY_PROCESSED"
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark token as being processed
        cache.set(cache_key, True, timeout=300)  # 5 minutes timeout
        
        # Clean up old processed tokens (older than 10 minutes)
        try:
            from django.core.cache import cache
            # This is a simple cleanup - in production, you might want a more sophisticated approach
            # For now, we'll rely on the timeout mechanism
        except Exception as e:
            print(f"Cache cleanup error: {e}")
        
        data = kite.generate_session(request_token, api_secret=KITE_API_SECRET)
        access_token = data["access_token"]
        
        print(f"Generated access_token: {access_token[:10]}...")
        
        # Get user profile
        kite.set_access_token(access_token)
        profile = kite.profile()
        
        print(f"Retrieved profile for user: {profile.get('user_name', 'Unknown')}")
        
        # Save or update Zerodha user data
        zerodha_user, created = ZerodhaUser.objects.get_or_create(
            user=request.user,
            defaults={
                'access_token': access_token,
                'api_key': KITE_API_KEY,
                'zerodha_user_id': profile.get('user_id'),
                'user_name': profile.get('user_name'),
                'email': profile.get('email'),
                'mobile': profile.get('mobile'),
                'broker': profile.get('broker'),
                'products': profile.get('products', []),
                'order_types': profile.get('order_types', []),
                'exchanges': profile.get('exchanges', [])
            }
        )        
        if not created:
            # Update existing user
            zerodha_user.access_token = access_token
            zerodha_user.zerodha_user_id = profile.get('user_id')
            zerodha_user.user_name = profile.get('user_name')
            zerodha_user.email = profile.get('email')
            zerodha_user.mobile = profile.get('mobile')
            zerodha_user.broker = profile.get('broker')
            zerodha_user.products = profile.get('products', [])
            zerodha_user.order_types = profile.get('order_types', [])
            zerodha_user.exchanges = profile.get('exchanges', [])
            zerodha_user.save()
        
        print(f"Zerodha user {'created' if created else 'updated'} successfully")        
        return Response({
            "message": "Login successful",
            "access_token": access_token,
            "profile": profile
        })
        
    except Exception as e:
        print(f"Error in kite_callback: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Check if it's a token expiration error
        if "Token is invalid or has expired" in str(e):
            # Check if user was actually created despite the error
            try:
                existing_user = ZerodhaUser.objects.get(user=request.user)
                print(f"User was created despite token error: {existing_user.user_name}")
                return Response({
                    "message": "Zerodha account already linked",
                    "profile": {
                        "user_name": existing_user.user_name,
                        "user_id": existing_user.zerodha_user_id,
                        "email": existing_user.email,
                        "broker": existing_user.broker
                    }
                })
            except ZerodhaUser.DoesNotExist:
                return Response({
                    "error": "Request token has expired. Please try connecting again.",
                    "code": "TOKEN_EXPIRED"
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def kite_profile(request):
    """Get Zerodha user profile"""
    print(f"🔍 Backend: kite_profile called for user: {request.user.username}")
    try:
        # Get access token from stored user data
        try:
            zerodha_user = ZerodhaUser.objects.get(user=request.user)
            print(f"🔍 Backend: Found Zerodha user in database: {zerodha_user.user_name}")
        except ZerodhaUser.DoesNotExist:
            print(f"🔍 Backend: No Zerodha user found in database for: {request.user.username}")
            return Response({
                "error": "Zerodha account not linked",
                "code": "ACCOUNT_NOT_LINKED",
                "action_required": "Please connect your Zerodha account first"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if token is expired
        if is_token_expired(zerodha_user):
            print(f"🔍 Backend: Token expired for user: {request.user.username}")
            zerodha_user.delete()
            return Response({
                "error": "Zerodha session has expired",
                "code": "SESSION_EXPIRED",
                "action_required": "Please reconnect your Zerodha account"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            print(f"🔍 Backend: Setting access token and fetching profile for user: {request.user.username}")
            kite.set_access_token(zerodha_user.access_token)
            profile = kite.profile()
            print(f"🔍 Backend: Successfully fetched profile: {profile}")
            return Response(profile)
        except Exception as e:
            print(f"🔍 Backend: Error fetching profile: {str(e)}")
            # Handle token error
            if handle_token_error(zerodha_user, str(e)):
                print(f"🔍 Backend: Token error detected in profile fetch, clearing user data")
                return Response({
                    "error": "Zerodha session has expired",
                    "code": "SESSION_EXPIRED",
                    "action_required": "Please reconnect your Zerodha account"
                }, status=status.HTTP_401_UNAUTHORIZED)
            raise e
        
    except Exception as e:
        print(f"🔍 Backend: Error in kite_profile: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def disconnect_zerodha(request):
    """Disconnect Zerodha account"""
    try:
        zerodha_user = ZerodhaUser.objects.get(user=request.user)
        zerodha_user.delete()
        return Response({"message": "Zerodha account disconnected successfully"})
    except ZerodhaUser.DoesNotExist:
        return Response({"error": "No Zerodha account linked"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ---- Risk Calculation ----
# Remove nan entries and normalize to uppercase
stocks = [s.upper() for s in stocks if str(s).lower() != 'nan']

# --- Risk Calculation Functions ---
def get_cap_category(stock_name):
    stock_name = stock_name.upper()
    if stock_name in stocks:
        idx = stocks.index(stock_name)
        if 0 <= idx <= 99:
            return "Large Cap"
        elif 100 <= idx <= 249:
            return "Mid Cap"
        else:
            return "Small Cap"
    return None

cap_scores = {"Large Cap": 1, "Mid Cap": 2, "Small Cap": 3}

def calc_market_cap_score(holdings=None, total_stock_value=None, mode="symbol"):
    """
    holdings: dict {stock_symbol: holding_value}
    total_stock_value: float
    mode: "symbol" or "total"
    """
    if mode == "total":
        # If only total value is provided, assume mid-risk stock allocation (Mid Cap)
        return 2.0  # default risk score for unknown allocation
    elif mode == "symbol" and holdings:
        total_stock_value = sum(holdings.values())
        if total_stock_value == 0:
            return 0  # no stocks
        weights = {"Large Cap": 0, "Mid Cap": 0, "Small Cap": 0}
        for stock, value in holdings.items():
            cap = get_cap_category(stock)
            if cap:
                weights[cap] += value
        for cap in weights:
            weights[cap] = weights[cap] / total_stock_value if total_stock_value > 0 else 0
        risk_score = sum(weights[cap] * cap_scores[cap] for cap in weights)
        return risk_score
    return 0

def calc_fd_score(fd_value, stock_value):
    total = fd_value + stock_value
    if total == 0:
        return 0
    
    safety_ratio = fd_value / total
    if safety_ratio > 0.75:
        return 1.0
    elif 0.50 <= safety_ratio <= 0.75:
        return 1.5
    elif 0.25 <= safety_ratio < 0.50:
        return 2.0
    else:
        return 3.0

def risk_tolerance_bucket(score):
    score = round(score, 2)
    if 1.00 <= score <= 1.50:
        return "Conservative (Low Risk)"
    elif 1.51 <= score <= 2.50:
        return "Moderate"
    elif 2.51 <= score <= 3.00:
        return "Aggressive (High Risk)"
    return "Unknown"

def calc_mf_score(mf_value, stock_value, fd_value):
    total = mf_value + stock_value + fd_value
    if total == 0:
        return 0
    
    mf_score = 1.8
    weight = mf_value / total
    return mf_score * weight

def calc_final_risk(fd_value, holdings=None, mf_value=0, mode="symbol", total_stock_value=None):
    """
    mode: "symbol" or "total"
    holdings: dict of {symbol: value} (used if mode="symbol")
    total_stock_value: float (used if mode="total")
    """
    if mode == "total":
        stock_value = total_stock_value or 0
    else:
        stock_value = sum(holdings.values()) if holdings else 0

    total_assets = fd_value + stock_value + mf_value
    if total_assets == 0:
        return 0, "No Investments"

    risk_a = calc_market_cap_score(holdings, total_stock_value, mode)
    risk_b = calc_fd_score(fd_value, stock_value)
    risk_c = calc_mf_score(mf_value, stock_value, fd_value)

    weights = {
        "stocks": stock_value / total_assets if total_assets > 0 else 0,
        "fd": fd_value / total_assets if total_assets > 0 else 0,
        "mf": mf_value / total_assets if total_assets > 0 else 0,
    }

    final_score = (
        risk_a * weights["stocks"] +
        risk_b * weights["fd"] +
        risk_c  # already weighted
    )

    return final_score, risk_tolerance_bucket(final_score)

# --- API Endpoint to Calculate Risk Tolerance ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculate_risk_tolerance(request):
    """Calculate risk tolerance based on either Zerodha holdings or manual input"""
    try:
        mode = request.data.get('mode', 'zerodha')  # 'zerodha' or 'manual'
        
        if mode == 'zerodha':
            # Get Zerodha user data
            try:
                zerodha_user = ZerodhaUser.objects.get(user=request.user)
            except ZerodhaUser.DoesNotExist:
                return Response({
                    "error": "Zerodha account not linked",
                    "code": "ACCOUNT_NOT_LINKED",
                    "action_required": "Please connect your Zerodha account first"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Check if token is expired
            if is_token_expired(zerodha_user):
                zerodha_user.delete()
                return Response({
                    "error": "Zerodha session has expired",
                    "code": "SESSION_EXPIRED",
                    "action_required": "Please reconnect your Zerodha account"
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Set access token
            kite.set_access_token(zerodha_user.access_token)
            
            # Fetch stock holdings from Zerodha
            try:
                holdings_response = kite.holdings()
                stock_holdings = {}
                total_stock_value = 0
                
                for holding in holdings_response:
                    if holding['product'] == 'CNC':  # Only consider delivery holdings
                        symbol = holding['tradingsymbol']
                        current_value = holding['quantity'] * holding['last_price']
                        stock_holdings[symbol] = current_value
                        total_stock_value += current_value
                stock_symbols = list(stock_holdings.keys())
                yfinance_symbols = [symbol + ".NS" for symbol in stock_symbols]
                print(f"Stock symbols from zerodha: {yfinance_symbols}")
                print(f"Total stock value from zerodha: {total_stock_value}")
            except Exception as e:
                # Handle token error
                if handle_token_error(zerodha_user, str(e)):
                    return Response({
                        "error": "Zerodha session has expired",
                        "code": "SESSION_EXPIRED",
                        "action_required": "Please reconnect your Zerodha account"
                    }, status=status.HTTP_401_UNAUTHORIZED)
                return Response({"error": f"Failed to fetch stock holdings: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Fetch mutual fund holdings from Zerodha
            try:
                mf_holdings_response = kite.mf_holdings()
                total_mf_value = 0
                
                for mf_holding in mf_holdings_response:
                    total_mf_value += mf_holding['quantity'] * mf_holding['average_price']
                    
            except Exception as e:
                # Check if it's a token error
                if handle_token_error(zerodha_user, str(e)):
                    return Response({
                        "error": "Zerodha session has expired",
                        "code": "SESSION_EXPIRED",
                        "action_required": "Please reconnect your Zerodha account"
                    }, status=status.HTTP_401_UNAUTHORIZED)
                # If MF API fails for other reasons, continue with 0 value
                total_mf_value = 0
                print(f"MF holdings fetch failed: {str(e)}")
            
            # For FD, use a hardcoded value (you can make this configurable later)
            fd_value = request.data.get('fd_value')  # Use provided FD value or default
            
            # Calculate risk tolerance
            risk_score, risk_category = calc_final_risk(
                fd_value, holdings=stock_holdings, mf_value=total_mf_value, mode="symbol"
            )
            
            # Save risk profile
            risk_profile, created = RiskProfile.objects.update_or_create(
                user=request.user,
                defaults={
                    'risk_score': risk_score,
                    'risk_category': risk_category,
                    'stock_exposure': stock_holdings,
                    'mf_exposure': {'total_value': total_mf_value},
                    'fd_value': fd_value,
                    'calculation_mode': 'zerodha'
                }
            )
            
            return Response({
                "mode": "zerodha",
                "risk_score": round(risk_score, 2),
                "risk_category": risk_category,
                "stock_holdings_value": total_stock_value,
                "mf_holdings_value": total_mf_value,
                "fd_value": fd_value,
                "total_portfolio_value": total_stock_value + total_mf_value + fd_value,
                "stock_breakdown": stock_holdings,
                "calculated_at": risk_profile.last_calculated.isoformat()
            })
            
        elif mode == 'manual':
            # Get manual input values
            fd_value = request.data.get('fd_value', 0)
            stock_value = request.data.get('stock_value', 0)
            mf_value = request.data.get('mf_value', 0)
            
            # Validate inputs
            if not all(isinstance(val, (int, float)) for val in [fd_value, stock_value, mf_value]):
                return Response({"error": "All values must be numbers"}, status=status.HTTP_400_BAD_REQUEST)
            
            if fd_value < 0 or stock_value < 0 or mf_value < 0:
                return Response({"error": "Values cannot be negative"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate risk tolerance using total value mode
            risk_score, risk_category = calc_final_risk(
                fd_value, mf_value=mf_value, mode="total", total_stock_value=stock_value
            )
            
            # Save risk profile
            risk_profile, created = RiskProfile.objects.update_or_create(
                user=request.user,
                defaults={
                    'risk_score': risk_score,
                    'risk_category': risk_category,
                    'stock_exposure': {'total_value': stock_value},
                    'mf_exposure': {'total_value': mf_value},
                    'fd_value': fd_value,
                    'calculation_mode': 'manual'
                }
            )
            
            return Response({
                "mode": "manual",
                "risk_score": round(risk_score, 2),
                "risk_category": risk_category,
                "stock_value": stock_value,
                "mf_value": mf_value,
                "fd_value": fd_value,
                "total_portfolio_value": stock_value + mf_value + fd_value,
                "calculated_at": risk_profile.last_calculated.isoformat()
            })
            
        else:
            return Response({"error": "Invalid mode. Use 'zerodha' or 'manual'"}, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        print(f"Error in calculate_risk_tolerance: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_stock_holdings(request):
    """Get user's Zerodha stock holdings and format them for yfinance analysis"""
    print(f"🔍 Backend: get_user_stock_holdings called for user: {request.user.username}")
    try:
        # Check if user has Zerodha account linked
        try:
            zerodha_user = ZerodhaUser.objects.get(user=request.user)
            print(f"🔍 Backend: Found Zerodha user: {zerodha_user.user_name}")
        except ZerodhaUser.DoesNotExist:
            print(f"🔍 Backend: No Zerodha account found for user: {request.user.username}")
            return Response({
                "error": "Zerodha account not linked",
                "code": "ACCOUNT_NOT_LINKED",
                "action_required": "Please connect your Zerodha account first"
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Check if token is expired
        if is_token_expired(zerodha_user):
            print(f"🔍 Backend: Token expired for user: {request.user.username}")
            zerodha_user.delete()
            return Response({
                "error": "Zerodha session has expired",
                "code": "SESSION_EXPIRED",
                "action_required": "Please reconnect your Zerodha account"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            # Set access token
            print(f"🔍 Backend: Setting access token for user: {request.user.username}")
            kite.set_access_token(zerodha_user.access_token)
            
            # Fetch stock holdings from Zerodha
            print(f"🔍 Backend: Fetching holdings from Zerodha API...")
            holdings_response = kite.holdings()
            print(f"🔍 Backend: Raw holdings response length: {len(holdings_response)}")
            
            stock_holdings = []
            stock_details = {}
            
            for holding in holdings_response:
                print(f"🔍 Backend: Processing holding: {holding}")
                if holding['product'] == 'CNC':  # Only consider delivery holdings
                    symbol = holding['tradingsymbol']
                    quantity = holding['quantity']
                    last_price = holding['last_price']
                    current_value = quantity * last_price
                    
                    # Format symbol: uppercase + .NS suffix
                    formatted_symbol = f"{symbol.upper()}.NS"
                    
                    print(f"🔍 Backend: Formatted symbol: {symbol} -> {formatted_symbol}")
                    print(f"🔍 Backend: Quantity: {quantity}, Price: {last_price}, Value: {current_value}")
                    
                    stock_holdings.append(formatted_symbol)
                    stock_details[formatted_symbol] = {
                        'original_symbol': symbol,
                        'quantity': quantity,
                        'last_price': last_price,
                        'current_value': current_value,
                        'exchange': holding.get('exchange', 'NSE')
                    }
            
            print(f"🔍 Backend: Final stock holdings: {stock_holdings}")
            print(f"🔍 Backend: Stock details: {stock_details}")
            
            if not stock_holdings:
                print(f"🔍 Backend: No stock holdings found for user: {request.user.username}")
                return Response({
                    "message": "No stock holdings found in your Zerodha account",
                    "stock_symbols": [],
                    "stock_details": {},
                    "total_holdings": 0
                })
            
            total_portfolio_value = sum(detail['current_value'] for detail in stock_details.values())
            print(f"🔍 Backend: Total portfolio value: {total_portfolio_value}")
            
            response_data = {
                "message": "Stock holdings fetched successfully",
                "stock_symbols": stock_holdings,
                "stock_details": stock_details,
                "total_holdings": len(stock_holdings),
                "total_portfolio_value": total_portfolio_value
            }
            
            print(f"🔍 Backend: Sending response: {response_data}")
            return Response(response_data)
            
        except Exception as e:
            print(f"🔍 Backend: Error in Zerodha API call: {str(e)}")
            # Handle token error
            if handle_token_error(zerodha_user, str(e)):
                print(f"🔍 Backend: Token error detected, clearing user data")
                return Response({
                    "error": "Zerodha session has expired",
                    "code": "SESSION_EXPIRED",
                    "action_required": "Please reconnect your Zerodha account"
                }, status=status.HTTP_401_UNAUTHORIZED)
            return Response({"error": f"Failed to fetch stock holdings: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    except Exception as e:
        print(f"🔍 Backend: Error in get_user_stock_holdings: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_risk_profile(request):
    """Get user's risk profile"""
    try:
        risk_profile = RiskProfile.objects.get(user=request.user)
        return Response({
            "risk_score": risk_profile.risk_score,
            "risk_category": risk_profile.risk_category,
            "last_calculated": risk_profile.last_calculated,
            "stock_exposure": risk_profile.stock_exposure,
            "mf_exposure": risk_profile.mf_exposure,
            "fd_value": risk_profile.fd_value,
            "calculation_mode": risk_profile.calculation_mode
        })
    except RiskProfile.DoesNotExist:
        return Response({"error": "Risk profile not calculated yet"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stock_details(request):
    """Fetch user's stock holdings from Zerodha, format symbols, and get details via yfinance"""
    try:
        # 1. Check if Zerodha account is linked
        try:
            zerodha_user = ZerodhaUser.objects.get(user=request.user)
            print(f"🔍 Backend: Found Zerodha user: {zerodha_user.user_name}")
        except ZerodhaUser.DoesNotExist:
            print(f"🔍 Backend: No Zerodha account found for user: {request.user.username}")
            return Response({
                "error": "Zerodha account not linked",
                "code": "ACCOUNT_NOT_LINKED",
                "action_required": "Please connect your Zerodha account first"
            }, status=status.HTTP_404_NOT_FOUND)
        print(f"ye hai Zerodha user: {zerodha_user}")
        # 2. Check if token is expired
        if is_token_expired(zerodha_user):
            zerodha_user.delete()
            return Response({
                "error": "Zerodha session has expired",
                "code": "SESSION_EXPIRED",
                "action_required": "Please reconnect your Zerodha account"
            }, status=status.HTTP_401_UNAUTHORIZED)

        # 3. Fetch stock holdings from Zerodha
        try:
            kite.set_access_token(zerodha_user.access_token)
            holdings_response = kite.holdings()
        except Exception as e:
            if handle_token_error(zerodha_user, str(e)):
                return Response({
                    "error": "Zerodha session has expired",
                    "code": "SESSION_EXPIRED",
                    "action_required": "Please reconnect your Zerodha account"
                }, status=status.HTTP_401_UNAUTHORIZED)
            return Response({"error": f"Failed to fetch holdings: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print(f"🔍 Backend: Holdings response length: {len(holdings_response)}")
        
        # 4. Process holdings: map symbols to yfinance format
        stock_symbols = []
        symbol_mapping = {}  # Store original -> yfinance mapping
        holdings_data = {}  # Store holdings data for each symbol
        
        for holding in holdings_response:
            if holding['product'] == 'CNC':  # delivery holdings only
                original_symbol = holding['tradingsymbol'].upper()
                
                # Apply symbol mapping rules
                if original_symbol == "ONEPOINT-BE":
                    yfinance_symbol = "ONEPOINT.NS"
                elif original_symbol == "VIVANTA":
                    yfinance_symbol = "VIVANTA.BO"
                else:
                    # Default: add .NS suffix
                    yfinance_symbol = original_symbol + ".NS"
                
                stock_symbols.append(yfinance_symbol)
                symbol_mapping[yfinance_symbol] = original_symbol
                
                # Store holdings data
                holdings_data[yfinance_symbol] = {
                    'quantity': holding['quantity'],
                    'average_price': holding['average_price'],
                    'last_price': holding['last_price'],
                    'invested_amount': holding['quantity'] * holding['average_price'],
                    'current_value': holding['quantity'] * holding['last_price']
                }
        if not stock_symbols:
            print(f"🔍 Backend: No stock symbols found, returning empty response")
            return Response({"stocks": []})
        
        # 5. Fetch stock details from yfinance
        stocks_data = []
        for symbol in stock_symbols:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info

                # Get original symbol for display
                original_symbol = symbol_mapping.get(symbol, symbol)
                
                # Get live price using 1-minute interval data
                try:
                    live_price_data = ticker.history(period="1d", interval="1m").tail(1)
                    if not live_price_data.empty:
                        live_price = live_price_data["Close"].values[0]
                    else:
                        live_price = info.get("currentPrice")
                except Exception as e:
                    live_price = info.get("currentPrice")
                    import traceback
                    traceback.print_exc()

                stock_info = {
                    "symbol": symbol,  # yfinance symbol for API calls
                    "originalSymbol": original_symbol,  # original symbol for display
                    "longName": info.get("longName", original_symbol),
                    "sector": info.get("sector", "N/A"),
                    "currentPrice": live_price,
                    "previousClose": info.get("previousClose"),
                    "marketCap": info.get("marketCap"),
                    "dayHigh": info.get("dayHigh"),
                    "dayLow": info.get("dayLow"),
                    "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
                    "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
                    # Investment data from holdings
                    "quantity": holdings_data.get(symbol, {}).get('quantity', 0),
                    "averagePrice": holdings_data.get(symbol, {}).get('average_price', 0),
                    "investedAmount": holdings_data.get(symbol, {}).get('invested_amount', 0),
                    "currentValue": holdings_data.get(symbol, {}).get('current_value', 0),
                }
                stocks_data.append(stock_info)
            except Exception as e:
                print(f"⚠️ yfinance error for {symbol}: {e}")
                import traceback
                traceback.print_exc()
        
        # Log each stock's data structure
        for i, stock in enumerate(stocks_data):
            print(f"🔍 Backend: Stock {i} currentPrice value: {stock.get('currentPrice')}")

        # Calculate portfolio totals
        total_invested_amount = sum(stock.get('investedAmount', 0) for stock in stocks_data)
        total_current_value = sum(stock.get('currentValue', 0) for stock in stocks_data)
        total_quantity = sum(stock.get('quantity', 0) for stock in stocks_data)

        return Response({
            "stocks": stocks_data,
            "portfolio_summary": {
                "total_invested_amount": total_invested_amount,
                "total_current_value": total_current_value,
                "total_quantity": total_quantity,
                "total_stocks": len(stocks_data)
            }
        })

    except Exception as e:
        print(f"❌ Error in get_stock_details: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    """Test endpoint to verify authentication is working"""
    return Response({
        "message": "Authentication successful",
        "user": request.user.username,
        "user_id": request.user.id,
        "authenticated": request.user.is_authenticated
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_stock_data(request):
    """Fetch historical stock data for charts with multiple time periods"""
    try:
        print(f"🔍 Backend: get_stock_data called for user: {request.user.username}")
        stock_symbols = request.data.get("symbols", [])
        print(f"🔍 Backend: Requested symbols: {stock_symbols}")
        print(f"🔍 Backend: Request data: {request.data}")
        print(f"🔍 Backend: Request body: {request.body}")

        stock_data = {}
        for symbol in stock_symbols:
            try:
                print(f"🔍 Backend: Fetching chart data for {symbol}")
                stock = yf.Ticker(symbol)
                
                # Fetch data for different time periods
                periods = {
                    "7d": "7d",
                    "1mo": "1mo", 
                    "3mo": "3mo",
                    "6mo": "6mo",
                    "1y": "1y",
                    "2y": "2y",
                    "5y": "5y"
                }
                
                period_data = {}
                
                for period_name, period_value in periods.items():
                    try:
                        print(f"🔍 Backend: Fetching {period_name} data for {symbol}")
                        hist = stock.history(period=period_value)
                        
                        if not hist.empty:
                            # Get live price using 1-minute interval data for consistency
                            try:
                                print(f"🔍 Backend: Attempting to get live price for {period_name} chart {symbol}")
                                live_price_data = stock.history(period="1d", interval="1m").tail(1)
                                
                                if not live_price_data.empty:
                                    live_price = live_price_data["Close"].values[0]
                                    print(f"🔍 Backend: Live price for {period_name} chart {symbol}: {live_price}")
                                else:
                                    live_price = hist["Close"].iloc[-1]
                                    print(f"🔍 Backend: Using last close for {period_name} chart {symbol}: {live_price}")
                            except Exception as e:
                                live_price = hist["Close"].iloc[-1]
                                print(f"🔍 Backend: Error getting live price for {period_name} chart {symbol}, using last close: {e}")
                            
                            # Calculate performance metrics
                            start_price = hist["Close"].iloc[0]
                            end_price = hist["Close"].iloc[-1]
                            total_return = ((end_price - start_price) / start_price) * 100
                            
                            # Calculate volatility (standard deviation of returns)
                            returns = hist["Close"].pct_change().dropna()
                            volatility = returns.std() * 100
                            
                            period_data[period_name] = {
                                "current_price": live_price,
                                "history": hist["Close"].tolist(),
                                "dates": hist.index.strftime("%Y-%m-%d").tolist(),
                                "start_price": start_price,
                                "end_price": end_price,
                                "total_return": round(total_return, 2),
                                "volatility": round(volatility, 2),
                                "data_points": len(hist)
                            }
                            
                            print(f"🔍 Backend: {period_name} data for {symbol}: {len(hist)} data points, return: {total_return:.2f}%, volatility: {volatility:.2f}%")
                        else:
                            print(f"⚠️ Backend: No {period_name} historical data for {symbol}")
                            
                    except Exception as e:
                        print(f"⚠️ Backend: Error fetching {period_name} data for {symbol}: {e}")
                        import traceback
                        traceback.print_exc()
                
                if period_data:
                    stock_data[symbol] = period_data
                    print(f"🔍 Backend: Chart data collected for {symbol}: {list(period_data.keys())}")
                else:
                    print(f"⚠️ Backend: No chart data collected for {symbol}")
                    
            except Exception as e:
                print(f"⚠️ Backend: Error fetching chart data for {symbol}: {e}")
                import traceback
                traceback.print_exc()

        print(f"🔍 Backend: Total chart data collected: {len(stock_data)} symbols")
        print(f"🔍 Backend: Chart data structure: {stock_data}")
        
        # Log detailed chart data for each symbol
        for symbol, data in stock_data.items():
            print(f"🔍 Backend: Chart data for {symbol}: {list(data.keys())} periods available")
            for period, period_info in data.items():
                print(f"🔍 Backend: {period} data for {symbol}: {period_info.get('data_points', 0)} points, return: {period_info.get('total_return', 0)}%, volatility: {period_info.get('volatility', 0)}%")
        
        return Response({"data": stock_data})
        
    except Exception as e:
        print(f"❌ Backend: Error in get_stock_data: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)