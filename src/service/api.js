"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { TOKEN_KEY } from "@/middleware";
import { jwtDecode } from "jwt-decode";

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

export async function changePassword(data) {
  const cookiesData = await cookies();
  const token = cookiesData.get(TOKEN_KEY).value;

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const decodedToken = jwtDecode(token);
  const { usuario } = decodedToken;

  data.usuario = usuario;

  console.log(data);

  try {
    const response = await axiosInstance.put("/api/login/alterarsenha", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    throw new Error("Erro ao alterar senha.");
  }
}

export async function getEvents() {
  const cookiesData = await cookies();
  const token = cookiesData.get(TOKEN_KEY).value;

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const response = await axiosInstance.get("/api/agendamentos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.map((agendamento) => ({
    id_agendamento: agendamento.id_agendamento,
    nome_aluno: agendamento.nome_aluno,
    nome_funcionario: agendamento.nome_funcionario,
    nome_especialidade: agendamento.nome_especialidade,
    data_agendamento: agendamento.data_agendamento,
    hora_inicio: agendamento.hora_inicio,
    hora_fim: agendamento.hora_fim,
    tipo_atendimento: agendamento.tipo_atendimento,
    sala: agendamento.sala,
    cancelado: agendamento.cancelado,
    color: agendamento.cancelado ? "red" : "green",
    status: agendamento.cancelado ? "Cancelado" : "Agendado",
  }));
}

export async function deleteEvent(id) {
  if (!id) {
    throw new Error("ID do agendamento não fornecido");
  }

  const cookiesData = await cookies();
  const token = cookiesData.get(TOKEN_KEY).value;

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const response = await axiosInstance.delete(`/api/agendamentos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.status;
}

export async function addProfessional(data) {
  const response = await axiosInstance.post("/api/", data);
  return response.status;
}

export async function getStudents() {
  const response = await axiosInstance.get("/api/alunos");
  return response.data;
}

export async function addStudent(data) {
  console.log(data);
  const response = await axiosInstance.post("/api/alunos", data);
  console.log(response.data);
  return response.data;
}

export async function updateStudent(id, data) {
  const response = await axiosInstance.put(`/api/alunos/${id}`, data);
  return response.data;
}

export async function deleteStudent(id) {
  const response = await axiosInstance.delete(`/api/alunos/${id}`);
  return response.status;
}
