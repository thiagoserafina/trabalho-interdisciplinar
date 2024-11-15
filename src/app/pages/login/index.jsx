"use client";

import { LucideEye, LucideEyeClosed } from "lucide-react";
import Image from "next/image";
import React from "react";

const LoginPage = () => {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLoginChange = (e) => setLogin(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Adicionar a lógica de autenticação e a API
    if (login === "usuario" && password === "senha") {
      alert("Login bem-sucedido!");
    } else {
      alert("Login ou senha incorretos!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className="w-2/3 flex items-center justify-center bg-cover"
        style={{ backgroundImage: "url('/images/apae-login.jpg')" }}
      ></div>

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
          <div className="mb-4">
            <input
              type="text"
              placeholder="Insira seu login"
              value={login}
              onChange={handleLoginChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Insira sua senha"
              value={password}
              onChange={handlePasswordChange}
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

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            Acessar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
