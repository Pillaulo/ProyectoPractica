const API_BASE = '/api';

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || 'Error desconocido del servidor';
    throw new Error(message);
  }
  return data;
}

export async function generateStory(request) {
  const response = await fetch(`${API_BASE}/story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return handleResponse(response);
}

export async function getSessions() {
  const response = await fetch(`${API_BASE}/sessions`);
  return handleResponse(response);
}

export async function getSessionById(id) {
  const response = await fetch(`${API_BASE}/sessions/${id}`);
  return handleResponse(response);
}
