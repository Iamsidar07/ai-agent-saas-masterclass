"use client"
import { SchematicProvider } from '@schematichq/schematic-react'
import React, { ReactNode } from 'react'
import SchematicWrapper from './SchematicWrapper'
import ConvexClientProvider from './ConvexClientProvider'

const ClientWrapper = ({ children }: Readonly<{ children: ReactNode }>) => {

    const publishableKey = process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY

    if (!publishableKey) {
        throw new Error('Missing publishable key NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY')
    }

    return (
        <ConvexClientProvider>
            <SchematicProvider publishableKey={publishableKey}>
                <SchematicWrapper>
                    {children}
                </SchematicWrapper>
            </SchematicProvider>
        </ConvexClientProvider>
    )
}

export default ClientWrapper