"use client";

import { signup } from "@/service/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: "",
    usuario: "",
    senha: "",
    confirmSenha: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.nome ||
      !formData.usuario ||
      !formData.senha ||
      !formData.confirmSenha
    ) {
      setError("Todos os campos são obrigatórios.");
      return false;
    }

    if (formData.senha !== formData.confirmSenha) {
      setError("As senhas não coincidem.");
      return false;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        nome: formData.nome,
        usuario: formData.usuario,
        senha: formData.senha,
      });

      setSuccess("Registro realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Erro ao registrar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className="w-2/3 flex items-center justify-center bg-cover"
        style={{ backgroundImage: "url('/images/apae-login.jpg')" }}
      ></div>

      <div className="w-1/3 flex flex-col items-center justify-center p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-6">Registrar Usuário</h2>
        <form className="w-full max-w-sm" onSubmit={handleRegister}>
          {["nome", "usuario", "senha", "confirmSenha"].map((field, index) => (
            <input
              key={index}
              type={field.includes("senha") ? "password" : "text"}
              name={field}
              placeholder={
                field === "confirmSenha"
                  ? "Confirme a Senha"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={formData[field]}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg"
            />
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 bg-yellow-500 text-white rounded-lg ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-600"
            }`}
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>
        <Link href="/login" className="mt-4 text-blue-500 link">
          Já possui uma conta? Acesse aqui.
        </Link>
      </div>
    </div>
  );
}
