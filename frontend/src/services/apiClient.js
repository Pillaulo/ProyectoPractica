const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const apiClient = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (_error) {
    throw new Error("No se pudo conectar con el backend. Verifica que este encendido.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || "No se pudo completar la solicitud.";
    throw new Error(message);
  }

  return data;
};
