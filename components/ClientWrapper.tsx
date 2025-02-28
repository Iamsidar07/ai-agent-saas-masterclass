"use client"
import { ClerkProvider } from '@clerk/nextjs'
import { SchematicProvider } from '@schematichq/schematic-react'
import React, { ReactNode } from 'react'
import SchematicWrapper from './SchematicWrapper'

const ClientWrapper = ({ children }: Readonly<{ children: ReactNode }>) => {

    const publishableKey = process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY

    if (!publishableKey) {
        throw new Error('Missing publishable key NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY')
    }

    return (
        <ClerkProvider>
            <SchematicProvider publishableKey={publishableKey}>
                <SchematicWrapper>
                    {children}
                </SchematicWrapper>
            </SchematicProvider>
        </ClerkProvider>
    )
}

export default ClientWrapper