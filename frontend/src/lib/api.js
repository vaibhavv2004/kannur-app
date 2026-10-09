const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function extractErrorMessage(res) {
  try {
    const data = await res.json();
    if (typeof data.detail === "string") return data.detail;
    return JSON.stringify(data.detail ?? data);
  } catch {
    return res.statusText;
  }
}

async function request(path, { method = "GET", token, body, isForm = false } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path, token) => request(path, { token }),
  post: (path, body, token) => request(path, { method: "POST", body, token }),
  postForm: (path, formData) => request(path, { method: "POST", body: formData, isForm: true }),
  patch: (path, body, token) => request(path, { method: "PATCH", body, token }),
  put: (path, body, token) => request(path, { method: "PUT", body, token }),
  del: (path, token) => request(path, { method: "DELETE", token }),

  async getBlobUrl(path, token) {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(await extractErrorMessage(res));
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },
};
