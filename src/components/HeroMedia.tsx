"use client";
import Image from "next/image";
import { useState } from "react";
import { site } from "@/lib/site";

/** Poster image always. On tap, plays the clip if one exists. */
export function HeroMedia() {
  const [play, setPlay] = useState(false);
  const { poster, video, posterAlt } = site.hero;
  if (video && play) {
    return (
      <video className="h-full w-full object-cover" src={video} poster={poster} autoPlay muted loop playsInline controls aria-label={posterAlt} />
    );
  }
  return (
    <div className="relative h-full w-full">
      <Image src={poster} alt={posterAlt} fill priority sizes="100vw" className="object-cover" />
      {video && (
        <button type="button" onClick={() => setPlay(true)} className="btn btn-primary absolute bottom-4 left-4" aria-label="Play clip">
          Play clip
        </button>
      )}
    </div>
  );
}
