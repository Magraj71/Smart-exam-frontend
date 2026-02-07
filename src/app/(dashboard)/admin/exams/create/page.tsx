"use client";

import { useState } from "react";

export default function CreateExam() {
  const [title, setTitle] = useState("");
  const [className, setClassName] = useState("");

  const createExam = async () => {
    const res = await fetch("/api/dashboard/admin/exams", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        class: className,
        subjects: [],
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Exam Created");
      window.location.href = "/admin/exams";
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Exam</h1>

      <input
        className="border p-2 mb-3 w-full"
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 mb-3 w-full"
        placeholder="Class"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={createExam}
      >
        Create
      </button>
    </div>
  );
}
