"use client"
import Link from 'next/link'
import React from 'react'
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { buttonVariants } from './ui/button'
import AIAssistantAnimation from './AIAssistantAnimation'

const Navbar = () => {
    return (
        <header className='sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 font-cal'>
            <nav className='container mx-auto px-6 py-4 md:px-0 flex items-center justify-between'>
                <Link href={"/"} className='flex items-center gap-2'>
                    <AIAssistantAnimation
                        size='sm'
                    />
                    <h1>
                        AgentTube
                    </h1>
                </Link>
                <ul className='flex items-center gap-2'>
                    <SignedOut>
                        <SignInButton >
                            <Link href="/sign-in" className={buttonVariants({ variant: "outline" })}>Sign in</Link>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Link href={'/video'} className={buttonVariants({
                            variant: "ghost"
                        })}>My videos</Link>
                        <Link href={'/manage-plan'} className={buttonVariants({
                            variant: "ghost"
                        })}>Manage Plan</Link>
                        <UserButton />
                    </SignedIn>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
