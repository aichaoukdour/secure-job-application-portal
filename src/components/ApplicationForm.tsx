"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ApplicationForm() {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        portfolio: "",
    });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = recaptchaRef.current?.getValue();
        if (!token) {
            setError("Please complete the reCAPTCHA.");
            setLoading(false);
            return;
        }

        if (!file) {
            setError("Please upload your CV.");
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("portfolio", formData.portfolio);
            data.append("cv", file);
            data.append("recaptchaToken", token);

            const response = await fetch("/api/apply", {
                method: "POST",
                body: data,
                // CSRF Protection via custom header
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Submission failed");
            }

            setSuccess(true);
            setFormData({ name: "", email: "", phone: "", portfolio: "" });
            setFile(null);
            recaptchaRef.current?.reset();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-xl mx-auto p-12 bg-green-50 rounded-2xl border border-green-100 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                    ✓
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Application Received!</h3>
                <p className="text-green-700">Thank you for applying. We will review your profile and get back to you soon.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-sm font-semibold text-green-800 underline underline-offset-4"
                >
                    Submit another application
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-black p-6 text-white">
                <h3 className="text-xl font-bold">Apply Now</h3>
                <p className="text-gray-400 text-sm">Please fill out the form below to submit your application.</p>
            </div>

            <div className="p-8 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg animate-in fade-in">
                        ⚠️ {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                        <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                        <input
                            type="tel"
                            required
                            placeholder="+212 600-000000"
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Portfolio URL (Optional)</label>
                        <input
                            type="url"
                            placeholder="https://github.com/..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                            value={formData.portfolio}
                            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Upload CV (PDF/DOC) *</label>
                    <div className="relative group">
                        <input
                            type="file"
                            required
                            accept=".pdf,.doc,.docx"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${file ? 'border-green-300 bg-green-50' : 'border-gray-200 group-hover:border-black bg-gray-50'}`}>
                            <div className="text-2xl mb-2">{file ? '📄' : '☁️'}</div>
                            <p className="text-sm font-medium text-gray-900">{file ? file.name : 'Click or drag to upload'}</p>
                            <p className="text-xs text-gray-500 mt-1">PDF or Word documents (Max 5MB)</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center border-t border-gray-50 pt-6">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // Placeholder key for UI
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                        </>
                    ) : "Submit Application"}
                </button>
            </div>
        </form>
    );
}
