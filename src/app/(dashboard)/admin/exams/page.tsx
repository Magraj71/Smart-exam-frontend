"use client";

import { useEffect, useState } from "react";

export default function AdminExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/admin/exams", {
      credentials: "include",
    });
    const data = await res.json();
    setExams(data.exams);
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exam Management</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        onClick={() => (window.location.href = "/admin/exams/create")}
      >
        + Create Exam
      </button>

      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam: any) => (
            <div key={exam._id} className="p-5 border rounded shadow bg-white">
              
              <h2 className="text-lg font-semibold">{exam.title}</h2>
              <p className="text-sm text-gray-600">Class: {exam.class}</p>
              <p className="text-sm text-gray-600 mb-4">
                Status: {exam.status || "Draft"}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() =>
                    (window.location.href = `/admin/exams/${exam._id}/subjects`)
                  }
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                >
                  Subjects
                </button>

                <button
                  onClick={() =>
                    (window.location.href = `/admin/exams/${exam._id}/teachers`)
                  }
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
                >
                  Teachers
                </button>

                <button
                  onClick={() =>
                    (window.location.href = `/admin/exams/${exam._id}/schedule`)
                  }
                  className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                >
                  Schedule
                </button>

                <button
                  onClick={() =>
                    (window.location.href = `/admin/exams/${exam._id}/marks`)
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Marks
                </button>

                <button
                  onClick={() =>
                    (window.location.href = `/admin/exams/${exam._id}/result`)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Result
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
