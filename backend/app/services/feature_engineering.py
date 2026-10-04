import numpy as np
import pandas as pd

from app.schemas import TrafficPredictionRequest


# Same weather categories created in Stage 4
WEATHER_CATEGORIES = [
    "clear",
    "clouds",
    "drizzle",
    "fog",
    "haze",
    "mist",
    "rain",
    "smoke",
    "snow",
    "squall",
    "thunderstorm",
]


# Exact input columns expected by the final model pipeline
MODEL_FEATURES = [
    "temp",
    "rain_1h",
    "snow_1h",
    "clouds_all",

    "is_rain",
    "is_snow",

    "weather_clear",
    "weather_clouds",
    "weather_drizzle",
    "weather_fog",
    "weather_haze",
    "weather_mist",
    "weather_rain",
    "weather_smoke",
    "weather_snow",
    "weather_squall",
    "weather_thunderstorm",

    "is_holiday",
    "is_weekend",

    "year",
    "hour",
    "day_of_week",
    "month",

    "hour_sin",
    "hour_cos",
    "month_sin",
    "month_cos",
]


def create_model_features(
    request: TrafficPredictionRequest
) -> pd.DataFrame:

    # -----------------------------
    # 1. Raw values
    # -----------------------------
    date_time = request.date_time
    weather_main = request.weather_main.lower()

    temp = float(request.temp)
    rain_1h = float(request.rain_1h)
    snow_1h = float(request.snow_1h)
    clouds_all = float(request.clouds_all)

    # -----------------------------
    # 2. Rain / snow indicators
    # Same logic as Stage 4
    # -----------------------------
    is_rain = int(
        rain_1h > 0
        or weather_main in [
            "rain",
            "drizzle",
            "thunderstorm",
        ]
    )

    is_snow = int(
        snow_1h > 0
        or weather_main == "snow"
    )

    # -----------------------------
    # 3. Handle invalid numerical
    # observations as Stage 4 did
    # -----------------------------
    if temp == 0:
        temp = np.nan

    if rain_1h > 100:
        rain_1h = np.nan

    # -----------------------------
    # 4. Weather indicator columns
    # -----------------------------
    weather_features = {}

    for category in WEATHER_CATEGORIES:
        weather_features[
            f"weather_{category}"
        ] = int(weather_main == category)

    # -----------------------------
    # 5. Date/time features
    # -----------------------------
    year = date_time.year
    hour = date_time.hour
    month = date_time.month
    day_of_week = date_time.strftime("%A")

    is_weekend = int(
        date_time.weekday() >= 5
    )

    # -----------------------------
    # 6. Cyclical time features
    # Same formulas as Stage 4
    # -----------------------------
    hour_sin = np.sin(
        2 * np.pi * hour / 24
    )

    hour_cos = np.cos(
        2 * np.pi * hour / 24
    )

    month_sin = np.sin(
        2 * np.pi * month / 12
    )

    month_cos = np.cos(
        2 * np.pi * month / 12
    )

    # -----------------------------
    # 7. Build final feature row
    # -----------------------------
    row = {
        "temp": temp,
        "rain_1h": rain_1h,
        "snow_1h": snow_1h,
        "clouds_all": clouds_all,

        "is_rain": is_rain,
        "is_snow": is_snow,

        **weather_features,

        "is_holiday": request.is_holiday,
        "is_weekend": is_weekend,

        "year": year,
        "hour": hour,
        "day_of_week": day_of_week,
        "month": month,

        "hour_sin": hour_sin,
        "hour_cos": hour_cos,
        "month_sin": month_sin,
        "month_cos": month_cos,
    }

    # Exact column order used during training
    features_df = pd.DataFrame(
        [row],
        columns=MODEL_FEATURES,
    )

    return features_df