// src/api/users.api.js
import api from "./axios";

// Met à jour les infos utilisateur
export const updateUser = async (userId, data) => {
  return await api.put(`/user/${userId}`, data);
};

export const deleteUser = async (userId) => {
  return await api.delete(`/user/${userId}`);
};

// Récupère les badges
export const getUserBadges = async (userId) => {
  return await api.get(`/user/${userId}/badges`);
};

// Récupère la progression
export const getUserProgress = async (userId) => {
  return await api.get(`/user/${userId}/progress`);
};
