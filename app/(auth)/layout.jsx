"use client";

import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect to '/' if not authenticated
    if (status === "unauthenticated") {
        router.replace('/');
        return null;
    }

    // Next.js will automatically show loading.js when status is "loading"
    if (status === "loading") {
        // return <div>Loading...</div>;
        return null; // Ensure the default loading behavior is used
    }

    return (
        <Sidebar session={session}>
            {children}
        </Sidebar>
    );
}
