from pathlib import Path

import joblib

from app.schemas import TrafficPredictionRequest
from app.services.feature_engineering import create_model_features


# Get the backend folder path
BACKEND_DIR = Path(__file__).resolve().parents[2]

# Path to the saved final model
MODEL_PATH = (
    BACKEND_DIR
    / "model"
    / "Final_Traffic_Volume_Model.joblib"
)


# Check whether the model file exists
if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}"
    )


# Load the model package only once when backend starts
model_package = joblib.load(MODEL_PATH)

# Get the trained pipeline from the package
model_pipeline = model_package["pipeline"]

# Get the selected model name
model_name = model_package["model_name"]


def predict_traffic(
    request: TrafficPredictionRequest,
) -> dict:
    """
    Create model features and predict traffic volume.
    """

    # Convert raw user input into the 27 model features
    features = create_model_features(request)

    # Generate the traffic volume prediction
    prediction = model_pipeline.predict(features)[0]

    # Traffic volume is a count, so return a rounded integer
    predicted_volume = int(round(prediction))

    return {
        "predicted_traffic_volume": predicted_volume,
        "model_name": model_name,
    }