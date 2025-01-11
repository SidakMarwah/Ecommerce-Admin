import { connectToDB } from '@/lib/database';
import clientPromise from '@/lib/db';
import Roles from '@/models/Roles';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
    pages: {
        signIn: '/', // Redirect to root URL for signin
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        session: async ({ session, token, user }) => {
            // Establish DB connection if not already connected
            await connectToDB();

            // Check if the user is an admin by querying the Roles collection
            const userRole = await Roles.findOne({ email: session?.user?.email });

            if (userRole && userRole.role === 'Admin') {
                // If user is an admin, return the session object
                return session;
            } else {
                // If not an admin, deny the session by returning `false`
                return false;
            }
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// export async function isAdminRequest() {
//     const session = await getServerSession(authOptions);

//     if (!session || !adminEmails.includes(session?.user?.email)) {
//         // Throw a custom error if the user is not an admin
//         throw new Error('Forbidden: You are not authorized to access this resource.');
//     }

//     // No need to return anything if the user is an admin
// }

export async function isAdminRequest() {

    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error('Forbidden: You are not authorized to access this resource.');
    }

    await connectToDB();

    // Fetch the role for the logged-in user's email from the database
    const userRole = await Roles.findOne({ email: session.user.email });

    if (!userRole || userRole.role !== 'Admin') {
        throw new Error('Forbidden: You are not authorized to access this resource.');
    }

    // User is authorized (no need to return anything)
}