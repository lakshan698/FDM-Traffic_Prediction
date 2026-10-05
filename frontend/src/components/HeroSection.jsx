import { motion } from "motion/react";
import {
    ArrowDown,
    BrainCircuit,
    CarFront,
    Gauge,
    ShieldCheck,
} from "lucide-react";


function HeroSection() {
    // Move directly to the prediction section
    const goToPrediction = () => {
        document
            .getElementById("prediction")
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };


    // Move to analytical insights
    const goToInsights = () => {
        document
            .getElementById("insights")
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };


    return (
        <section
            id="home"
            className="relative flex min-h-screen items-center overflow-hidden pt-24"
        >

            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
                    backgroundSize: "55px 55px",
                }}
            />


            {/* Animated background lights */}
            <motion.div
                className="absolute left-[5%] top-[20%] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"
                animate={{
                    x: [0, 70, 0],
                    y: [0, 40, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                }}
            />

            <motion.div
                className="absolute bottom-[10%] right-[5%] h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                }}
            />


            <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10">

                {/* Hero text */}
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -50,
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{
                        duration: 0.7,
                    }}
                >

                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">

                        <ShieldCheck className="h-4 w-4" />

                        AI-Powered Public Traffic Intelligence

                    </div>


                    <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">

                        Smarter Traffic

                        <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                            Better Decisions
                        </span>

                    </h1>


                    <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">

                        A machine learning powered decision-support system
                        that predicts hourly traffic volume using time,
                        weather and environmental conditions.

                    </p>


                    {/* Main actions */}
                    <div className="mt-9 flex flex-wrap gap-4">

                        <motion.button
                            whileHover={{
                                scale: 1.03,
                            }}
                            whileTap={{
                                scale: 0.97,
                            }}
                            onClick={goToPrediction}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20"
                        >
                            <Gauge className="h-5 w-5" />

                            Predict Traffic
                        </motion.button>


                        <motion.button
                            whileHover={{
                                scale: 1.03,
                            }}
                            whileTap={{
                                scale: 0.97,
                            }}
                            onClick={goToInsights}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-medium text-white backdrop-blur transition hover:bg-white/10"
                        >
                            Explore Insights

                            <ArrowDown className="h-4 w-4" />
                        </motion.button>

                    </div>


                    {/* Key system capabilities */}
                    <div className="mt-12 flex flex-wrap gap-10">

                        <div>
                            <p className="text-2xl font-bold text-cyan-300">
                                Hourly
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Traffic Forecasts
                            </p>
                        </div>


                        <div>
                            <p className="text-2xl font-bold text-cyan-300">
                                Weather
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Aware Predictions
                            </p>
                        </div>


                        <div>
                            <p className="text-2xl font-bold text-cyan-300">
                                Early
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Decision Support
                            </p>
                        </div>

                    </div>

                </motion.div>


                {/* Animated traffic visualization */}
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                    }}
                    className="relative"
                >

                    <div className="relative mx-auto max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl backdrop-blur-xl">

                        {/* Dashboard header */}
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Smart Mobility Network
                                </p>

                                <p className="mt-1 font-semibold">
                                    Traffic Intelligence
                                </p>
                            </div>


                            <div className="rounded-xl bg-cyan-400/10 p-3">
                                <BrainCircuit className="h-6 w-6 text-cyan-300" />
                            </div>

                        </div>


                        {/* Animated road */}
                        <div className="relative mt-8 h-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">

                            <div className="absolute left-1/2 top-0 h-full w-32 -translate-x-1/2 bg-slate-800">

                                {/* Road lines */}
                                {[0, 1, 2, 3, 4].map((item) => (
                                    <motion.div
                                        key={item}
                                        className="absolute left-1/2 h-12 w-1 -translate-x-1/2 bg-cyan-300/50"
                                        initial={{
                                            top: item * 80 - 60,
                                        }}
                                        animate={{
                                            y: [0, 80],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                ))}


                                {/* Moving vehicle */}
                                <motion.div
                                    className="absolute bottom-12 left-5"
                                    animate={{
                                        y: [0, -160, 0],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <CarFront className="h-8 w-8 text-cyan-300" />
                                </motion.div>


                                <motion.div
                                    className="absolute right-5 top-14"
                                    animate={{
                                        y: [0, 160, 0],
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <CarFront className="h-8 w-8 text-blue-400" />
                                </motion.div>

                            </div>


                            {/* Information card */}
                            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            System Purpose
                                        </p>

                                        <p className="mt-1 text-sm font-medium">
                                            Proactive Traffic Management
                                        </p>
                                    </div>


                                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                                        AI Enabled
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>


            {/* Scroll indicator */}
            <motion.button
                onClick={goToInsights}
                animate={{
                    y: [0, 8, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500"
            >
                <ArrowDown className="h-6 w-6" />
            </motion.button>

        </section>
    );
}

export default HeroSection;