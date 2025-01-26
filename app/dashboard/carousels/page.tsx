'use client';
import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function Loading() {
  return (
    <div className=" flex min-h-screen flex-col items-center justify-center">
      <Player
        className=""
        autoplay
        loop
        src="/under.json"
        style={{ height: '20rem', width: '25rem' }}
      />
      <span className="-ml-12 text-3xl font-bold text-blue-900">
        En construcción
      </span>
    </div>
  );
}
