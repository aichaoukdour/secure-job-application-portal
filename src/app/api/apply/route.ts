import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// 1. Define Validation Schema (Zod)
const applicationSchema = z.object({
    name: z.string().min(2, "Name is too short").max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is too short"),
    portfolio: z.string().url().optional().or(z.literal("")),
    recaptchaToken: z.string().min(1, "reCAPTCHA is required"),
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // CSRF Protection check
        if (req.headers.get("x-requested-with") !== "XMLHttpRequest") {
            return NextResponse.json({ error: "Unauthorized request" }, { status: 403 });
        }

        // 2. Extract Data
        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            portfolio: formData.get("portfolio") as string,
            recaptchaToken: formData.get("recaptchaToken") as string,
        };

        const cv = formData.get("cv") as File;

        // 3. Server-side Validation
        const validatedData = applicationSchema.parse(rawData);

        if (!cv || cv.size === 0) {
            return NextResponse.json({ error: "CV is required" }, { status: 400 });
        }

        // Malicious file upload protection
        const allowedExtensions = [".pdf", ".doc", ".docx"];
        const fileExt = path.extname(cv.name).toLowerCase();
        if (!allowedExtensions.includes(fileExt)) {
            return NextResponse.json({ error: "Invalid file type. Only PDF and DOC are allowed." }, { status: 400 });
        }

        if (cv.size > 5 * 1024 * 1024) { // 5MB limit
            return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
        }

        // 4. reCAPTCHA Verification
        const recaptchaRes = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validatedData.recaptchaToken}`,
            { method: "POST" }
        );
        const recaptchaJson = await recaptchaRes.json();

        // NOTE: In development, we might skip this if the secret key is missing
        if (process.env.NODE_ENV === "production" && !recaptchaJson.success) {
            return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
        }

        // 5. Prepare Storage
        const applicantsDir = path.join(process.cwd(), "applicants");
        await fs.mkdir(applicantsDir, { recursive: true });

        // Sanitize filename to prevent directory traversal
        const timestamp = Date.now();
        const safeName = validatedData.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const fileId = crypto.randomBytes(4).toString("hex");
        const jsonFilename = `${timestamp}_${safeName}_${fileId}.json`;
        const cvFilename = `${timestamp}_${safeName}_${fileId}${fileExt}`;

        // 6. Save Files
        const cvBuffer = Buffer.from(await cv.arrayBuffer());
        await fs.writeFile(path.join(applicantsDir, cvFilename), cvBuffer);

        const applicationRecord = {
            ...validatedData,
            cvPath: cvFilename,
            submittedAt: new Date().toISOString(),
            userAgent: req.headers.get("user-agent"),
            ip: req.headers.get("x-forwarded-for") || "unknown",
        };

        await fs.writeFile(
            path.join(applicantsDir, jsonFilename),
            JSON.stringify(applicationRecord, null, 2)
        );

        return NextResponse.json({ message: "Application submitted successfully" }, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error("Submission Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
