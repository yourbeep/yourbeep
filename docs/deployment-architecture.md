# YourBeep Deployment Architecture

## Overview

This document describes the recommended production and staging deployment setup for the current YourBeep stack.

The goal is:

- keep infrastructure cost low
- keep deployment simple enough for a small team
- use Vercel where it adds the most value
- keep the backend on a VPS for control and predictable cost
- use Cloudinary for images/files during the current phase
- move media delivery further toward Bunny later when the platform is stable

---

## Final Stack

### Backend

- Primary choice: **Hetzner VPS**
- Alternative choice: **DigitalOcean VPS**

Reason:

- Hetzner gives the best price/performance
- DigitalOcean is a good fallback if easier documentation/support is preferred

---

### Admin Panel

- App: `admin_yourbeep`
- Hosting: **Vercel**

Recommended usage:

- `Hobby` during testing
- `Pro` when production traffic, team collaboration, or usage limits require it

---

### User Web App

- App: `yourbeep-web`
- Hosting now: **same VPS as backend**
- Hosting later: **Bunny Storage + Bunny CDN**

Reason:

- right now, self-hosting the web app on the VPS keeps cost and deployment complexity lower
- later, Bunny can take over static delivery for faster global asset serving

---

### Database

- **MongoDB Atlas Flex**

Later:

- move to **Atlas Dedicated** only when traffic or workload requires it

---

### Authentication

- **Firebase Auth**

Used for:

- email/password login
- Google login
- admin auth
- user auth

Backend remains responsible for:

- user profile data
- session metadata
- device metadata
- role/permission enforcement

---

### Video Delivery

- **Bunny Stream**

Used for:

- course lesson videos
- course trailers
- masterclass videos

---

### Images and File Uploads

### Current phase

- **Cloudinary**

Used for:

- course thumbnails
- banners
- profile avatars
- admin uploads
- files and images that are not yet moved to Bunny

### Later phase

- move toward **Bunny** for broader media delivery if needed

Important:

- for now, testing and early production should continue with Cloudinary for image/file uploads
- Bunny is the later optimization path, not the immediate requirement

---

## Domain Layout

Recommended subdomains:

- `admin.yourdomain.com` -> `admin_yourbeep` on Vercel
- `app.yourdomain.com` -> `yourbeep-web` on VPS now
- `api.yourdomain.com` -> backend services on VPS

Later:

- `app.yourdomain.com` can point to Bunny-backed static hosting if the user frontend is moved there

---

## VPS Deployment Layout

Recommended on the VPS:

- Docker Compose
- reverse proxy: **Caddy** or **Nginx**

Suggested services:

- `identity`
- `content`
- `commerce`
- `notification` if separate
- `yourbeep-web` static build
- reverse proxy container

This keeps:

- one controlled deployment target
- one TLS entry point
- one place to manage service restarts and env variables

---

## Recommended Rollout Plan

### Phase 1

- Backend on Hetzner VPS
- `yourbeep-web` hosted on the same VPS
- `admin_yourbeep` on Vercel
- MongoDB Atlas Flex
- Firebase Auth
- Bunny Stream for video only
- Cloudinary for image/file uploads

### Phase 2

- move `yourbeep-web` static hosting to Bunny Storage + Bunny CDN if desired
- keep backend on VPS
- keep Cloudinary if upload workflows are stable and already integrated

### Phase 3

- evaluate:
  - Atlas Dedicated
  - larger VPS
  - more aggressive Bunny usage for media/static delivery

---

## Why This Setup

This architecture is a good balance of:

- low monthly cost
- easy frontend deployment for admin
- full control over backend processes
- safe long-term scaling path
- minimal migration pressure right now

It avoids:

- over-engineering too early
- forcing all media onto Bunny before the image/file workflows are ready
- paying for multiple managed platforms unnecessarily

---

## Recommended Choice Summary

If choosing today:

- **VPS:** Hetzner
- **Backup VPS option:** DigitalOcean
- **Admin hosting:** Vercel
- **User web hosting now:** VPS
- **User web hosting later:** Bunny Storage + CDN
- **Database:** MongoDB Atlas Flex
- **Auth:** Firebase Auth
- **Video:** Bunny Stream
- **Images/files now:** Cloudinary
- **Images/files later:** optionally Bunny

---

## Notes

- Cloudinary stays the active image/file upload platform for now
- Bunny is the later direction for wider media delivery
- Firebase authorized domains must include:
  - local development domains
  - Vercel admin domain
  - production user web domain

