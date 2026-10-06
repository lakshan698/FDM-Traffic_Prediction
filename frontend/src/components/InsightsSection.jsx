import { useState } from "react";
import { motion } from "motion/react";

import {
    Activity,
    BarChart3,
    CalendarDays,
    CarFront,
    CloudSun,
    MapPinned,
    ShieldCheck,
    TrafficCone,
} from "lucide-react";

import EDAExplorer from "./EDAExplorer";


// Simple operational information shown to decision-makers
const planningCards = [
    {
        icon: CalendarDays,
        title: "Hourly Forecasting",
        value: "Time-Based",
        description:
            "Estimate traffic demand for a selected date and hour.",
    },
    {
        icon: CloudSun,
        title: "Weather Awareness",
        value: "Weather-Aware",
        description:
            "Weather conditions are considered when estimating traffic demand.",
    },
    {
        icon: CarFront,
        title: "Traffic Demand",
        value: "Vehicles / Hour",
        description:
            "Predictions are presented as an understandable hourly traffic estimate.",
    },
    {
        icon: MapPinned,
        title: "Planning Support",
        value: "Early Action",
        description:
            "Helps authorities prepare before expected congestion periods.",
    },
];


// Simple traffic response guide
const trafficLevels = [
    {
        level: "Low",
        range: "Below 2,000",
        action:
            "Suitable period for normal operations or lower-impact road activities.",
        className:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },
    {
        level: "Moderate",
        range: "2,000 – 3,999",
        action:
            "Continue standard monitoring and maintain normal traffic operations.",
        className:
            "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    },
    {
        level: "High",
        range: "4,000 – 5,999",
        action:
            "Prepare congestion-management measures and monitor major traffic points.",
        className:
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
    },
    {
        level: "Very High",
        range: "6,000+",
        action:
            "Increase traffic-control readiness and prepare stronger response measures.",
        className:
            "border-red-400/20 bg-red-400/10 text-red-300",
    },
];


function InsightsSection() {
    // Controls the EDA popup
    const [edaOpen, setEdaOpen] = useState(false);


    return (
        <>
            <section
                id="insights"
                className="relative py-24"
            >

                {/* Background glow */}
                <div className="absolute left-1/2 top-1/2 h-[550px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />


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
                        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
                    >

                        {/* Left side heading */}
                        <div className="max-w-2xl">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                                Operational Intelligence
                            </p>


                            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">

                                Understand traffic.

                                <span className="block text-cyan-300">
                                    Plan before congestion.
                                </span>

                            </h2>

                        </div>


                        {/* Right side description + EDA button */}
                        <div className="max-w-md">

                            <p className="text-sm leading-7 text-slate-400">
                                TrafficFlow AI converts traffic, time and weather
                                information into simple forecasts that can support
                                faster operational decisions.
                            </p>


                            {/* Open EDA Explorer */}
                            <motion.button
                                whileHover={{
                                    scale: 1.02,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                type="button"
                                onClick={() => setEdaOpen(true)}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
                            >

                                <BarChart3 className="h-5 w-5" />

                                Explore Historical Data

                            </motion.button>

                        </div>

                    </motion.div>


                    {/* Main information cards */}
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {planningCards.map((card, index) => {
                            const Icon = card.icon;

                            return (
                                <motion.div
                                    key={card.title}
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
                                    transition={{
                                        delay: index * 0.08,
                                    }}
                                    whileHover={{
                                        y: -6,
                                    }}
                                    className="rounded-3xl border border-white/10 bg-slate-800/60 p-6 backdrop-blur-xl"
                                >

                                    <div className="flex items-center justify-between">

                                        <p className="text-sm text-slate-400">
                                            {card.title}
                                        </p>


                                        <div className="rounded-xl bg-cyan-400/10 p-2">

                                            <Icon className="h-5 w-5 text-cyan-300" />

                                        </div>

                                    </div>


                                    <p className="mt-6 text-2xl font-bold">
                                        {card.value}
                                    </p>


                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        {card.description}
                                    </p>

                                </motion.div>
                            );
                        })}

                    </div>


                    {/* Main dashboard */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">

                        {/* Traffic response guide */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -30,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-xl"
                        >

                            <div className="flex items-center justify-between gap-4">

                                <div>

                                    <p className="text-sm text-slate-400">
                                        Operational Response Guide
                                    </p>


                                    <h3 className="mt-1 text-2xl font-semibold">
                                        What does the predicted traffic level mean?
                                    </h3>

                                </div>


                                <TrafficCone className="h-7 w-7 shrink-0 text-cyan-300" />

                            </div>


                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                                The predicted number of vehicles is translated into
                                simple traffic levels so decision-makers can quickly
                                understand the expected situation.
                            </p>


                            {/* Traffic level cards */}
                            <div className="mt-8 space-y-4">

                                {trafficLevels.map((traffic, index) => (

                                    <motion.div
                                        key={traffic.level}
                                        initial={{
                                            opacity: 0,
                                            x: -20,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        viewport={{
                                            once: true,
                                        }}
                                        transition={{
                                            delay: index * 0.08,
                                        }}
                                        className="grid gap-4 rounded-2xl border border-white/10 bg-slate-800/40 p-5 sm:grid-cols-[150px_1fr]"
                                    >

                                        {/* Traffic level */}
                                        <div>

                                            <span
                                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${traffic.className}`}
                                            >
                                                {traffic.level}
                                            </span>


                                            <p className="mt-3 text-sm font-medium text-white">
                                                {traffic.range}
                                            </p>


                                            <p className="text-xs text-slate-500">
                                                vehicles / hour
                                            </p>

                                        </div>


                                        {/* Recommended action */}
                                        <div className="flex items-center">

                                            <p className="text-sm leading-6 text-slate-300">
                                                {traffic.action}
                                            </p>

                                        </div>

                                    </motion.div>

                                ))}

                            </div>

                        </motion.div>


                        {/* Decision workflow */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-7 backdrop-blur-xl"
                        >

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10">

                                <ShieldCheck className="h-6 w-6 text-cyan-300" />

                            </div>


                            <p className="mt-7 text-sm uppercase tracking-[0.2em] text-cyan-300">
                                Decision Support
                            </p>


                            <h3 className="mt-3 text-2xl font-bold">
                                From conditions to action
                            </h3>


                            <p className="mt-4 text-sm leading-7 text-slate-400">
                                The system provides an early indication of expected
                                traffic demand so authorities can prepare appropriate
                                operational responses.
                            </p>


                            {/* Workflow steps */}
                            <div className="mt-8 space-y-3">

                                {/* Step 1 */}
                                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-bold text-cyan-300">
                                            1
                                        </div>


                                        <div>

                                            <p className="text-sm font-medium">
                                                Enter Conditions
                                            </p>


                                            <p className="mt-1 text-xs text-slate-500">
                                                Date, time and expected weather
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="ml-4 h-5 border-l border-dashed border-cyan-400/30" />


                                {/* Step 2 */}
                                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-bold text-cyan-300">
                                            2
                                        </div>


                                        <div>

                                            <p className="text-sm font-medium">
                                                Generate Forecast
                                            </p>


                                            <p className="mt-1 text-xs text-slate-500">
                                                Estimate expected vehicles per hour
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="ml-4 h-5 border-l border-dashed border-cyan-400/30" />


                                {/* Step 3 */}
                                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-bold text-cyan-300">
                                            3
                                        </div>


                                        <div>

                                            <p className="text-sm font-medium">
                                                Understand Traffic Level
                                            </p>


                                            <p className="mt-1 text-xs text-slate-500">
                                                Low, Moderate, High or Very High
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="ml-4 h-5 border-l border-dashed border-cyan-400/30" />


                                {/* Step 4 */}
                                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-bold text-emerald-300">
                                            4
                                        </div>


                                        <div>

                                            <p className="text-sm font-medium text-emerald-300">
                                                Take Early Action
                                            </p>


                                            <p className="mt-1 text-xs text-slate-400">
                                                Prepare traffic-control resources when needed
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* Important note */}
                            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">

                                <Activity className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />


                                <p className="text-xs leading-5 text-slate-400">
                                    The system supports human decision-making.
                                    Final operational decisions remain with the
                                    responsible traffic authorities.
                                </p>

                            </div>

                        </motion.div>

                    </div>

                </div>

            </section>


            {/* EDA popup */}
            <EDAExplorer
                open={edaOpen}
                onClose={() => setEdaOpen(false)}
            />
        </>
    );
}


export default InsightsSection;