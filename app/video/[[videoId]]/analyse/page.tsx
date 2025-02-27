import React from 'react'

export default async function AnalysePage({ params }: { params: Promise<{ videoId: string }> }) {
    const { videoId } = await params;
    return (
        <div>{videoId}</div>
    )
}
