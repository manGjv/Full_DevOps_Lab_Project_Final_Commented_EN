import api from "./axios";

export const getQuiz = (id) =>
  api.get(`/quizzes/${id}`);

export const submitQuiz = (id, answers) =>
  api.post(`/quizzes/${id}/submit`, { answers });
