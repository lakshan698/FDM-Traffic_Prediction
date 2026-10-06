from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    TrafficPredictionRequest,
    TrafficPredictionResponse,
)
from app.services.model_service import (
    predict_traffic,
    model_name,
)


# Create the FastAPI application
app = FastAPI(
    title="Traffic Volume Prediction API",
    description="API for predicting traffic volume using the trained ML model.",
    version="1.0.0",
)


# Allow the frontend to communicate with the backend
# These ports are commonly used by React/Vite frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Simple root endpoint
@app.get("/")
def root():
    return {
        "message": "Traffic Volume Prediction API is running."
    }


# Health endpoint to check whether the backend and model are ready
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": True,
        "model_name": model_name,
    }


# Main prediction endpoint
@app.post(
    "/predict",
    response_model=TrafficPredictionResponse,
)
def predict(request: TrafficPredictionRequest):

    try:
        # Send validated user input to the model service
        result = predict_traffic(request)

        # Return the prediction to the frontend
        return result

    except Exception as error:

        # Return a clear error if prediction fails
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}",
        )