# Pastebin-Lite

Pastebin-Lite is a lightweight Pastebin-style web application where users can create text pastes and share a URL to view them.  
Each paste can optionally expire after a fixed time (TTL) or after a limited number of views.

This project is built as part of a **Take-Home Assignment** and is compatible with automated grading tests.

---

## Features

- Create a text paste
- Generate a shareable URL
- View paste via API or browser
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Automatic unavailability once constraints are triggered
- Safe rendering (XSS protected)
- Deterministic time support for testing

---

## Tech Stack

- **Framework**: Next.js (Node.js API Routes)
- **Database**: MongoDB
- **ODM**: Mongoose
- **Deployment**: Vercel (recommended)

---

## Project Setup

Follow the steps below to run the project locally.

---

### Prerequisites

Make sure you have the following installed:

- Node.js (v20 or later recommended)
- npm
- MongoDB (local) OR MongoDB Atlas

Check versions:
```bash
node -v
npm -v
mongod --version

### Clone the Repository

-git clone https://github.com/my-username/pastebin-lite.git
-cd pastebin-lite

2. Install Dependencies
 - npm install

3. Run the Development Server
 - npm run dev

