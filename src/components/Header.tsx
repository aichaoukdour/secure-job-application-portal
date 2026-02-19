export default function Header() {
    return (
        <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        TechPortal
                    </span>
                </div>

                <nav className="text-sm font-medium text-gray-500">
                    <span className="hidden sm:inline bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                        Hiring Now
                    </span>
                </nav>
            </div>
        </header>
    );
}
