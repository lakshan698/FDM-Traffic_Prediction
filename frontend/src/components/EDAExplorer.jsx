import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
    BarChart3,
    CalendarDays,
    Clock3,
    CloudSun,
    Database,
    Info,
    TrendingUp,
    X,
} from "lucide-react";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";


// Historical weekday and weekend traffic averages
const hourlyData = [
    { hour: "7 AM", weekday: 6030, weekend: 1589 },
    { hour: "8 AM", weekday: 5503, weekend: 2339 },
    { hour: "9 AM", weekday: 4895, weekend: 3112 },
    { hour: "10 AM", weekday: 4378, weekend: 3687 },
    { hour: "11 AM", weekday: 4633, weekend: 4044 },
    { hour: "12 PM", weekday: 4855, weekend: 4372 },
    { hour: "1 PM", weekday: 4859, weekend: 4362 },
    { hour: "2 PM", weekday: 5153, weekend: 4359 },
    { hour: "3 PM", weekday: 5593, weekend: 4342 },
    { hour: "4 PM", weekday: 6189, weekend: 4340 },
    { hour: "5 PM", weekday: 5785, weekend: 4152 },
    { hour: "6 PM", weekday: 4434, weekend: 3812 },
];


// Number of records under each weather condition
const weatherData = [
    { weather: "Clouds", count: 15164 },
    { weather: "Clear", count: 13391 },
    { weather: "Mist", count: 5950 },
    { weather: "Rain", count: 5672 },
    { weather: "Snow", count: 2876 },
    { weather: "Drizzle", count: 1821 },
    { weather: "Haze", count: 1360 },
    { weather: "Thunderstorm", count: 1034 },
    { weather: "Fog", count: 912 },
    { weather: "Smoke", count: 20 },
    { weather: "Squall", count: 4 },
];


// Average daytime traffic by month
const monthlyData = [
    { month: "Jan", traffic: 4496 },
    { month: "Feb", traffic: 4711 },
    { month: "Mar", traffic: 4889 },
    { month: "Apr", traffic: 4907 },
    { month: "May", traffic: 4911 },
    { month: "Jun", traffic: 4898 },
    { month: "Jul", traffic: 4595 },
    { month: "Aug", traffic: 4928 },
    { month: "Sep", traffic: 4871 },
    { month: "Oct", traffic: 4921 },
    { month: "Nov", traffic: 4704 },
    { month: "Dec", traffic: 4375 },
];


