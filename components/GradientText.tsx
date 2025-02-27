import { cn } from '@/lib/utils'
import React from 'react'

const GradientText = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <span className={cn('text-transparent bg-gradient-to-b from-red-600 to-red-900 bg-clip-text', className)}>{children}</span>
    )
}

export default GradientText