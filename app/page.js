"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function createPaste() {
    if (!content.trim()) {
      alert("Please enter some text");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setUrl(data.url);
    setLoading(false);
  }

  return (
    <div className="container">
      <div className="card">
        <h1> Pastebin Lite</h1>
        <p className="subtitle">Create and share text easily</p>

        <textarea
          placeholder="Write your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={createPaste} disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {url && (
          <div className="result">
            <p>✅ Paste created</p>
            <a href={url} target="_blank">{url}</a>
          </div>
        )}
      </div>
    </div>
  );
}

