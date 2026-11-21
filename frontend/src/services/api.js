

const API_BASE_URL = "http://localhost:5205/api";

async function apiRequest(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

// Get registrations with search, filters, and pagination
export async function getRegistrations({
  participantName = "",
  type = "",
  status = "",
  page = 1,
  pageSize = 10,
} = {}) {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("pageSize", pageSize);

  if (participantName.trim()) {
    params.append("participantName", participantName.trim());
  }

  if (type) {
    params.append("type", type);
  }

  if (status) {
    params.append("status", status);
  }

  return apiRequest(
    `${API_BASE_URL}/registrations?${params.toString()}`
  );
}

// Get dashboard summary
export async function getSummary() {
  return apiRequest(`${API_BASE_URL}/registrations/summary`);
}

// Get one registration
export async function getRegistrationById(id) {
  return apiRequest(`${API_BASE_URL}/registrations/${id}`);
}
