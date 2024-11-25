"use client";

import React from "react";
import Layout from "../components/layout";
import { LogOut } from "lucide-react";
import { logout } from "@/service/api";

export default function SettingsPage() {
  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/login"; // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  function handleChangePassword() {
    // Implementar lógica de alteração de senha
  }

  return (
    <Layout>
      <button className="action-button" onClick={handleChangePassword}>
        Alterar senha
      </button>
      <button
        className="flat-button"
        style={{ color: "red" }}
        onClick={handleLogout}
      >
        <LogOut size={20} />
        Logout
      </button>
    </Layout>
  );
}
