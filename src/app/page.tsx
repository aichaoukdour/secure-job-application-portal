import JobDescription from "@/components/JobDescription";
import ApplicationForm from "@/components/ApplicationForm";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-6xl mx-auto px-4 py-16">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Join Our Tech Team</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We are looking for creative and ambitious people to help us build the next generation of financial technology.
                    </p>
                </header>

                <JobDescription />

                <div id="apply-section" className="pt-8 scroll-mt-20">
                    <ApplicationForm />
                </div>
            </div>
        </div>
    );
}
