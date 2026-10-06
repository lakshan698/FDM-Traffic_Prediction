import { Activity } from "lucide-react";
import { motion } from "motion/react";

function Navbar({ backendOnline }) {
    // Smoothly scroll to a page section
    const scrollToSection = (id) => {
        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
            });
    };

    return (
        <motion.nav
            initial={{
                opacity: 0,
                y: -20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">

                {/* Application logo */}
                <button
                    onClick={() => scrollToSection("home")}
                    className="flex items-center gap-3"
                >
                    <div className="rounded-xl bg-cyan-400/10 p-2 ring-1 ring-cyan-400/30">
                        <Activity className="h-6 w-6 text-cyan-300" />
                    </div>

                    <div className="text-left">
                        <p className="font-semibold">
                            TrafficFlow AI
                        </p>

                        <p className="text-xs text-slate-400">
                            Smart Traffic Intelligence
                        </p>
                    </div>
                </button>


                {/* Navigation links */}
                <div className="hidden items-center gap-7 text-sm text-slate-300 md:flex">

                    <button
                        onClick={() => scrollToSection("home")}
                        className="transition hover:text-cyan-300"
                    >
                        Home
                    </button>

                    <button
                        onClick={() => scrollToSection("insights")}
                        className="transition hover:text-cyan-300"
                    >
                        Insights
                    </button>

                    <button
                        onClick={() => scrollToSection("prediction")}
                        className="transition hover:text-cyan-300"
                    >
                        Prediction
                    </button>

                    <button
                        onClick={() => scrollToSection("about")}
                        className="transition hover:text-cyan-300"
                    >
                        About
                    </button>

                </div>


                {/* Backend / model status */}
                <div
                    className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${backendOnline
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
                        ? "System Online"
                        : "System Offline"}
                </div>

            </div>
        </motion.nav>
    );
}

export default Navbar;