"use client";

import { supabase } from "@/lib/supabase";

export default function Home() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-6">
      
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-10 max-w-md w-full text-center border border-white/40">
        
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Smart Bookmark
        </h1>
        <p className="text-gray-600 mb-8">
          Save, manage and access your bookmarks in real-time from anywhere.
        </p>

        {/* Google Button */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 px-6 py-3 rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition duration-200"
        >
         
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>

        {/* Small Footer Text */}
        <p className="text-xs text-gray-500 mt-6">
          Secure login powered by Google OAuth
        </p>
      </div>
    </main>
  );
}
