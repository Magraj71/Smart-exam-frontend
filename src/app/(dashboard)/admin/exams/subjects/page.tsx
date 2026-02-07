"use client";

import { useEffect, useState } from "react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await fetch("/api/dashboard/admin/exams/subjects");
    const data = await res.json();
    setSubjects(data.subjects);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subjects</h1>

      <button
        onClick={() => (window.location.href = "/admin/exams/subjects/create")}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add Subject
      </button>

      <div className="grid gap-3">
        {subjects.map((sub) => (
          <div key={sub._id} className="border p-3 rounded">
            <h2 className="font-semibold">{sub.name}</h2>
            <p>Code: {sub.code}</p>
            <p>Class: {sub.class}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
