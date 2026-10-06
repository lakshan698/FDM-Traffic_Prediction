from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


WeatherType = Literal[
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


class TrafficPredictionRequest(BaseModel):
    date_time: datetime

    # Dataset temperature is in Kelvin
    temp: float = Field(
        ...,
        gt=0,
        le=330,
        description="Temperature in Kelvin",
    )

    rain_1h: float = Field(
        default=0,
        ge=0,
        description="Rainfall in the previous hour",
    )

    snow_1h: float = Field(
        default=0,
        ge=0,
        description="Snowfall in the previous hour",
    )

    clouds_all: float = Field(
        ...,
        ge=0,
        le=100,
        description="Cloud coverage percentage",
    )

    weather_main: WeatherType

    is_holiday: int = Field(
        default=0,
        ge=0,
        le=1,
        description="1 if holiday, otherwise 0",
    )


class TrafficPredictionResponse(BaseModel):
    predicted_traffic_volume: int
    model_name: str