import React from 'react'
import { Input } from './ui/input'
import Form from "next/form"
import { analyseVideo } from '@/actions/analyseVideo'
import AnalyseButton from './AnalyseButton'

const YoutubeVideoForm = () => {
    return (
        <Form action={analyseVideo} className='flex items-center gap-2 mt-6 max-w-lg w-full'>
            <Input
                name="url"
                placeholder='https://www.youtube.com/watch?v=js5RNjxDYeg'
            />
            <AnalyseButton />
        </Form>
    )
}

export default YoutubeVideoForm