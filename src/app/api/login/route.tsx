// app/api/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
// --- IMPORTANT: Replace with your actual database connection and user model ---
// const users = []; // If you used the in-memory array for demo, import it or define it
// Example: import prisma from '../../lib/prisma'; // If using Prisma
// Example: import { connectDB, User } from '../../lib/db'; // If using Mongoose/Custom DB
// --------------------------------------------------------------------------

// IMPORTANT: If you used the in-memory array 'users' in /api/register,
// you need to either ensure it's globally accessible (not recommended for production)
// or set up a proper database. For this example, let's assume 'users' is defined here
// or you're using a real database.
const users = []; // Make sure this array reflects the users from /api/register if in-memory.
                  // Ideally, this should be a DB query.

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // --- Step 1: Input Validation ---
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // --- Step 2: Find User in Database by Email ---
        // Replace with actual database query
        const user = users.find(u => u.email === email); // Demo: Find in-memory array
        // const user = await prisma.user.findUnique({ where: { email } }); // Prisma example

        if (!user) {
            // Return generic message for security (don't reveal if email exists)
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // --- Step 3: Compare Provided Password with Hashed Password ---
        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

        if (!isPasswordValid) {
            // Return generic message for security
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // --- Step 4: Return User Data for NextAuth.js ---
        // IMPORTANT: Only return safe data. DO NOT return hashed password.
        // NextAuth.js expects an object with at least 'id', and optionally 'email', 'name', etc.
        return NextResponse.json({
            id: user.id, // Your user's unique ID
            name: user.username, // Or user.name if you have it
            email: user.email,
            // Add any other non-sensitive user data you want in the session
        }, { status: 200 });
    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}