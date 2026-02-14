"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchBookmarks();
    subscribeRealtime();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) router.push("/");
  };

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const addBookmark = async (title: string, url: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const subscribeRealtime = () => {
    supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks())
      .subscribe();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Smart Bookmarks
          </h1>
          <button
  onClick={logout}
  className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 hover:shadow-md transition"
>
  Logout
</button>

        </div>

        {/* Add Bookmark Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Add New Bookmark
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as any;
              addBookmark(form.title.value, form.url.value);
              form.reset();
            }}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
  name="title"
  placeholder="Bookmark title"
  required
  className="flex-1 bg-gray-100 border border-gray-400 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
/>

<input
  name="url"
  placeholder="https://example.com"
  required
  className="flex-1 bg-gray-100 border border-gray-400 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
/>


            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
              Add
            </button>
          </form>
        </div>

        {/* Bookmark Grid */}
        {bookmarks.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No bookmarks yet. Add your first one!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {bookmark.title}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      className="text-indigo-600 text-sm break-all hover:underline"
                    >
                      {bookmark.url}
                    </a>
                  </div>

                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
