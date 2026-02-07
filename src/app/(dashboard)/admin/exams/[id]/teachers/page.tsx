"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AssignTeachersPage() {
  const params = useParams();
  const router = useRouter();

  const examId = params.id as string;

  const [exam, setExam] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!examId) return;

    setLoading(true);

    // get exam
    const examRes = await fetch(`/api/dashboard/admin/exams/${examId}`);
    const examData = await examRes.json();
    console.log("EXAM API RESPONSE:", examData);
    setExam(examData.exam);

    // get teachers
    const teacherRes = await fetch(`/api/dashboard/admin/users?role=teacher`);
    const teacherData = await teacherRes.json();
    setTeachers(teacherData.users);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const handleAssign = async (subjectIndex: number, teacherId: string) => {
    const res = await fetch(
      `/api/dashboard/admin/exams/${examId}/assign-teacher`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectIndex, teacherId }),
      }
    );

    const data = await res.json();
    alert(data.message);
    fetchData();
  };

  if (loading) return <p>Loading...</p>;
  if (!exam) return <p>No exam found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assign Teachers</h1>

      {teachers.length === 0 ? (
        <div className="p-6 border rounded bg-yellow-50">
          <p className="text-lg font-semibold mb-2">
            No teachers found in database
          </p>

          <p className="text-sm text-gray-600 mb-4">
            Please add teachers before assigning them to subjects.
          </p>

          <button
            onClick={() => router.push("/admin/users/create?role=teacher")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Teacher
          </button>
        </div>
      ) : (
        exam.subjects.map((sub: any, index: number) => (
          <div key={index} className="border p-4 rounded mb-4 bg-white shadow">
            <h2 className="font-semibold">{sub.subjectName}</h2>

            <select
              className="mt-2 border p-2 rounded"
              defaultValue={sub.teacherId || ""}
              onChange={(e) => handleAssign(index, e.target.value)}
            >
              <option value="">Select Teacher</option>

              {teachers.map((teacher: any) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name} ({teacher.subjects?.join(", ")})
                </option>
              ))}
            </select>
          </div>
        ))
      )}
    </div>
  );
}
