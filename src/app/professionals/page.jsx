"use client";

import  { useState } from "react";
import "./styles.css";


import Layout from "../components/layout";

  
const ProfessionalsPage = () => {

  const [selectedSpecialty, setSelectedSpecialty] = useState("");  
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [workHours, setWorkHours] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);

  const [newProfessional, setNewProfessional] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    specialty: "",
  });

  const [newSpecialty, setNewSpecialty] = useState({ id: "", name: "" });


  const specialties = [
    { id: "fonoaudiologa", name: "Fonoaudióloga" },
    { id: "psicologa", name: "Psicóloga" },
  ];

  const professionals = [
    {
      id: 1,
      name: "Ana dos Santos",
      cpf: "893.310.590-51",
      email: "anasantos@apae.com.br",
      phone: "(48) 91234-5678",
      specialty: "fonoaudiologa",
    },
    {
      id: 2,
      name: "Camila Almeida",
      cpf: "123.456.789-00",
      email: "camila@apae.com.br",
      phone: "(48) 98765-4321",
      specialty: "psicologa",
    },
    {
      id: 3,
      name: "Clara Fernandes",
      cpf: "321.654.987-00",
      email: "clara@apae.com.br",
      phone: "(48) 99999-9999",
      specialty: "fonoaudiologa",
    },
  ];

  const daysOfWeek = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialty(event.target.value);
    setSelectedProfessional(null);
  };

  const handleProfessionalClick = (professional) => {
    setSelectedProfessional(professional);
  };

  const handleSpecialtyInputChange = (e) => {
    const { name, value } = e.target;
    setNewSpecialty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSpecialtyModalSubmit = () => {
    console.log("Nova especialidade:", newSpecialty);
    alert("Nova especialidade adicionada com sucesso!");
    setIsSpecialtyModalOpen(false);
  };


  const handleCheckboxChange = (day) => {
    setWorkHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], noWork: !prev[day]?.noWork },
    }));
  };

  const handleTimeChange = (day, type, value) => {
    setWorkHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  const handleSave = () => {
    console.log("Horários salvos:", workHours);
    alert("Horários salvos com sucesso!");
  };

  const filteredProfessionals = professionals.filter(
    (professional) => professional.specialty === selectedSpecialty
  );

  const handleModalSubmit = () => {
    console.log("Novo profissional:", newProfessional);
    alert("Novo profissional adicionado com sucesso!");
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfessional((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
    <Layout>
      <div className="flex flex-col h-screen bg-gray p-6 professionals-page">
      <header className="mb-6">
        <div className="header">
          <h2>Profissionais</h2>
        </div>
        <div className="flex justify-between items-center mb-1">
          <select
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            className="p-2 w-1/6 text-sm border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">Selecione uma especialidade</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
          <div className="flex gap-4">
          <button
              className="bg-gray-200 text-black px-4 py-2 text-sm rounded-md shadow hover:bg-gray-300"
              onClick={() => setIsSpecialtyModalOpen(true)}
            >
              + Nova especialidade
            </button>
            <button
              className="bg-yellow-400 text-black px-4 py-2 text-sm rounded-md shadow hover:bg-yellow-500"
              onClick={() => setIsModalOpen(true)}
            >
              + Novo profissional
            </button>
          </div>
        </div>
      </header>

      <div className="flex gap-6 h-full bg-gray ">
        <div className="w-1/6 bg-gray-100 rounded-lg shadow-md p-4 h-screen overflow-y-auto">
          <ul>
            {filteredProfessionals.map((professional) => (
              <li
                key={professional.id}
                className={`p-3 rounded-md cursor-pointer ${
                  selectedSpecialty &&
                  "underline underline-offset-4 decoration-yellow-400 font-semibold text-center"
                }`}
                onClick={() => handleProfessionalClick(professional)}
              >
                {professional.name}
              </li>
            ))}
            {filteredProfessionals.length === 0 && (
              <p className="text-gray-500 text-sm text-center">Nenhum profissional encontrado.</p>
            )}
          </ul>
        </div>

        {selectedProfessional && (
          <div className="w-full bg-gray-100 rounded-lg shadow-md p-6 h-screen">
            <h2 className="text-xl font-bold mb-4">Informações do Profissional</h2>
            <form>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nome</label>
                  <input
                    type="text"
                    defaultValue={selectedProfessional.name}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">CPF</label>
                  <input
                    type="text"
                    defaultValue={selectedProfessional.cpf}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Especialidade</label>
                  <input
                    type="text"
                    value={
                      specialties.find((s) => s.id === selectedSpecialty)?.name ||
                      ""
                    }
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={selectedProfessional.email}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Telefone</label>
                  <input
                    type="tel"
                    defaultValue={selectedProfessional.phone}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold mt-6 mb-4">Horários de Expediente</h3>
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center gap-4 mb-2 text-sm">
                  <label className="w-24">{day}</label>
                  <input
                    type="time"
                    className="w-1/4 p-2 border border-gray-300 rounded-lg"
                    disabled={workHours[day]?.noWork}
                    value={workHours[day]?.start || ""}
                    onChange={(e) =>
                      handleTimeChange(day, "start", e.target.value)
                    }
                  />
                  <span>-</span>
                  <input
                    type="time"
                    className="w-1/4 p-2 border border-gray-300 rounded-lg"
                    disabled={workHours[day]?.noWork}
                    value={workHours[day]?.end || ""}
                    onChange={(e) =>
                      handleTimeChange(day, "end", e.target.value)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={workHours[day]?.noWork || false}
                      onChange={() => handleCheckboxChange(day)}
                    />
                    <span>Sem expediente</span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500"
                onClick={handleSave}
              >
                Salvar
              </button>
            </form>
          </div>
        )}
      </div>

      

    {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <div className="header">
                <h2>Adicionar novo profissional</h2>
              </div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Nome</label>
                    <input
                      type="text"
                      name="name"
                      value={newProfessional.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={newProfessional.cpf}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newProfessional.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Telefone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newProfessional.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-1">Especialidade</label>
                    <select
                      name="specialty"
                      value={newProfessional.specialty}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="">Selecione uma especialidade</option>
                      {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      className="bg-gray-200 text-black px-4 py-2 rounded-md shadow hover:bg-gray-300"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="bg-yellow-400 text-black px-4 py-2 rounded-md shadow hover:bg-yellow-500"
                      onClick={handleModalSubmit}
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}


      {isSpecialtyModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <div className="header">
                <h2>Adicionar nova especialidade</h2>
              </div>              
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">Nome</label>
                  <input
                    type="text"
                    name="name"
                    value={newSpecialty.name}
                    onChange={handleSpecialtyInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-gray-200 text-black px-4 py-2 rounded-md shadow hover:bg-gray-300"
                    onClick={() => setIsSpecialtyModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="bg-yellow-400 text-black px-4 py-2 rounded-md shadow hover:bg-yellow-500"
                    onClick={handleSpecialtyModalSubmit}
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </div>
    </Layout>
  );
};

export default ProfessionalsPage;
