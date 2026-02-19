export default function JobDescription() {
    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-50 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Senior Full-Stack Developer</h2>
                    <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">Full-time</span>
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">Remote Friendly</span>
                        <span className="text-gray-500 flex items-center gap-1">📍 Casablanca, Morocco</span>
                    </div>
                </div>
                <div className="mt-4 md:mt-0">
                    <span className="text-2xl font-bold text-gray-900">$60k - $90k</span>
                    <p className="text-xs text-gray-500 text-right">Per Year</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">About the Role</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We are looking for a passionate Senior Full-Stack Developer to join our growing engineering team.
                            You will be responsible for building high-quality, scalable web applications using modern technologies.
                            You will work closely with designers and product managers to deliver seamless user experiences.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Key Responsibilities</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                            <li>Architect and implement robust, secure, and scalable web solutions.</li>
                            <li>Collaborate with cross-functional teams to define and ship new features.</li>
                            <li>Maintain high code quality through testing and peer reviews.</li>
                            <li>Optimize application performance for maximum speed and scalability.</li>
                            <li>Mentor junior developers and promote best engineering practices.</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 text-center">Requirements</h3>
                        <ul className="space-y-3">
                            {["TypeScript / Next.js", "Tailwind CSS", "Node.js / API Design", "PostgreSQL / Prisma", "5+ Years Experience"].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 20 20">
                                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">Perks & Benefits</h3>
                        <p className="text-xs text-blue-700/80 leading-relaxed">
                            Competitive salary, equity options, health insurance, learning budget, and periodic team retreats.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
