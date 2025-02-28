'use client'

import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const LottieAnimation = dynamic(() => import('@/components/LottieAnimation'), {
  ssr: false,
  loading: () => <div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg" />
})

const SquaresPattern = dynamic(() => import('@/components/SquarePattern').then(mod => mod.SquaresPattern), {
  ssr: false
})

const NotFound = () => {
  return (
    <div className="relative min-h-[calc(100vh-84px)] flex items-center justify-center">
      <Suspense fallback={null}>
        <SquaresPattern />
      </Suspense>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Suspense fallback={<div className="w-full h-64 animate-pulse bg-gray-200 rounded-lg mb-8" />}>
            <LottieAnimation 
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              animationData={require('@/animations/404.json')}
              className="w-full h-64 mb-8"
            />
          </Suspense>
          <h1 className="text-4xl font-cal font-bold mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/">
            <Button 
              size="lg"
              className="font-cal"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
