import joblib
import pandas as pd
from datetime import datetime


# Load trained model
model = joblib.load("models/arma_inflation.pkl")


def predict_inflation(year):
    current_year = datetime.now().year
    current_month = datetime.now().month

    try:
        # Generate future dates till requested year end
        end_date = f"{year}-12-01"
        future_dates = pd.date_range(
            start=datetime(current_year, current_month, 1),
            end=end_date,
            freq="MS",  # Month Start
        )

        # Forecast horizon
        steps = len(future_dates)

        # Check if model is defined
        if "model" not in globals():
            raise ValueError("Model is not defined.")

        forecast = model.forecast(steps=steps)

        return future_dates, forecast
    except Exception as e:
        print(f"Error in predict_inflation: {e}")
        return None
