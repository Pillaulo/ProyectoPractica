import { apiClient } from "./apiClient";

export const createStory = (payload) =>
  apiClient("/story", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchSessions = () => apiClient("/sessions");

export const fetchSessionById = (id) => apiClient(`/sessions/${id}`);
