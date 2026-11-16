
const API_BASE_URL = "http://localhost:5205/api";

export async function getRegistrations(page = 1, pageSize = 10) {
  const response = await fetch(
    `${API_BASE_URL}/registrations?page=${page}&pageSize=${pageSize}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch registrations: ${response.status}`);
  }

  return await response.json();
}

export async function getRegistrationSummary() {
  const response = await fetch(
    `${API_BASE_URL}/registrations/summary`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch summary: ${response.status}`);
  }

  return await response.json();
}

export async function getRegistrationById(id) {
  const response = await fetch(
    `${API_BASE_URL}/registrations/${id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch registration: ${response.status}`);
  }

  return await response.json();
}