function EDAExplorer({
    open,
    onClose,
}) {
    const [activeTab, setActiveTab] =
        useState("hourly");


    if (!open) {
        return null;
    }


    const tabs = [
        {
            id: "hourly",
            label: "Traffic Patterns",
            icon: Clock3,
        },
        {
            id: "weather",
            label: "Weather",
            icon: CloudSun,
        },
        {
            id: "monthly",
            label: "Seasonal View",
            icon: CalendarDays,
        },
    ];


    return (
        <AnimatePresence>

            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                exit={{
                    opacity: 0,
                }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
                onClick={onClose}
            >

                {/* Main explorer window */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40,
                        scale: 0.96,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: 30,
                        scale: 0.96,
                    }}
                    transition={{
                        duration: 0.3,
                    }}
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                    className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-white/15 bg-slate-900/95 shadow-2xl"
                >

                    {/* Header */}
                    <div className="sticky top-0 z-20 flex items-start justify-between border-b border-white/10 bg-slate-900/95 px-6 py-5 backdrop-blur-xl sm:px-8">

                        <div>

                            <div className="flex items-center gap-2 text-cyan-300">

                                <BarChart3 className="h-5 w-5" />

                                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                                    Exploratory Data Analysis
                                </p>

                            </div>


                            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                Historical Traffic Explorer
                            </h2>


                            <p className="mt-2 max-w-2xl text-sm text-slate-400">
                                Explore important patterns discovered
                                from historical I-94 traffic data.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close EDA explorer"
                        >

                            <X className="h-5 w-5" />

                        </button>

                    </div>


                    <div className="p-6 sm:p-8">

                        {/* Dataset summary */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                                <Database className="h-5 w-5 text-cyan-300" />

                                <p className="mt-4 text-2xl font-bold">
                                    48,204
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Historical Records
                                </p>

                            </div>


                            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                                <CalendarDays className="h-5 w-5 text-cyan-300" />

                                <p className="mt-4 text-2xl font-bold">
                                    2012–2018
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Observation Period
                                </p>

                            </div>


                            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                                <TrendingUp className="h-5 w-5 text-cyan-300" />

                                <p className="mt-4 text-2xl font-bold">
                                    3,260
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Avg. Vehicles / Hour
                                </p>

                            </div>


                            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">

                                <BarChart3 className="h-5 w-5 text-cyan-300" />

                                <p className="mt-4 text-2xl font-bold">
                                    7,280
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Highest Recorded Volume
                                </p>

                            </div>

                        </div>


                        {/* Tabs */}
                        <div className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-950/40 p-2">

                            {tabs.map((tab) => {
                                const Icon = tab.icon;

                                const active =
                                    activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveTab(tab.id)
                                        }
                                        className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${active
                                                ? "bg-cyan-400 text-slate-950"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >

                                        <Icon className="h-4 w-4" />

                                        {tab.label}

                                    </button>
                                );
                            })}

                        </div>


                        {/* Chart area */}
                        <motion.div
                            key={activeTab}
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 p-5 sm:p-7"
                        >

                            {/* Hourly traffic */}
                            {activeTab === "hourly" && (
                                <>
                                    <div className="mb-6">

                                        <p className="text-sm text-slate-500">
                                            Historical Traffic Pattern
                                        </p>

                                        <h3 className="mt-1 text-xl font-semibold">
                                            Weekday vs Weekend Traffic
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-400">
                                            Average daytime traffic volume
                                            across different hours.
                                        </p>

                                    </div>


                                    <div className="h-[360px] w-full">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <LineChart
                                                data={hourlyData}
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    bottom: 5,
                                                    left: 0,
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#334155"
                                                    opacity={0.35}
                                                />

                                                <XAxis
                                                    dataKey="hour"
                                                    stroke="#94a3b8"
                                                    tick={{
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <YAxis
                                                    stroke="#94a3b8"
                                                    tick={{
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor:
                                                            "#0f172a",
                                                        border:
                                                            "1px solid #334155",
                                                        borderRadius: "12px",
                                                    }}
                                                />

                                                <Legend />


                                                <Line
                                                    type="monotone"
                                                    dataKey="weekday"
                                                    name="Weekday"
                                                    stroke="#22d3ee"
                                                    strokeWidth={3}
                                                    dot={{
                                                        r: 4,
                                                    }}
                                                    activeDot={{
                                                        r: 7,
                                                    }}
                                                />


                                                <Line
                                                    type="monotone"
                                                    dataKey="weekend"
                                                    name="Weekend"
                                                    stroke="#818cf8"
                                                    strokeWidth={3}
                                                    dot={{
                                                        r: 4,
                                                    }}
                                                />

                                            </LineChart>

                                        </ResponsiveContainer>

                                    </div>


                                    {/* Business interpretation */}
                                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5">

                                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                                        <div>

                                            <p className="font-semibold text-cyan-200">
                                                Key Insight
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                                Weekday traffic shows strong commuting
                                                peaks around 7 AM and 4 PM, while
                                                weekend traffic is generally lower and
                                                more evenly distributed.
                                            </p>

                                        </div>

                                    </div>
                                </>
                            )}


                            {/* Weather distribution */}
                            {activeTab === "weather" && (
                                <>
                                    <div className="mb-6">

                                        <p className="text-sm text-slate-500">
                                            Weather Distribution
                                        </p>

                                        <h3 className="mt-1 text-xl font-semibold">
                                            Conditions Recorded in the Dataset
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-400">
                                            Number of historical observations
                                            recorded under each weather condition.
                                        </p>

                                    </div>


                                    <div className="h-[430px] w-full">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={weatherData}
                                                layout="vertical"
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 35,
                                                    bottom: 5,
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#334155"
                                                    opacity={0.3}
                                                />

                                                <XAxis
                                                    type="number"
                                                    stroke="#94a3b8"
                                                    tick={{
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <YAxis
                                                    type="category"
                                                    dataKey="weather"
                                                    stroke="#94a3b8"
                                                    width={100}
                                                    tick={{
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor:
                                                            "#0f172a",
                                                        border:
                                                            "1px solid #334155",
                                                        borderRadius: "12px",
                                                    }}
                                                />


                                                <Bar
                                                    dataKey="count"
                                                    name="Historical Records"
                                                    fill="#22d3ee"
                                                    radius={[0, 8, 8, 0]}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>


                                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5">

                                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                                        <div>

                                            <p className="font-semibold text-cyan-200">
                                                Key Insight
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                                Cloudy and clear conditions represent
                                                the largest share of weather observations
                                                in the historical dataset.
                                            </p>

                                        </div>

                                    </div>
                                </>
                            )}


                            {/* Monthly traffic */}
                            {activeTab === "monthly" && (
                                <>
                                    <div className="mb-6">

                                        <p className="text-sm text-slate-500">
                                            Seasonal Pattern
                                        </p>

                                        <h3 className="mt-1 text-xl font-semibold">
                                            Average Daytime Traffic by Month
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-400">
                                            Historical average traffic demand
                                            throughout the year.
                                        </p>

                                    </div>


                                    <div className="h-[360px] w-full">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <LineChart
                                                data={monthlyData}
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    bottom: 5,
                                                    left: 0,
                                                }}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#334155"
                                                    opacity={0.35}
                                                />

                                                <XAxis
                                                    dataKey="month"
                                                    stroke="#94a3b8"
                                                    tick={{
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <YAxis
                                                    stroke="#94a3b8"
                                                    domain={[
                                                        4000,
                                                        5200,
                                                    ]}
                                                    tick={{
                                                        fontSize: 12,
                                                    }}
                                                />

                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor:
                                                            "#0f172a",
                                                        border:
                                                            "1px solid #334155",
                                                        borderRadius: "12px",
                                                    }}
                                                />


                                                <Line
                                                    type="monotone"
                                                    dataKey="traffic"
                                                    name="Average Traffic"
                                                    stroke="#22d3ee"
                                                    strokeWidth={3}
                                                    dot={{
                                                        r: 4,
                                                    }}
                                                    activeDot={{
                                                        r: 7,
                                                    }}
                                                />

                                            </LineChart>

                                        </ResponsiveContainer>

                                    </div>


                                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5">

                                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                                        <div>

                                            <p className="font-semibold text-cyan-200">
                                                Key Insight
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                                Traffic is generally higher during
                                                several warmer months, while lower
                                                averages appear during colder periods.
                                            </p>

                                        </div>

                                    </div>
                                </>
                            )}

                        </motion.div>


                        {/* EDA explanation */}
                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">

                            <p className="font-semibold">
                                Why explore historical data?
                            </p>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                Exploratory Data Analysis helps us understand
                                patterns, unusual observations and relationships
                                in historical traffic data before building the
                                prediction system.
                            </p>

                        </div>

                    </div>

                </motion.div>

            </motion.div>

        </AnimatePresence>
    );
}


export default EDAExplorer;