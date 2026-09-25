'use client'

import Image, { type ImageProps } from 'next/image'
import React, { useEffect, useState } from 'react'
import { getInitials } from '@/utils/getInitials'

type ImageSource = ImageProps['src']

interface ImageComponentProps {
  src: string | ImageSource | undefined
  alt: string | undefined
  object_cover: boolean
  /** Preload this image. Use only for the above-the-fold LCP image. */
  priority?: boolean
  fallbackSrc?: string
  /**
   * Rendered width hint. Pixel values (for example "40px") keep avatars small.
   * Viewport values (for example "50vw") are for large photos.
   */
  sizes?: string
  quality?: number
  placeholder?: 'empty' | 'blur'
  blurDataURL?: string
}

function resolveImageSrc(src: string | ImageSource | undefined): ImageSource | null {
  if (!src) return null
  if (typeof src !== 'string') return src

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

/** Safe default for callers that do not pass sizes. Home-page images pass a tighter hint. */
const DEFAULT_SIZES = '(max-width: 768px) 100vw, 800px'

export default function ImageComponent({
  src,
  alt,
  object_cover,
  priority = false,
  fallbackSrc,
  sizes = DEFAULT_SIZES,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
}: ImageComponentProps) {
  const resolvedSrc = resolveImageSrc(src)
  const resolvedFallback = resolveImageSrc(fallbackSrc)
  const [activeSrc, setActiveSrc] = useState<ImageSource | null>(resolvedSrc)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setActiveSrc(resolvedSrc)
    setHasError(false)
  }, [resolvedSrc])

  if (hasError || !activeSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-semibold uppercase text-sky-600">
        {getInitials(alt ?? '', 'NA')}
      </div>
    )
  }

  const isStaticImport = typeof activeSrc !== 'string'
  const useBlur = placeholder === 'blur' && (Boolean(blurDataURL) || isStaticImport)

  return (
    <div className="relative h-full w-full">
      <Image
        src={activeSrc}
        alt={alt || 'image'}
        title={alt || 'image'}
        fill
        sizes={sizes}
        quality={quality}
        placeholder={useBlur ? 'blur' : 'empty'}
        {...(useBlur && blurDataURL ? { blurDataURL } : {})}
        {...(priority
          ? { preload: true, fetchPriority: 'high' as const }
          : { loading: 'lazy' as const })}
        className={object_cover ? 'object-cover' : 'object-contain'}
        onError={() => {
          if (typeof resolvedFallback === 'string' && resolvedFallback !== activeSrc) {
            setActiveSrc(resolvedFallback)
            return
          }
          setHasError(true)
        }}
      />
    </div>
  )
}
