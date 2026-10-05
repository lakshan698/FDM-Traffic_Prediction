import {
    Activity,
    ExternalLink,
    ShieldCheck,
} from "lucide-react";


function Footer() {
    return (
        <footer
            id="about"
            className="border-t border-white/10 bg-slate-950/80"
        >
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">

                <div className="grid gap-8 md:grid-cols-3">

                    {/* Project identity */}
                    <div>
                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-cyan-400/10 p-2 ring-1 ring-cyan-400/20">
                                <Activity className="h-5 w-5 text-cyan-300" />
                            </div>

                            <div>
                                <p className="font-semibold">
                                    TrafficFlow AI
                                </p>

                                <p className="text-xs text-slate-500">
                                    Smart Traffic Intelligence
                                </p>
                            </div>

                        </div>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                            A machine learning based traffic-volume
                            prediction system designed to support proactive
                            traffic management and public-sector decision making.
                        </p>
                    </div>


                    {/* System information */}
                    <div>
                        <p className="font-semibold">
                            System
                        </p>

                        <div className="mt-4 space-y-3 text-sm text-slate-400">

                            <p>
                                Final Model: Random Forest Regressor
                            </p>

                            <p>
                                Backend: FastAPI
                            </p>

                            <p>
                                Frontend: React + Tailwind CSS
                            </p>

                            <p>
                                Model Integration: Joblib Pipeline
                            </p>

                        </div>
                    </div>


                    {/* Project note */}
                    <div>
                        <div className="flex items-center gap-2 text-emerald-300">

                            <ShieldCheck className="h-5 w-5" />

                            <p className="font-semibold">
                                Decision Support
                            </p>

                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-400">
                            Predictions are intended to support human
                            decision-making and operational planning.
                            They are not a replacement for traffic-management
                            authorities.
                        </p>

                        <a
                            href="https://github.com/lakshan698/FDM-Traffic_Prediction"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-300 transition hover:text-cyan-200"
                        >
                            <ExternalLink className="h-4 w-4" />
                            View Repository
                        </a>
                    </div>

                </div>


                {/* Bottom copyright */}
                <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

                    <p>
                        © 2026 TrafficFlow AI
                    </p>

                    <p>
                        Fundamentals of Data Mining Project
                    </p>

                </div>

            </div>
        </footer>
    );
}


export default Footer;