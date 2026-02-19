"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const FormInput = ({ label, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <input
            {...props}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-400"
        />
    </div>
);

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
            Object.entries(formData).forEach(([key, value]) => data.append(key, value));
            data.append("cv", file);
            data.append("recaptchaToken", token);

            const response = await fetch("/api/apply", {
                method: "POST",
                body: data,
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Submission failed");

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
            <div className="max-w-xl mx-auto p-12 bg-gray-900 border border-gray-800 rounded-3xl text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    ✓
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Application Received</h3>
                <p className="text-gray-400">Our team will review your profile and get back to you shortly.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-sm font-semibold text-gray-300 hover:text-white transition-colors underline underline-offset-4"
                >
                    Submit another application
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="bg-black p-8 text-white">
                <h3 className="text-2xl font-bold tracking-tight">Apply Now</h3>
                <p className="text-gray-400 text-sm mt-1">Join our mission to build incredible products.</p>
            </div>

            <div className="p-8 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl animate-in fade-in">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                        label="Full Name *"
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <FormInput
                        label="Email Address *"
                        type="email"
                        required
                        placeholder="e.g. john@company.com"
                        value={formData.email}
                        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                        label="Phone Number *"
                        type="tel"
                        required
                        placeholder="+212 6..."
                        value={formData.phone}
                        onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <FormInput
                        label="Portfolio URL"
                        type="url"
                        placeholder="https://github.com/..."
                        value={formData.portfolio}
                        onChange={(e: any) => setFormData({ ...formData, portfolio: e.target.value })}
                    />
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
                        <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${file ? "border-green-300 bg-green-50" : "border-gray-200 group-hover:border-black bg-gray-50"}`}>
                            <div className="text-3xl mb-3">{file ? "📄" : "UPLOAD"}</div>
                            <p className="text-sm font-bold text-gray-900">{file ? file.name : "Drop your files here"}</p>
                            <p className="text-xs text-gray-500 mt-1">MAX SIZE 5MB</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:scale-100 flex items-center justify-center gap-3 shrink-0"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "SUBMIT APPLICATION"
                    )}
                </button>
            </div>
        </form>
    );
}
