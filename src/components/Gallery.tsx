"use client";
import Image from "next/image";
import { useState } from "react";
import type { DropImage } from "@/lib/types";

export function Gallery({ images, name }: { images: DropImage[]; name: string }) {
  const [i, setI] = useState(0);
  const img = images[i];
  if (!img) {
    return <div className="aspect-[4/5] border-2 border-fg bg-line" aria-label={`${name}: image coming`} />;
  }
  return (
    <div>
      <div className="relative aspect-[4/5] border-2 border-fg bg-line">
        <Image src={img.src} alt={img.alt} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        {img.mockup && (
          <span className="absolute left-2 top-2 bg-card px-2 py-1 text-xs font-bold uppercase">Mockup, not a product photo</span>
        )}
      </div>
      {images.length > 1 && (
        <ul className="mt-2 grid grid-cols-4 gap-2" aria-label="Product images">
          {images.map((im, idx) => (
            <li key={im.src}>
              <button
                type="button"
                onClick={() => setI(idx)}
                aria-pressed={idx === i}
                aria-label={`Show image ${idx + 1}: ${im.alt}`}
                className={`relative block aspect-[4/5] w-full border-2 ${idx === i ? "border-fg" : "border-line"}`}
              >
                <Image src={im.src} alt="" fill sizes="25vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
