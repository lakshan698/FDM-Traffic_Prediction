import { useEffect, useState } from "react";
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


// Get backend URL from .env file
const API_URL = import.meta.env.VITE_API_URL;


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


// Give a different style for each traffic level
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


function App() {
  // Store user input values
  const [form, setForm] = useState({
    date_time: "",
    temperature: "",
    rain_1h: 0,
    snow_1h: 0,
    clouds_all: 0,
    weather_main: "clear",
    is_holiday: false,
  });


  // Store prediction result
  const [prediction, setPrediction] = useState(null);


  // Store loading state
  const [loading, setLoading] = useState(false);


  // Store error message
  const [error, setError] = useState("");


  // Store backend connection status
  const [backendOnline, setBackendOnline] = useState(false);


  // Check whether backend and model are available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(`${API_URL}/health`);

        setBackendOnline(true);
      } catch (err) {
        console.error("Backend health check failed:", err);

        setBackendOnline(false);
      }
    };

    checkBackend();
  }, []);


  // Update form values when the user changes an input
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


  // Reset all inputs and clear previous result
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


  // Send input data to FastAPI backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      // Convert Celsius to Kelvin
      // because the ML model was trained using Kelvin
      const temperatureKelvin =
        Number(form.temperature) + 273.15;


      // Create request body for the backend
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


      // Send prediction request to FastAPI
      const response = await axios.post(
        `${API_URL}/predict`,
        requestData
      );


      // Save prediction result
      setPrediction(response.data);

      setBackendOnline(true);

    } catch (err) {
      console.error(
        "Prediction error:",
        err
      );


      // Backend returned an error response
      if (err.response) {
        setError(
          "Prediction failed. Please check the entered values."
        );
      }

      // Backend cannot be reached
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Animated cyan background */}
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
        animate={{
          x: [0, 70, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />


      {/* Animated blue background */}
      <motion.div
        className="absolute -bottom-40 -right-24 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-3xl"
        animate={{
          x: [0, -60, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
      />


      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10">

        {/* Header */}
        <motion.header
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10 flex items-center justify-between"
        >

          {/* Logo area */}
          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-cyan-400/10 p-3 ring-1 ring-cyan-400/30">

              <Activity className="h-7 w-7 text-cyan-300" />

            </div>


            <div>

              <h1 className="text-xl font-semibold">
                TrafficFlow AI
              </h1>

              <p className="text-sm text-slate-400">
                Intelligent Traffic Volume Prediction
              </p>

            </div>

          </div>


          {/* Backend status */}
          <div
            className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm sm:flex ${backendOnline
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
              ? "Model Ready"
              : "Backend Offline"}

          </div>

        </motion.header>


        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Input form card */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
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


              <h2 className="text-3xl font-bold">
                Predict Traffic Volume
              </h2>


              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter the current date, weather, and road
                conditions to estimate traffic volume.
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

              </label>


              {/* Holiday selection */}
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


              {/* Show error message */}
              {error && (
                <p className="sm:col-span-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                  {error}
                </p>
              )}

            </form>

          </motion.div>


          {/* Prediction result card */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
            className="flex min-h-[500px] flex-col justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-white/[0.04] to-indigo-500/10 p-8 shadow-2xl backdrop-blur-xl"
          >

            {!prediction ? (

              // Initial state before prediction
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
                  Fill in the traffic conditions and let the
                  trained machine learning model estimate the
                  expected traffic volume.
                </p>

              </div>

            ) : (

              // Prediction result
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


                {/* Human-readable traffic level */}
                <div
                  className={`mt-5 inline-flex rounded-full border px-5 py-2 text-sm font-medium ${getTrafficLevelStyle(
                    prediction.predicted_traffic_volume
                  )}`}
                >

                  {getTrafficLevel(
                    prediction.predicted_traffic_volume
                  )}

                </div>


                {/* Model information */}
                <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-white/10 bg-black/20 p-5">

                  <p className="text-sm text-slate-500">
                    Prediction Model
                  </p>


                  <p className="mt-1 text-lg font-semibold text-emerald-300">
                    {prediction.model_name}
                  </p>

                </div>

              </motion.div>

            )}

          </motion.div>

        </div>

      </div>

    </div>
  );
}


export default App;