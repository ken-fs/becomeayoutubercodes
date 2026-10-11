"use client";

import { useState } from "react";

/**
 * YouTube embed with a no-JS facade.
 *
 * The thumbnail is served from YouTube's image host and the iframe is only
 * injected on click, so nothing third-party runs on first paint — an always-on
 * embed would ship ~1 MB of player script and tank the page it sits on.
 * youtube-nocookie keeps the player from setting ad cookies before the visitor
 * asks for the video.
 */
export function VideoEmbed({
  id,
  title,
  channel,
  meta,
  className = "",
}: {
  id: string;
  title: string;
  channel: string;
  meta?: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-container)] border rule bg-card">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- remote thumbnail; the optimizer has no server here */}
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-75 transition group-hover:opacity-100"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground shadow-lg transition group-hover:scale-105">
                ▶
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-xs text-muted-foreground">
        <span className="text-foreground">{title}</span>
        {" — "}
        {channel}
        {meta ? `, ${meta}` : ""}. Creator video, embedded from YouTube — all
        credit to the channel.
      </figcaption>
    </figure>
  );
}
