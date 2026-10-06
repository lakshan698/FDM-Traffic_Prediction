# TrafficFlow AI – Traffic Volume Prediction System

TrafficFlow AI is a machine learning-based web application developed for the Fundamentals of Data Mining assignment. The system predicts hourly traffic volume using weather, date/time, and calendar-related information.

The project includes a trained machine learning model, a FastAPI backend, and a responsive React frontend.

---

## Features

- Predict hourly traffic volume
- User-friendly prediction form
- Date and time-based feature engineering
- Weather-based input processing
- Public holiday support
- Input validation
- Traffic level indication
- Backend health/model status
- Animated and responsive user interface
- Reset prediction form
- REST API integration between frontend and backend

---

## Final Machine Learning Model

Several regression algorithms were developed and evaluated:

- Linear Regression
- K-Nearest Neighbors Regressor
- Decision Tree Regressor
- Random Forest Regressor
- Gradient Boosting Regressor

The final model was selected using the lowest Time-Series Cross-Validation RMSE.

### Selected Model

**Random Forest Regressor**

| Metric | Result |
|---|---:|
| CV RMSE | 441.11 |
| Test MAE | 249.42 |
| Test RMSE | 413.72 |
| Test R² | 0.9559 |

Hyperparameter tuning was performed using cross-validation before final model selection.

---

## System Architecture

```text
User
  ↓
React Frontend
  ↓
FastAPI Backend
  ↓
Input Validation
  ↓
Feature Engineering
  ↓
Saved ML Pipeline
  ↓
Random Forest Model
  ↓
Traffic Volume Prediction
  ↓
Frontend Result
