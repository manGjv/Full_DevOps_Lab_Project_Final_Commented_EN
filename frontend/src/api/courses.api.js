import api from "./axios";

export const getCourses = (level) =>
  api.get("/courses", { params: { level } });

export const getCourseById = (id) =>
  api.get(`/courses/${id}`);
