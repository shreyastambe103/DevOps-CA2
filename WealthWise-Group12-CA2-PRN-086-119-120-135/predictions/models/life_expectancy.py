import joblib
import pandas as pd

# Load model
loaded_model = joblib.load("models/life_expectancy_xgb_pipeline.pkl")


def predict_life_expectancy(user_data: dict) -> float:
    """
    Predict life expectancy for a single person.

    Example usage
    user_data = {
        "Height": 170,
        "Weight": 65,
        "Gender": "Male",
        "BMI": 24.5,
        "Physical_Activity": "Moderate",
        "Smoking_Status": "Never",
        "Alcohol_Consumption": "Low",
        "Diet": "Balanced",
        "Blood_Pressure": "Normal",
        "Cholesterol": 180,
        "Asthma": 0,
        "Diabetes": 0,
        "Heart_Disease": 0,
        "Hypertension": 0,
    }
    """
    # Convert to DataFrame for pipeline compatibility
    df = pd.DataFrame([user_data])

    # Predict
    prediction = loaded_model.predict(df)[0]

    return round(float(prediction), 2)
