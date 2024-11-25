"use client";

import { login } from "@/service/api";
import { LucideEye, LucideEyeClosed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ usuario: "", senha: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Tentando realizar login");
    setError("");

    if (!credentials.usuario || !credentials.senha) {
      console.log("Campos vazios");
      setError("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      await login(credentials);
      window.location.href = "/calendar";
    } catch (err) {
      console.error("Erro ao realizar login", err);
      setError(err?.response?.data?.error || "Erro ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Imagem da esquerda */}
      <div
        className="w-2/3 flex items-center justify-center bg-cover"
        style={{ backgroundImage: "url('/images/apae-login.jpg')" }}
      ></div>

      {/* Formulário de login */}
      <div className="w-1/3 flex flex-col items-center justify-center p-8 bg-white">
        <Image
          src="/images/apae-logo.png"
          alt="APAE Logo"
          className="w-24 mb-6"
          width={100}
          height={100}
        />
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          {/* Campo de usuário */}
          <div className="mb-4">
            <input
              type="text"
              name="usuario"
              placeholder="Insira seu login"
              value={credentials.usuario}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Campo de senha */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="senha"
              placeholder="Insira sua senha"
              value={credentials.senha}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {showPassword ? (
                <LucideEye width={20} />
              ) : (
                <LucideEyeClosed width={20} />
              )}
            </span>
          </div>

          {/* Mensagens de erro */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-600"
            } focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50`}
          >
            {isLoading ? "Entrando..." : "Acessar"}
          </button>
        </form>

        {/* Link para registro */}
        <div className="mb-4 mt-4">
          <Link href="/register" className="text-blue-500 hover:underline">
            Cadastrar-se
          </Link>
        </div>
      </div>
    </div>
  );
}
