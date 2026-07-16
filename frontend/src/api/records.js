import axios from "axios";

// Base URL for the backend API. Adjust via .env (VITE_API_URL) for deployment.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Fetch records, optionally filtered by a time range.
 * @param {string} range - one of "today" | "7days" | "month" | "6months" | "year" | "all"
 */
export const fetchRecords = async (range = "7days") => {
  const { data } = await client.get("/records", { params: { range } });
  return data; // { success, count, stats, data: [...] }
};

/**
 * Create a new BP/pulse reading.
 */
export const createRecord = async (payload) => {
  const { data } = await client.post("/records", payload);
  return data; // { success, data: {...} }
};

/**
 * Delete a reading by its ID.
 */
export const deleteRecord = async (id) => {
  const { data } = await client.delete(`/records/${id}`);
  return data;
};

export default client;
