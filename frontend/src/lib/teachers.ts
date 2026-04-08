import type { Teacher } from "@/lib/types";

export function slugifyTeacherName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function getTeacherSlug(teacher: Pick<Teacher, "id" | "name">) {
  const nameSlug = slugifyTeacherName(teacher.name) || "teacher";
  const teacherId = encodeURIComponent(teacher.id);
  return `${nameSlug}~${teacherId}`;
}

export function getTeacherPath(teacher: Pick<Teacher, "id" | "name">) {
  return `/teachers/${getTeacherSlug(teacher)}`;
}

export function findTeacherBySlug(teachers: Teacher[], slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  const separatorIndex = decodedSlug.lastIndexOf("~");

  if (separatorIndex >= 0) {
    const teacherId = decodedSlug.slice(separatorIndex + 1);
    const teacher = teachers.find((item) => item.id === teacherId);
    if (teacher) return teacher;
  }

  return (
    teachers.find((item) => item.id === decodedSlug) ||
    teachers.find((item) => slugifyTeacherName(item.name) === decodedSlug) ||
    null
  );
}
