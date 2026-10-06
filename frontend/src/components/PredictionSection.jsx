import { useRef, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";

import {
    Activity,
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CloudRain,
    Gauge,
    LoaderCircle,
    LocateFixed,
    RotateCcw,
    Sparkles,
} from "lucide-react";


// Backend URL from .env
const API_URL = import.meta.env.VITE_API_URL;


// Input limits based on the valid historical data range
const MIN_TEMPERATURE = -50;
const MAX_TEMPERATURE = 55;

const MIN_CLOUD_COVERAGE = 0;
const MAX_CLOUD_COVERAGE = 100;

const MIN_RAINFALL = 0;
const MAX_RAINFALL = 100;

const MIN_SNOWFALL = 0;
const MAX_SNOWFALL = 0.51;


// Supported weather conditions
const WEATHER_OPTIONS = [
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
];


// Convert predicted traffic volume into a simple traffic level
function getTrafficLevel(volume) {
    if (volume < 2000) {
        return "Low Traffic";
    }

    if (volume < 4000) {
        return "Moderate Traffic";
    }

    if (volume < 6000) {
        return "High Traffic";
    }

    return "Very High Traffic";
}


// Return UI style based on traffic level
function getTrafficLevelStyle(volume) {
    if (volume < 2000) {
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    if (volume < 4000) {
        return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    }

    if (volume < 6000) {
        return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    }

    return "border-red-400/20 bg-red-400/10 text-red-300";
}


// Give a simple operational recommendation
function getRecommendation(volume) {
    if (volume < 2000) {
        return "Low traffic is expected. This period may be suitable for normal operations or lower-impact road activities.";
    }

    if (volume < 4000) {
        return "Moderate traffic is expected. Standard traffic monitoring is recommended.";
    }

    if (volume < 6000) {
        return "High traffic is expected. Authorities should prepare congestion-management measures.";
    }

    return "Very high traffic is expected. Increased monitoring and stronger traffic-control measures are recommended.";
}


// Convert values such as 5 into 05
function padNumber(value) {
    return String(value).padStart(2, "0");
}


// Get the user's current local date and time
function getCurrentDateAndTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = padNumber(now.getMonth() + 1);
    const day = padNumber(now.getDate());

    const hours = padNumber(now.getHours());
    const minutes = padNumber(now.getMinutes());

    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
    };
}


