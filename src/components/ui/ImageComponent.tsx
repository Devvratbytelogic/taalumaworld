'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { getInitials } from '@/utils/getInitials'

interface ImageComponentProps {
  src: string | undefined;
  alt: string | undefined;
  object_cover: boolean;
  priority?: boolean;
  fallbackSrc?: string;
}

function resolveImageSrc(src: string | undefined): string | null {
  if (typeof src !== 'string') return null
  const value = src.trim().replace(/\\/g, '/')
  if (!value) return null
  if (
    value.startsWith('/') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('blob:') ||
    value.startsWith('data:')
  ) {
    return value
  }
  return null
}

export default function ImageComponent({
  src,
  alt,
  object_cover,
  priority = false,
  fallbackSrc,
}: ImageComponentProps) {

  const resolvedSrc = resolveImageSrc(src);
  const resolvedFallback = resolveImageSrc(fallbackSrc);
  const [activeSrc, setActiveSrc] = useState<string | null>(resolvedSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setActiveSrc(resolvedSrc);
    setHasError(false);
  }, [resolvedSrc]);

  if (hasError || !activeSrc) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-sky-600 text-sm font-semibold uppercase">
        {getInitials(alt ?? '', 'NA')}
      </div>
    );
  }

  return (
    <Image
      src={activeSrc}
      width={1000}
      height={1000}
      alt={alt || 'image'}
      title={alt || 'image'}
      priority={priority}
      className={`w-full h-full ${object_cover ? 'object-cover' : 'object-contain'}`}
      onError={() => {
        if (resolvedFallback && resolvedFallback !== activeSrc) {
          setActiveSrc(resolvedFallback);
          return;
        }
        setHasError(true);
      }}
    />
  )
}
