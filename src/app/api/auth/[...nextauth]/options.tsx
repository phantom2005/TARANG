import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Import if you plan to use Google
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        // --- Add Google Provider if you are using it ---
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID as string,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        // }),
        // ------------------------------------------------

        CredentialsProvider({
            name: "Credentials", // Changed from "Next Auth" for clarity
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Enter your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // --- Call your custom backend login API here ---
                try {
                    const response = await fetch("http://localhost:3000/api/login", { // Adjust URL if needed
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    // Your /api/login route should return the user object on success
                    // and a status code like 401 on failure.
                    if (response.ok) {
                        const user = await response.json();
                        // Any object returned here will be saved in `user` property of the JWT
                        // NextAuth.js expects at least an 'id' property.
                        return user; // { id: '...', name: '...', email: '...' }
                    } else {
                        const errorData = await response.json(); // Read error message from your backend
                        console.error("Login failed (backend error):", errorData.message);
                        return null; // NextAuth will display an error message
                    }
                } catch (error) {
                    console.error("Network error during login:", error);
                    return null; // Return null for network errors
                }
            },
        })
    ],
    // --- RECOMMENDED: Add callbacks to extend session/JWT ---
    callbacks: {
        async jwt({ token, user }) {
            // 'user' is the object returned from the 'authorize' function above.
            if (user) {
                token.id = user.id; // Ensure user ID is in the JWT
                // Add any other properties from your user object to the token
                // e.g., token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            // 'token' is the JWT from the jwt callback.
            // This is what your frontend 'useSession' hook will receive.
            if (token) {
                session.user.id = token.id as string; // Make ID available in session
                // e.g., session.user.role = token.role as string;
            }
            return session;
        },
    },
    // --- Set JWT strategy and secret ---
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET, // MUST be set in .env.local
    // --- Define custom pages ---
    pages: {
        signIn: '/login', // Path to your custom login page
        // signOut: '/auth/signout',
        // error: '/auth/error', // Optional: Custom error page
        // newUser: '/register', // Optional: Redirect new users here after first login via OAuth
    },
};