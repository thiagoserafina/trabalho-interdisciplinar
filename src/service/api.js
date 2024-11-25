"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { TOKEN_KEY } from "@/middleware";

const BASE_URL = "http://localhost:3030";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function signup(data) {
  const response = await axiosInstance.post("/api/login/criarusuario", data);
  return response.data;
}

export async function login(data) {
  const response = await axiosInstance.post("/api/login", data);

  const { token } = response.data;
  if (token) {
    const cookiesData = await cookies();
    cookiesData.set(TOKEN_KEY, token);
  }

  return response.data;
}

export async function logout() {
  const cookiesData = await cookies();
  cookiesData.delete(TOKEN_KEY);
}
