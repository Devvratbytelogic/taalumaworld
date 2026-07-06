import React from 'react'

interface PdfReaderProps {
    url: string;
    title: string;
}
export default function PdfReader({ url, title }: PdfReaderProps) {
    console.log('pdf data', url);
    return (
        <>
        </>
    )
}
