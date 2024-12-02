"use client";

import React, { useState } from "react";
import Layout from "../components/layout";
import { LogOut } from "lucide-react";
import { changePassword, logout } from "@/service/api";

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  function handleChangePasswordModal() {
    setIsModalOpen(true);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleChangePassword() {
    if (!oldPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await changePassword({ senha: oldPassword, novaSenha: confirmPassword });
      setSuccess("Senha alterada com sucesso!");
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setError("Erro ao alterar senha.");
    }
  }

  return (
    <Layout>
      <button className="action-button" onClick={handleChangePasswordModal}>
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

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Alterar Senha</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mb-4">{success}</p>
            )}
            <div className="mb-4">
              <input
                type="password"
                placeholder="Sua senha"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleChangePassword}
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
