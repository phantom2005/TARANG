// app/api/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
// --- IMPORTANT: Replace with your actual database connection and user model ---
// Example: import prisma from '../../lib/prisma'; // If using Prisma
// Example: import { connectDB, User } from '../../lib/db'; // If using Mongoose/Custom DB
// --------------------------------------------------------------------------

// Function to simulate user storage (REPLACE WITH REAL DB LOGIC)
// For a real app, you'd connect to a database like MongoDB, PostgreSQL, etc.
const users = []; // In-memory array for demonstration only. DO NOT USE IN PRODUCTION.

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, password, recaptchaToken } = body;

        // --- Step 1: Basic Input Validation ---
        if (!username || !email || !password || !recaptchaToken) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
        }

        // --- Step 2: Verify reCAPTCHA (SERVER-SIDE) ---
        // NEVER expose your SECRET_KEY on the frontend
        const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY; // Make sure this env var is set!
        const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;

        const recaptchaRes = await fetch(recaptchaVerificationUrl, { method: 'POST' });
        const recaptchaData = await recaptchaRes.json();

        if (!recaptchaData.success || recaptchaData.score < 0.5) { // Adjust score threshold as needed
            console.warn('reCAPTCHA verification failed:', recaptchaData);
            return NextResponse.json({ message: 'reCAPTCHA verification failed', recaptchaFailed: true }, { status: 400 });
        }

        // --- Step 3: Check if User Already Exists (Email) ---
        // Replace with actual database query
        const existingUser = users.find(u => u.email === email); // Demo: Check in-memory array
        // const existingUser = await prisma.user.findUnique({ where: { email } }); // Prisma example
        if (existingUser) {
            return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
        }

        // --- Step 4: Hash the Password ---
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // --- Step 5: Save User to Database ---
        // Replace with actual database insertion logic
        const newUser = {
            id: (users.length + 1).toString(), // Demo: Simple ID
            username,
            email,
            hashedPassword,
            createdAt: new Date(),
        };
        users.push(newUser); // Demo: Add to in-memory array
        // const createdUser = await prisma.user.create({ data: { username, email, hashedPassword } }); // Prisma example

        // --- Step 6: Respond to Frontend (Registration Success) ---
        // We'll let NextAuth.js handle the actual "login" after this step on the frontend
        return NextResponse.json({
            success: true,
            message: 'Registration successful. Please log in.',
            // Optionally, you could return user data, but for registration,
            // you'll typically sign them in via NextAuth.js *after* this.
        }, { status: 201 }); // 201 Created
    } catch (error) {
        console.error('Registration API error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}