"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const displayImages = images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"];

  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main active image */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border bg-muted">
        <Image
          src={displayImages[selected]}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          unoptimized={displayImages[selected]?.startsWith("data:")}
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => setSelected(idx)}
              className={`relative h-20 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selected === idx ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized={url?.startsWith("data:")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
