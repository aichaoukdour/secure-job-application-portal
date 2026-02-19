import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

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

        if (req.headers.get("x-requested-with") !== "XMLHttpRequest") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const rawData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            portfolio: formData.get("portfolio") as string,
            recaptchaToken: formData.get("recaptchaToken") as string,
        };

        const cv = formData.get("cv") as File;
        const validatedData = applicationSchema.parse(rawData);

        if (!cv || cv.size === 0) {
            return NextResponse.json({ error: "CV is required" }, { status: 400 });
        }

        const allowedExtensions = [".pdf", ".doc", ".docx"];
        const fileExt = path.extname(cv.name).toLowerCase();

        if (!allowedExtensions.includes(fileExt) || cv.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Invalid file or exceeds 5MB limit" }, { status: 400 });
        }

        const recaptchaRes = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validatedData.recaptchaToken}`,
            { method: "POST" }
        );
        const recaptchaJson = await recaptchaRes.json();

        if (process.env.NODE_ENV === "production" && !recaptchaJson.success) {
            return NextResponse.json({ error: "Security verification failed" }, { status: 400 });
        }

        const applicantsDir = path.join(process.cwd(), "applicants");
        await fs.mkdir(applicantsDir, { recursive: true });

        const timestamp = Date.now();
        const safeName = validatedData.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const fileId = crypto.randomBytes(4).toString("hex");
        const jsonFilename = `${timestamp}_${safeName}_${fileId}.json`;
        const cvFilename = `${timestamp}_${safeName}_${fileId}${fileExt}`;

        await fs.writeFile(path.join(applicantsDir, cvFilename), Buffer.from(await cv.arrayBuffer()));

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

        return NextResponse.json({ message: "Success" }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
