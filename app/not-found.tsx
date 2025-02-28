'use client'

import React from 'react'
import LottieAnimation from '@/components/LottieAnimation'
import notFoundAnimation from '@/animations/404.json'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { SquaresPattern } from '@/components/SquarePattern'

const NotFound = () => {
  return (
    <div className="relative min-h-[calc(100vh-84px)] flex items-center justify-center">
      <SquaresPattern />
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <LottieAnimation 
            animationData={notFoundAnimation}
            className="w-full -mb-12 mx-auto"
          />
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
