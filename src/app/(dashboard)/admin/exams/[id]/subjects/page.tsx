"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";


type Subject = {
    _id: string;
    name: string;
};

export default function AssignSubjectsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: examId } = use(params); // ✅ FIX

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();


    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        const res = await fetch("/api/dashboard/admin/exams/subjects");
        const data = await res.json();
        setSubjects(data.subjects);
    };

    const toggleSubject = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((s) => s !== id)
                : [...prev, id]
        );
    };

    const handleAssign = async () => {
        setLoading(true);

        await fetch(`/api/dashboard/admin/exams/${examId}/subjects`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subjectIds: selected }),
        });

        alert("Subjects assigned successfully");
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-3xl">

            <h1 className="text-2xl font-bold mb-6">
                Assign Subjects to Exam
            </h1>

            <div className="space-y-3">
                {subjects.map((sub) => (
                    <label
                        key={sub._id}
                        className="flex items-center gap-3 border p-3 rounded"
                    >
                        <input
                            type="checkbox"
                            onChange={() => toggleSubject(sub._id)}
                        />
                        <span>{sub.name}</span>
                    </label>
                ))}
            </div>

            <button
                onClick={handleAssign}
                disabled={loading}
                className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
            >
                {loading ? "Saving..." : "Save Subjects"}
            </button>

            <button
                onClick={() => router.push("/admin/exams/subjects")}
                className="mt-4 ml-3 bg-gray-700 text-white px-5 py-2 rounded"
            >
                Go to Subjects Page
            </button>

        </div>
    );
}
