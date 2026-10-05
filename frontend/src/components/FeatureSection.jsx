import { motion } from "motion/react";

import {
    BrainCircuit,
    Building2,
    Clock,
    CloudSun,
} from "lucide-react";


// Main benefits of the traffic prediction system
const features = [
    {
        icon: Clock,
        title: "Peak-Hour Planning",
        description:
            "Estimate expected traffic levels for a selected date and time to support early traffic planning.",
    },
    {
        icon: CloudSun,
        title: "Weather-Aware Prediction",
        description:
            "Use temperature, rainfall, snowfall, cloud coverage and weather conditions when estimating traffic volume.",
    },
    {
        icon: BrainCircuit,
        title: "AI Decision Support",
        description:
            "Convert historical traffic patterns into useful predictions that can support operational decisions.",
    },
    {
        icon: Building2,
        title: "Public-Sector Focus",
        description:
            "Designed as a decision-support solution for traffic authorities and smart-city operations.",
    },
];


function FeatureSection() {
    return (
        <section
            id="features"
            className="relative py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-10">

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
                        amount: 0.3,
                    }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                        Smart Mobility
                    </p>

                    <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                        Turning traffic data into
                        <span className="block text-cyan-300">
                            actionable intelligence
                        </span>
                    </h2>

                    <p className="mt-5 text-base leading-7 text-slate-400">
                        TrafficFlow AI helps public-sector decision-makers
                        understand expected traffic demand before congestion
                        becomes a problem.
                    </p>
                </motion.div>


                {/* Feature cards */}
                <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{
                                    opacity: 0,
                                    y: 35,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * 0.1,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.05]"
                            >
                                {/* Feature icon */}
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 ring-1 ring-cyan-400/20 transition group-hover:bg-cyan-400/20">

                                    <Icon className="h-6 w-6 text-cyan-300" />

                                </div>


                                <h3 className="text-lg font-semibold">
                                    {feature.title}
                                </h3>


                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    {feature.description}
                                </p>

                            </motion.div>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}


export default FeatureSection;