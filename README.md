# Smart Bookmark App

A simple real-time bookmark manager built using Next.js (App Router), Supabase (Auth + Database + Realtime), and deployed on Vercel.

---

## Live Demo

https://smart-bookmark-app-tan-alpha.vercel.app/

---

## Tech Stack

- Next.js (App Router)
- Supabase (Google Auth, PostgreSQL, Realtime)
- Tailwind CSS
- Vercel Deployment

---

## Features Implemented

- Google OAuth authentication only (no email/password)
- Users can add bookmarks (Title + URL)
- Bookmarks are private per user (Row Level Security enforced)
- Real-time multi-tab updates (no page refresh required)
- Users can delete their own bookmarks
- Secure production deployment

---

## Authentication

- Google OAuth configured via Supabase
- No traditional email/password login
- Redirect-based login flow
- Session validation before accessing dashboard

---

## Database Security (Row Level Security)

Row Level Security (RLS) is enabled to ensure:

- A user can only view their own bookmarks
- A user can only insert bookmarks under their own user_id
- A user can only delete their own bookmarks

All data isolation is enforced at the database level.

---

## Real-Time Implementation

Supabase Realtime is used with filtered subscriptions:

- Subscribes to `postgres_changes`
- Filters by `user_id`
- Automatically updates UI when:
  - A bookmark is added
  - A bookmark is deleted
- Works across multiple browser tabs

---

## Deployment

The app is deployed on Vercel.




Supabase production redirect URLs were configured to allow Google OAuth login from the Vercel domain.

---

## Problems Faced & How I Solved Them

### 1️⃣ Realtime Not Updating Across Tabs

**Problem:**  
Bookmarks were inserting correctly but other tabs were not updating automatically.

**Cause:**  
Realtime subscription was not filtered by `user_id`, and subscription was initialized before session validation.

**Solution:**  
- Waited for session before creating subscription
- Added filter:  
  `filter: user_id=eq.${userId}`
- Cleaned up channels on unmount to prevent duplicate listeners

---

### 2️⃣ Google OAuth Redirect Failing in Production

**Problem:**  
After deployment, login resulted in 404 errors.

**Cause:**  
Supabase Site URL and Redirect URLs were not configured for the Vercel domain.

**Solution:**  
- Updated Supabase Authentication → URL Configuration
- Set Site URL to production domain
- Added `/dashboard` to Redirect URLs

---

### 3️⃣ Environment Variables Not Working in Production

**Problem:**  
Supabase client was failing in production.

**Cause:**  
Environment variables were not added in Vercel dashboard.

**Solution:**  
- Added required environment variables in Vercel project settings
- Redeployed project

---

### 4️⃣ Git Deployment Issue

**Problem:**  
Project was not deploying properly because Git was initialized in the wrong directory.

**Solution:**  
- Moved into correct project folder
- Reinitialized Git
- Pushed correct project root to GitHub
- Redeployed via Vercel

---

## Architecture Overview

Frontend:
- Next.js App Router (Client Components)
- Supabase JS Client

Backend:
- Supabase PostgreSQL
- Row Level Security
- Supabase Realtime via WebSocket

Hosting:
- Vercel

---

## Submission Details

GitHub Repository:
https://github.com/Ryshup/smart-bookmark-app

Live URL:
https://smart-bookmark-app-tan-alpha.vercel.app/


Environment variables configured in Vercel:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
