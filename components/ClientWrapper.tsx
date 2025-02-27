"use client"
import { ClerkProvider } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

const ClientWrapper = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <ClerkProvider>{children}</ClerkProvider>
    )
}

export default ClientWrapper