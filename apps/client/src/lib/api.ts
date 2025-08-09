import axios from "axios";

const API_BASE_URL = import.meta.env.API_URL || "http://localhost:3001";

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});
