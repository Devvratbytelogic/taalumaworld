'use client'
import Image from 'next/image'
import React, { useState } from 'react'

interface ImageComponentProps {
  src: string | undefined;
  alt: string | undefined;
  object_cover: boolean;
  priority?: boolean;
}

export default function ImageComponent({
  src,
  alt,
  object_cover,
  priority
}: ImageComponentProps) {

  const [hasError, setHasError] = useState(false);

  // 🔹 initials logic
  const getInitials = (name?: string) => {
    if (!name) return "NA";
    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };



  // If already errored OR url is invalid → show initials
  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-sky-600 text-xl font-semibold uppercase">
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <Image
      src={typeof src === 'string' ? src : '/images/eye-glass-placeholder.png'}
      width={1000}
      height={1000}
      alt={alt || 'image'}
      title={alt || 'image'}
      className={`w-full h-full ${object_cover ? 'object-cover' : 'object-contain'}`}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setHasError(true)}
    />
  )
}
