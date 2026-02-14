"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    let channel: any;

    const setup = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      const userId = session.user.id;

      await fetchBookmarks(userId);

      // 🔥 Create realtime channel AFTER user is confirmed
      channel = supabase
        .channel("bookmark-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${userId}`,
          },
          () => {
            fetchBookmarks(userId);
          }
        )
        .subscribe();
    };

    setup();

    // Cleanup to avoid duplicate subscriptions
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const addBookmark = async (title: string, url: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: session.user.id,
      },
    ]);
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as any;
          addBookmark(form.title.value, form.url.value);
          form.reset();
        }}
        className="flex gap-2 mb-6"
      >
        <input
          name="title"
          placeholder="Title"
          required
          className="flex-1 bg-gray-100 border border-gray-400 rounded p-2 text-gray-800"
        />
        <input
          name="url"
          placeholder="URL"
          required
          className="flex-1 bg-gray-100 border border-gray-400 rounded p-2 text-gray-800"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <ul>
        {bookmarks.map((b) => (
          <li key={b.id} className="flex justify-between border-b py-2">
            <a href={b.url} target="_blank">
              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
