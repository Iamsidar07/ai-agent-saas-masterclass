import React from 'react'
import { SquaresPattern } from './SquarePattern'
import GradientText from './GradientText'
import AIAssistantAnimation from './AIAssistantAnimation'
import YoutubeVideoForm from './YoutubeVideoForm'

const Hero = () => {
    return (
        <div className='relative pt-14'>
            <SquaresPattern />
            <div className='pt-24 sm:pb-12 sm:pt-32 container mx-auto px-6 lg:px-8 flex flex-col items-center'>
                    <div className="flex items-center justify-center mb-4">
                        <AIAssistantAnimation size="lg" />
                    </div>
                    <div className='text-center max-w-xl'>
                        <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
                            Meet your personal <GradientText>AI Content Agent</GradientText>
                        </h1>
                        <p className='text-lg mt-6 leading-8 text-gray-800'>
                            Transform your video content with AI-powered analysis, transcription and insights. Get Started in seconds
                        </p>
                    </div>
                    <div className='mt-10 w-full max-w-md'>
                        <YoutubeVideoForm />
                    </div>
            </div>
        </div>
    )
}

export default Hero
