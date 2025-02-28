"use client"

import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react"
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, ClerkProvider } from "@clerk/nextjs";

const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
    const convexUrl = process.env.
        NEXT_PUBLIC_CONVEX_URL
    if (!convexUrl) throw new Error("Missing convex url NEXT_PUBLIC_CONVEX_URL")
    const convex = new ConvexReactClient(convexUrl);

    return (
        <ClerkProvider afterSignOutUrl={'/'}>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>{children}</ConvexProviderWithClerk>
        </ClerkProvider>
    )
}

export default ConvexClientProvider