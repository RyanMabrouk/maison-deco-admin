'use client';

import signOut from '@/actions/(auth)/signout';
import React from 'react';

export default function YouAreNotAnAdmin() {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-color3">
      <div className="text-3xl font-bold text-color1 mt-5">
        You are not an admin. Only administrators can access this page.
      </div>
      <button
        className="m-auto w-fit rounded-sm bg-color1 px-4 py-3 text-lg font-semibold text-white shadow-lg transition-opacity hover:opacity-80"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
