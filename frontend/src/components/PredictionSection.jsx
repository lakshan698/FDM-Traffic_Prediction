import { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";

import {
    Activity,
    CalendarDays,
    CloudRain,
    Gauge,
    LoaderCircle,
    RotateCcw,
    Sparkles,
} from "lucide-react";


// Get backend URL from the Vite environment file
const API_URL = import.meta.env.VITE_API_URL;


// Convert the numerical prediction into a simple traffic level
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


// Return the UI style for each traffic level
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
        return "Low traffic is expected. This period may be suitable for low-impact road operations or maintenance.";
    }

    if (volume < 4000) {
        return "Moderate traffic is expected. Standard traffic monitoring is recommended.";
    }

    if (volume < 6000) {
        return "High traffic is expected. Authorities should prepare congestion-management measures.";
    }

    return "Very high traffic is expected. Increased monitoring and traffic-control measures are recommended.";
}


function PredictionSection({
    backendOnline,
    setBackendOnline,
}) {
    // Store all form values
    const [form, setForm] = useState({
        date_time: "",
        temperature: "",
        rain_1h: 0,
        snow_1h: 0,
        clouds_all: 0,
        weather_main: "clear",
        is_holiday: false,
    });


    // Store the prediction returned by the backend
    const [prediction, setPrediction] = useState(null);


    // Show loading state while waiting for the model
    const [loading, setLoading] = useState(false);


    // Store prediction or connection errors
    const [error, setError] = useState("");


    // Update the correct form value
    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    // Clear all input values and previous results
    const handleReset = () => {
        setForm({
            date_time: "",
            temperature: "",
            rain_1h: 0,
            snow_1h: 0,
            clouds_all: 0,
            weather_main: "clear",
            is_holiday: false,
        });

        setPrediction(null);
        setError("");
    };


    // Send the user's values to the FastAPI backend
    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setPrediction(null);

        try {
            // Convert Celsius into Kelvin
            // because the training dataset used Kelvin
            const temperatureKelvin =
                Number(form.temperature) + 273.15;


            // Create the JSON body expected by the backend
            const requestData = {
                date_time: form.date_time,

                temp: temperatureKelvin,

                rain_1h: Number(form.rain_1h),

                snow_1h: Number(form.snow_1h),

                clouds_all: Number(form.clouds_all),

                weather_main: form.weather_main,

                is_holiday:
                    form.is_holiday ? 1 : 0,
            };


            // Send the request to the prediction endpoint
            const response = await axios.post(
                `${API_URL}/predict`,
                requestData
            );


            // Save the result returned by the model
            setPrediction(response.data);

            setBackendOnline(true);

        } catch (err) {
            console.error(
                "Prediction error:",
                err
            );


            // The backend responded but rejected the request
            if (err.response) {
                setError(
                    "Prediction failed. Please check the entered values."
                );
            }

            // The backend could not be reached
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
                        Enter the expected date, time and weather conditions.
                        The trained machine learning model will estimate the
                        expected hourly traffic volume.
                    </p>
                </motion.div>


                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">

                    {/* Prediction input form */}
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
                        className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 shadow-2xl backdrop-blur-xl"
                    >

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
                                Provide the conditions for the period you want
                                to analyse.
                            </p>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-5 sm:grid-cols-2"
                        >

                            {/* Date and time */}
                            <label className="sm:col-span-2">

                                <span className="mb-2 block text-sm text-slate-300">
                                    Date & Time
                                </span>


                                <div className="relative">

                                    <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />


                                    <input
                                        type="datetime-local"
                                        name="date_time"
                                        value={form.date_time}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-3 pl-12 pr-4 outline-none transition focus:border-cyan-400/60"
                                    />

                                </div>

                            </label>


                            {/* Temperature */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Temperature °C
                                </span>


                                <input
                                    type="number"
                                    name="temperature"
                                    value={form.temperature}
                                    onChange={handleChange}
                                    min="-50"
                                    max="55"
                                    step="0.01"
                                    required
                                    placeholder="e.g. 25"
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-cyan-400/60"
                                />

                            </label>


                            {/* Cloud coverage */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Cloud Coverage %
                                </span>


                                <input
                                    type="number"
                                    name="clouds_all"
                                    value={form.clouds_all}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    step="1"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-cyan-400/60"
                                />

                            </label>


                            {/* Rainfall */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Rainfall (1h)
                                </span>


                                <input
                                    type="number"
                                    name="rain_1h"
                                    value={form.rain_1h}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-cyan-400/60"
                                />

                            </label>


                            {/* Snowfall */}
                            <label>

                                <span className="mb-2 block text-sm text-slate-300">
                                    Snowfall (1h)
                                </span>


                                <input
                                    type="number"
                                    name="snow_1h"
                                    value={form.snow_1h}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-cyan-400/60"
                                />

                            </label>


                            {/* Weather condition */}
                            <label className="sm:col-span-2">

                                <span className="mb-2 block text-sm text-slate-300">
                                    Weather Condition
                                </span>


                                <div className="relative">

                                    <CloudRain className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />


                                    <select
                                        name="weather_main"
                                        value={form.weather_main}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-12 pr-4 outline-none transition focus:border-cyan-400/60"
                                    >
                                        <option value="clear">Clear</option>
                                        <option value="clouds">Clouds</option>
                                        <option value="drizzle">Drizzle</option>
                                        <option value="fog">Fog</option>
                                        <option value="haze">Haze</option>
                                        <option value="mist">Mist</option>
                                        <option value="rain">Rain</option>
                                        <option value="smoke">Smoke</option>
                                        <option value="snow">Snow</option>
                                        <option value="squall">Squall</option>
                                        <option value="thunderstorm">
                                            Thunderstorm
                                        </option>
                                    </select>

                                </div>

                            </label>


                            {/* Holiday option */}
                            <label className="sm:col-span-2 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-slate-900/50 px-4 py-4">

                                <div>

                                    <p className="font-medium">
                                        Public Holiday
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Enable if the selected date is a holiday.
                                    </p>

                                </div>


                                <input
                                    type="checkbox"
                                    name="is_holiday"
                                    checked={form.is_holiday}
                                    onChange={handleChange}
                                    className="h-5 w-5 accent-cyan-400"
                                />

                            </label>


                            {/* Action buttons */}
                            <div className="sm:col-span-2 grid gap-3 sm:grid-cols-[1fr_auto]">

                                {/* Predict button */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.015,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    type="submit"
                                    disabled={
                                        loading || !backendOnline
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                            Predicting...
                                        </>
                                    ) : (
                                        <>
                                            <Gauge className="h-5 w-5" />
                                            Predict Traffic Volume
                                        </>
                                    )}
                                </motion.button>


                                {/* Reset button */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.03,
                                    }}
                                    whileTap={{
                                        scale: 0.97,
                                    }}
                                    type="button"
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                    Reset
                                </motion.button>

                            </div>


                            {/* Error message */}
                            {error && (
                                <p className="sm:col-span-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                                    {error}
                                </p>
                            )}

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

                            // Initial view before prediction
                            <div className="text-center">

                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
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
                                    Enter the expected conditions to generate an
                                    AI-supported traffic volume estimate.
                                </p>


                                {/* Show model availability */}
                                <div
                                    className={`mx-auto mt-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs ${backendOnline
                                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                        : "border-red-400/20 bg-red-400/10 text-red-300"
                                        }`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${backendOnline
                                            ? "bg-emerald-400"
                                            : "bg-red-400"
                                            }`}
                                    />

                                    {backendOnline
                                        ? "Prediction model available"
                                        : "Prediction service unavailable"}
                                </div>

                            </div>

                        ) : (

                            // Show prediction result
                            <motion.div
                                key={
                                    prediction.predicted_traffic_volume
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


                                {/* Main numerical prediction */}
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


                                {/* Traffic level */}
                                <div
                                    className={`mt-5 inline-flex rounded-full border px-5 py-2 text-sm font-medium ${getTrafficLevelStyle(
                                        prediction.predicted_traffic_volume
                                    )}`}
                                >
                                    {getTrafficLevel(
                                        prediction.predicted_traffic_volume
                                    )}
                                </div>


                                {/* Operational recommendation */}
                                <div className="mx-auto mt-8 max-w-md rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-5 text-left">

                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
                                        Operational Insight
                                    </p>


                                    <p className="mt-3 text-sm leading-6 text-slate-300">
                                        {getRecommendation(
                                            prediction.predicted_traffic_volume
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