function PredictionSection({
    backendOnline,
    setBackendOnline,
}) {
    // References used to open native calendar and time pickers
    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);


    // Store form values
    const [form, setForm] = useState({
        date: "",
        time: "",
        temperature: "",
        rain_1h: 0,
        snow_1h: 0,
        clouds_all: 0,
        weather_main: "clear",
        is_holiday: false,
    });


    // Store field-level validation errors
    const [validationErrors, setValidationErrors] =
        useState({});


    // Store prediction result
    const [prediction, setPrediction] =
        useState(null);


    // Loading state
    const [loading, setLoading] =
        useState(false);


    // General error message
    const [error, setError] =
        useState("");


    // Update input values
    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        const newValue =
            type === "checkbox"
                ? checked
                : value;


        setForm((previous) => ({
            ...previous,
            [name]: newValue,
        }));


        // Clear field error while the user corrects it
        setValidationErrors((previous) => ({
            ...previous,
            [name]: "",
        }));


        setError("");
    };


    // Automatically use current local date and time
    const handleUseCurrentDateTime = () => {
        const current =
            getCurrentDateAndTime();


        setForm((previous) => ({
            ...previous,
            date: current.date,
            time: current.time,
        }));


        setValidationErrors((previous) => ({
            ...previous,
            date: "",
            time: "",
        }));


        setError("");
    };


    // Open native calendar picker
    const openDatePicker = () => {
        if (dateInputRef.current?.showPicker) {
            dateInputRef.current.showPicker();
        } else {
            dateInputRef.current?.focus();
        }
    };


    // Open native time picker
    const openTimePicker = () => {
        if (timeInputRef.current?.showPicker) {
            timeInputRef.current.showPicker();
        } else {
            timeInputRef.current?.focus();
        }
    };


    // Validate all user inputs
    const validateForm = () => {
        const errors = {};


        // Date validation
        if (!form.date) {
            errors.date =
                "Please select or enter a date.";
        }


        // Time validation
        if (!form.time) {
            errors.time =
                "Please select or enter a time.";
        }


        // Temperature validation
        if (
            form.temperature === "" ||
            form.temperature === null
        ) {
            errors.temperature =
                "Temperature is required.";
        } else {
            const temperature =
                Number(form.temperature);


            if (Number.isNaN(temperature)) {
                errors.temperature =
                    "Enter a valid temperature.";
            } else if (
                temperature < MIN_TEMPERATURE ||
                temperature > MAX_TEMPERATURE
            ) {
                errors.temperature =
                    `Temperature must be between ${MIN_TEMPERATURE}°C and ${MAX_TEMPERATURE}°C.`;
            }
        }


        // Cloud coverage validation
        if (
            form.clouds_all === "" ||
            form.clouds_all === null
        ) {
            errors.clouds_all =
                "Cloud coverage is required.";
        } else {
            const clouds =
                Number(form.clouds_all);


            if (Number.isNaN(clouds)) {
                errors.clouds_all =
                    "Enter a valid cloud coverage value.";
            } else if (
                clouds < MIN_CLOUD_COVERAGE ||
                clouds > MAX_CLOUD_COVERAGE
            ) {
                errors.clouds_all =
                    "Cloud coverage must be between 0% and 100%.";
            }
        }


        // Rainfall validation
        if (
            form.rain_1h === "" ||
            form.rain_1h === null
        ) {
            errors.rain_1h =
                "Rainfall value is required.";
        } else {
            const rainfall = Number(form.rain_1h);

            if (Number.isNaN(rainfall)) {
                errors.rain_1h =
                    "Please enter a valid hourly rainfall value.";
            } else if (rainfall < MIN_RAINFALL) {
                errors.rain_1h =
                    "Rainfall cannot be negative.";
            } else if (rainfall > MAX_RAINFALL) {
                errors.rain_1h =
                    "Please enter an hourly rainfall value between 0 and 100 mm. Higher values are outside the range supported by this prediction model.";
            }
        }


        // Snowfall validation
        if (
            form.snow_1h === "" ||
            form.snow_1h === null
        ) {
            errors.snow_1h =
                "Snowfall value is required.";
        } else {
            const snowfall = Number(form.snow_1h);

            if (Number.isNaN(snowfall)) {
                errors.snow_1h =
                    "Please enter a valid hourly snowfall value.";
            } else if (snowfall < MIN_SNOWFALL) {
                errors.snow_1h =
                    "Snowfall cannot be negative.";
            } else if (snowfall > MAX_SNOWFALL) {
                errors.snow_1h =
                    "Please enter snowfall between 0 and 0.51 mm per hour. Higher values were not represented in the training data.";
            }
        }


        // Weather validation
        if (
            !WEATHER_OPTIONS.includes(
                form.weather_main
            )
        ) {
            errors.weather_main =
                "Please select a valid weather condition.";
        }


        setValidationErrors(errors);


        // Valid only when there are no errors
        return Object.keys(errors).length === 0;
    };


    // Reset all values and results
    const handleReset = () => {
        setForm({
            date: "",
            time: "",
            temperature: "",
            rain_1h: 0,
            snow_1h: 0,
            clouds_all: 0,
            weather_main: "clear",
            is_holiday: false,
        });

        setPrediction(null);
        setValidationErrors({});
        setError("");
    };


    // Send prediction request
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setPrediction(null);


        // First layer: frontend validation
        const isValid =
            validateForm();


        if (!isValid) {
            setError(
                "Please correct the highlighted fields before generating a prediction."
            );

            return;
        }


        setLoading(true);


        try {
            // Convert Celsius into Kelvin
            // because model training data used Kelvin
            const temperatureKelvin =
                Number(form.temperature) + 273.15;


            // Combine selected date and time
            const selectedDateTime =
                `${form.date}T${form.time}:00`;


            // Build request body
            const requestData = {
                date_time: selectedDateTime,

                temp: temperatureKelvin,

                rain_1h:
                    Number(form.rain_1h),

                snow_1h:
                    Number(form.snow_1h),

                clouds_all:
                    Number(form.clouds_all),

                weather_main:
                    form.weather_main,

                is_holiday:
                    form.is_holiday ? 1 : 0,
            };


            // Send validated values to FastAPI
            const response = await axios.post(
                `${API_URL}/predict`,
                requestData
            );


            // Store prediction result
            setPrediction(response.data);

            setBackendOnline(true);

        } catch (err) {
            console.error(
                "Prediction error:",
                err
            );


            // Backend Pydantic validation error
            if (
                err.response?.status === 422
            ) {
                setError(
                    "The server rejected one or more input values. Please review the entered conditions."
                );
            }

            // Other backend error
            else if (err.response) {
                setError(
                    "Prediction could not be generated. Please check the entered values."
                );
            }

            // Backend connection error
            else {
                setError(
                    "Cannot connect to the prediction server."
                );

                setBackendOnline(false);
            }

        } finally {
            setLoading(false);
        }
    };


    // Input style changes when validation fails
    const getInputClass = (fieldName) => {
        const hasError =
            validationErrors[fieldName];

        return `
      w-full rounded-xl border bg-slate-800/70
      px-4 py-3 text-white outline-none transition
      ${hasError
                ? "border-red-400/70 focus:border-red-400"
                : "border-white/10 focus:border-cyan-400/60"
            }
    `;
    };


    return (
        <section
            id="prediction"
            className="relative py-24"
        >

            {/* Background glow */}
            <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />


            <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

                {/* Section heading */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mb-12 max-w-3xl"
                >

                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                        Live Prediction
                    </p>


                    <h2 className="mt-4 text-4xl font-bold sm:text-5xl">

                        Estimate upcoming

                        <span className="text-cyan-300">
                            {" "}traffic demand
                        </span>

                    </h2>


                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
                        Select the date, time and expected weather
                        conditions. The system validates all information
                        before generating the traffic forecast.
                    </p>

                </motion.div>


                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">

                    {/* Input panel */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl"
                    >

                        {/* Form title */}
                        <div className="mb-7">

                            <div className="mb-2 flex items-center gap-2 text-cyan-300">

                                <Sparkles className="h-5 w-5" />

                                <span className="text-sm font-medium">
                                    AI Prediction
                                </span>

                            </div>


                            <h3 className="text-2xl font-bold">
                                Traffic Conditions
                            </h3>


                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Enter the expected conditions for the
                                period you want to analyse.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="grid gap-5 sm:grid-cols-2"
                        >

                            {/* Current date and time */}
                            <div className="sm:col-span-2">

                                <motion.button
                                    whileHover={{
                                        scale: 1.01,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    type="button"
                                    onClick={
                                        handleUseCurrentDateTime
                                    }
                                    className="flex w-full items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-3 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.1]"
                                >

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-lg bg-cyan-400/10 p-2">

                                            <LocateFixed className="h-5 w-5 text-cyan-300" />

                                        </div>


                                        <div>

                                            <p className="text-sm font-medium text-cyan-200">
                                                Use Current Date & Time
                                            </p>


                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Automatically use your device's local date and time
                                            </p>

                                        </div>

                                    </div>


                                    <span className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300 sm:block">
                                        Use Now
                                    </span>

                                </motion.button>

                            </div>


                            {/* Date */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Select Date *
                                </span>


                                <div className="relative">

                                    <button
                                        type="button"
                                        onClick={
                                            openDatePicker
                                        }
                                        className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-cyan-300 transition hover:bg-cyan-400/10"
                                        aria-label="Open calendar"
                                        title="Open calendar"
                                    >

                                        <CalendarDays className="h-5 w-5" />

                                    </button>


                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        className={`${getInputClass(
                                            "date"
                                        )} pl-12`}
                                    />

                                </div>


                                <p className="mt-1 text-xs text-slate-500">
                                    Type manually or use the calendar.
                                </p>


                                {validationErrors.date && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-red-300">

                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                                        {validationErrors.date}

                                    </p>
                                )}

                            </label>


                            {/* Time */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Select Time *
                                </span>


                                <div className="relative">

                                    <button
                                        type="button"
                                        onClick={
                                            openTimePicker
                                        }
                                        className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-cyan-300 transition hover:bg-cyan-400/10"
                                        aria-label="Open time picker"
                                        title="Open time picker"
                                    >

                                        <Clock3 className="h-5 w-5" />

                                    </button>


                                    <input
                                        ref={timeInputRef}
                                        type="time"
                                        name="time"
                                        value={form.time}
                                        onChange={handleChange}
                                        step="60"
                                        className={`${getInputClass(
                                            "time"
                                        )} pl-12`}
                                    />

                                </div>


                                <p className="mt-1 text-xs text-slate-500">
                                    Type manually or use the clock.
                                </p>


                                {validationErrors.time && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-red-300">

                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                                        {validationErrors.time}

                                    </p>
                                )}

                            </label>


                            {/* Temperature */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Temperature °C *
                                </span>


                                <input
                                    type="number"
                                    name="temperature"
                                    value={
                                        form.temperature
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min={
                                        MIN_TEMPERATURE
                                    }
                                    max={
                                        MAX_TEMPERATURE
                                    }
                                    step="0.01"
                                    placeholder="e.g. 25"
                                    className={
                                        getInputClass(
                                            "temperature"
                                        )
                                    }
                                />


                                <p className="mt-1 text-xs text-slate-500">
                                    Allowed: -50°C to 55°C
                                </p>


                                {validationErrors.temperature && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-red-300">

                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                                        {validationErrors.temperature}

                                    </p>
                                )}

                            </label>


                            {/* Cloud coverage */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Cloud Coverage % *
                                </span>


                                <input
                                    type="number"
                                    name="clouds_all"
                                    value={
                                        form.clouds_all
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min={
                                        MIN_CLOUD_COVERAGE
                                    }
                                    max={
                                        MAX_CLOUD_COVERAGE
                                    }
                                    step="1"
                                    className={
                                        getInputClass(
                                            "clouds_all"
                                        )
                                    }
                                />


                                <p className="mt-1 text-xs text-slate-500">
                                    Allowed: 0% to 100%
                                </p>


                                {validationErrors.clouds_all && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-red-300">

                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                                        {validationErrors.clouds_all}

                                    </p>
                                )}

                            </label>


                            {/* Rainfall */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Rainfall (1h) *
                                </span>


                                <input
                                    type="number"
                                    name="rain_1h"
                                    value={form.rain_1h}
                                    onChange={handleChange}
                                    min={MIN_RAINFALL}
                                    max={MAX_RAINFALL}
                                    step="0.01"
                                    className={getInputClass("rain_1h")}
                                />

                                <p className="mt-1 text-xs text-slate-500">
                                    Supported range: 0–100 mm/hour
                                </p>


                                <p className="mt-1 text-xs text-slate-500">
                                    Allowed: 0 to 55.63 mm/hour
                                </p>


                                {validationErrors.rain_1h && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-red-300">

                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                                        {validationErrors.rain_1h}

                                    </p>
                                )}

                            </label>


                            {/* Snowfall */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Snowfall (1h) *
                                </span>


                                <input
                                    type="number"
                                    name="snow_1h"
                                    value={form.snow_1h}
                                    onChange={handleChange}
                                    min={MIN_SNOWFALL}
                                    max={MAX_SNOWFALL}
                                    step="0.01"
                                    className={getInputClass("snow_1h")}
                                />

                                <p className="mt-1 text-xs text-slate-500">
                                    Supported range: 0–0.51 mm/hour
                                </p>


                                <p className="mt-1 text-xs text-slate-500">
                                    Allowed: 0 to 0.51 mm/hour
                                </p>


                                {validationErrors.snow_1h && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-red-300">

                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                                        {validationErrors.snow_1h}

                                    </p>
                                )}

                            </label>


                            {/* Weather */}
                            <label className="sm:col-span-2">

                                <span className="mb-2 block text-sm text-slate-300">
                                    Weather Condition *
                                </span>


                                <div className="relative">

                                    <CloudRain className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />


                                    <select
                                        name="weather_main"
                                        value={
                                            form.weather_main
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={`${getInputClass(
                                            "weather_main"
                                        )} pl-12`}
                                    >

                                        <option value="clear">
                                            Clear
                                        </option>

                                        <option value="clouds">
                                            Clouds
                                        </option>

                                        <option value="drizzle">
                                            Drizzle
                                        </option>

                                        <option value="fog">
                                            Fog
                                        </option>

                                        <option value="haze">
                                            Haze
                                        </option>

                                        <option value="mist">
                                            Mist
                                        </option>

                                        <option value="rain">
                                            Rain
                                        </option>

                                        <option value="smoke">
                                            Smoke
                                        </option>

                                        <option value="snow">
                                            Snow
                                        </option>

                                        <option value="squall">
                                            Squall
                                        </option>

                                        <option value="thunderstorm">
                                            Thunderstorm
                                        </option>

                                    </select>

                                </div>


                                {validationErrors.weather_main && (
                                    <p className="mt-2 flex items-center gap-1 text-xs text-red-300">

                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />

                                        {validationErrors.weather_main}

                                    </p>
                                )}

                            </label>


                            {/* Public holiday */}
                            <label className="sm:col-span-2 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-slate-800/50 px-4 py-4">

                                <div>

                                    <p className="font-medium">
                                        Public Holiday
                                    </p>


                                    <p className="text-xs text-slate-500">
                                        Enable if the selected date is a public holiday.
                                    </p>

                                </div>


                                <input
                                    type="checkbox"
                                    name="is_holiday"
                                    checked={
                                        form.is_holiday
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-5 w-5 accent-cyan-400"
                                />

                            </label>


                            {/* General validation/API error */}
                            {error && (
                                <div className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">

                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />


                                    <p>
                                        {error}
                                    </p>

                                </div>
                            )}


                            {/* Action buttons */}
                            <div className="sm:col-span-2 grid gap-3 sm:grid-cols-[1fr_auto]">

                                {/* Predict */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.015,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    type="submit"
                                    disabled={
                                        loading ||
                                        !backendOnline
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {loading ? (
                                        <>
                                            <LoaderCircle className="h-5 w-5 animate-spin" />

                                            Validating & Predicting...
                                        </>
                                    ) : (
                                        <>
                                            <Gauge className="h-5 w-5" />

                                            Predict Traffic Volume
                                        </>
                                    )}

                                </motion.button>


                                {/* Reset */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.03,
                                    }}
                                    whileTap={{
                                        scale: 0.97,
                                    }}
                                    type="button"
                                    onClick={
                                        handleReset
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                >

                                    <RotateCcw className="h-5 w-5" />

                                    Reset

                                </motion.button>

                            </div>

                        </form>

                    </motion.div>


                    {/* Prediction result panel */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 40,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        className="flex min-h-[560px] flex-col justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-white/[0.04] to-indigo-500/10 p-8 shadow-2xl backdrop-blur-xl"
                    >

                        {!prediction ? (

                            // Before prediction
                            <div className="text-center">

                                <motion.div
                                    animate={{
                                        y: [
                                            0,
                                            -10,
                                            0,
                                        ],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                    }}
                                    className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/10"
                                >

                                    <Activity className="h-11 w-11 text-cyan-300" />

                                </motion.div>


                                <h3 className="text-2xl font-semibold">
                                    Ready to Predict
                                </h3>


                                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                                    Enter valid traffic and weather conditions
                                    to generate the expected traffic estimate.
                                </p>


                                {/* Service status */}
                                <div
                                    className={`mx-auto mt-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs ${backendOnline
                                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                        : "border-red-400/20 bg-red-400/10 text-red-300"
                                        }`}
                                >

                                    {backendOnline ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}


                                    {backendOnline
                                        ? "Prediction service available"
                                        : "Prediction service unavailable"}

                                </div>

                            </div>

                        ) : (

                            // After prediction
                            <motion.div
                                key={
                                    prediction
                                        .predicted_traffic_volume
                                }
                                initial={{
                                    opacity: 0,
                                    scale: 0.9,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                className="text-center"
                            >

                                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                                    Predicted Traffic
                                </p>


                                {/* Traffic volume */}
                                <motion.p
                                    initial={{
                                        y: 20,
                                    }}
                                    animate={{
                                        y: 0,
                                    }}
                                    className="mt-5 text-7xl font-bold tracking-tight"
                                >

                                    {prediction
                                        .predicted_traffic_volume
                                        .toLocaleString()}

                                </motion.p>


                                <p className="mt-2 text-lg text-slate-400">
                                    vehicles / hour
                                </p>


                                {/* Traffic category */}
                                <div
                                    className={`mt-5 inline-flex rounded-full border px-5 py-2 text-sm font-medium ${getTrafficLevelStyle(
                                        prediction
                                            .predicted_traffic_volume
                                    )}`}
                                >

                                    {getTrafficLevel(
                                        prediction
                                            .predicted_traffic_volume
                                    )}

                                </div>


                                {/* Recommendation */}
                                <div className="mx-auto mt-8 max-w-md rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-5 text-left">

                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
                                        Operational Insight
                                    </p>


                                    <p className="mt-3 text-sm leading-6 text-slate-300">

                                        {getRecommendation(
                                            prediction
                                                .predicted_traffic_volume
                                        )}

                                    </p>

                                </div>

                            </motion.div>

                        )}

                    </motion.div>

                </div>

            </div>

        </section>
    );
}


export default PredictionSection;