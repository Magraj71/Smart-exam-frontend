"use client";

import { useState } from "react";

export default function CreateSubjectPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [subjectClass, setSubjectClass] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/dashboard/admin/exams/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, code, class: subjectClass }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Subject created");
      window.location.href = "/admin/exams/subjects";
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Create Subject</h1>

      <input
        type="text"
        placeholder="Subject Name"
        className="w-full border p-2 mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Subject Code"
        className="w-full border p-2 mb-3"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <input
        type="text"
        placeholder="Class (example: 10)"
        className="w-full border p-2 mb-3"
        value={subjectClass}
        onChange={(e) => setSubjectClass(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Subject
      </button>
    </div>
  );
}
