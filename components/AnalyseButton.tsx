"use client"
import React from 'react'
import { Button } from './ui/button'
import { useFormStatus } from 'react-dom'
import { Loader } from 'lucide-react'

const AnalyseButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button type='submit' disabled={pending} className='font-cal'>
            {pending && <Loader className='w-5 h-5 animate-spin' />}
            Anayze
        </Button>
    )
}

export default AnalyseButton