"use client";

import { useEffect, useState } from "react";
import "./styles.css";

import Layout from "../components/layout";
import {
  addProfessional,
  addSpecialty,
  getProfessionalsBySpecialty,
  getSpecialties,
  updateProfessional,
} from "@/service/api";

const disponibilidadePadrao = {
  segunda: ["08:00-12:00", "14:00-18:00"],
  terca: ["08:00-12:00", "14:00-18:00"],
  quarta: ["08:00-12:00", "14:00-18:00"],
  quinta: ["08:00-12:00", "14:00-18:00"],
  sexta: ["08:00-12:00", "14:00-18:00"],
};

const ProfessionalsPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [workHours, setWorkHours] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [newProfessional, setNewProfessional] = useState({
    nome_funcionario: "",
    cpf: "",
    email: "",
    telefone: "",
    id_especialidade: "",
    disponibilidade: disponibilidadePadrao,
  });

  const [newSpecialty, setNewSpecialty] = useState({
    nome_especialidade: "",
  });

  const daysOfWeek = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const specialtiesData = await getSpecialties();
        setSpecialties(specialtiesData);
      } catch (error) {
        console.error("Erro ao carregar especialidades:", error);
      }
    };
    loadSpecialties();
  }, []);

  const handleSpecialtyChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedSpecialty(selectedId);
    setSelectedProfessional(null);

    try {
      const professionalsData = await getProfessionalsBySpecialty(selectedId);
      setProfessionals(professionalsData);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
      setProfessionals([]);
    }
  };

  const handleSpecialtyInputChange = (e) => {
    const { name, value } = e.target;
    setNewSpecialty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProfessional = async () => {
    try {
      await addProfessional(newProfessional);
      alert("Profissional adicionado com sucesso!");
      setIsModalOpen(false);
      setSelectedSpecialty(""); // Reset para forçar recarregamento
    } catch (error) {
      console.error("Erro ao adicionar profissional:", error);
      alert("Erro ao adicionar profissional.");
    }
  };

  const handleEditProfessional = async () => {
    if (selectedProfessional) {
      try {
        await updateProfessional(selectedProfessional.id_funcionario, {
          ...selectedProfessional,
          disponibilidade: workHours, // Enviar horários no formato JSONB
        });
        alert("Profissional atualizado com sucesso!");
        setIsEditing(false);

        // Recarregar a lista de profissionais para a especialidade selecionada
        if (selectedSpecialty) {
          const updatedProfessionals = await getProfessionalsBySpecialty(
            selectedSpecialty
          );
          setProfessionals(updatedProfessionals);
        }
      } catch (error) {
        console.error("Erro ao editar profissional:", error);
        alert("Erro ao editar profissional.");
      }
    }
  };

  const handleAddSpecialty = async () => {
    try {
      await addSpecialty(newSpecialty);
      alert("Especialidade adicionada com sucesso!");
      setNewSpecialty({ nome_especialidade: "" });
      setIsSpecialtyModalOpen(false);

      const updatedSpecialties = await getSpecialties();
      setSpecialties(updatedSpecialties);
    } catch (error) {
      console.error("Erro ao adicionar especialidade:", error);
      alert("Erro ao adicionar especialidade.");
    }
  };

  const handleTimeChange = (day, index, type, value) => {
    setWorkHours((prev) => {
      const updatedDay = [...prev[day]];
      const [start, end] = updatedDay[index]?.split("-") || ["", ""];
      updatedDay[index] =
        type === "start" ? `${value}-${end}` : `${start}-${value}`;
      return { ...prev, [day]: updatedDay };
    });
  };

  const addTimeSlot = (day) => {
    setWorkHours((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), "08:00-12:00"], // Adicionar slot padrão
    }));
  };

  const removeTimeSlot = (day, index) => {
    setWorkHours((prev) => {
      const updatedDay = [...prev[day]];
      updatedDay.splice(index, 1);
      return { ...prev, [day]: updatedDay };
    });
  };

  useEffect(() => {
    if (selectedProfessional?.disponibilidade) {
      setWorkHours(selectedProfessional.disponibilidade);
    }
  }, [selectedProfessional]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfessional((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectedProfessionalChange = (e) => {
    const { name, value } = e.target;
    setSelectedProfessional((prev) => ({
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
                <option
                  key={specialty.id_especialidade}
                  value={specialty.id_especialidade}
                >
                  {specialty.nome_especialidade}
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

        <div className="flex gap-6 h-100 bg-gray ">
          <div className="w-1/6 bg-gray-100 rounded-lg shadow-md p-4 overflow-y-auto profissional-list">
            <ul>
              {professionals.map((professional) => (
                <li
                  key={professional.id_funcionario}
                  className="p-3 rounded-md cursor-pointer underline underline-offset-4 decoration-yellow-400 font-semibold text-center"
                  onClick={() => setSelectedProfessional(professional)}
                >
                  {professional.nome_funcionario}
                </li>
              ))}
              {professionals.length === 0 && (
                <p className="text-gray-500 text-sm text-center">
                  Nenhum profissional encontrado.
                </p>
              )}
            </ul>
          </div>

          {selectedProfessional && (
            <div className="w-5/6 bg-gray-100 rounded-lg shadow-md p-6 profissional-container">
              <h2 className="text-xl font-bold mb-4">
                Informações do Profissional
              </h2>
              <form>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nome_funcionario"
                      value={selectedProfessional.nome_funcionario}
                      onChange={handleSelectedProfessionalChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={selectedProfessional.cpf}
                      onChange={handleSelectedProfessionalChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Especialidade
                    </label>
                    <input
                      type="text"
                      value={
                        specialties.find(
                          (s) =>
                            s.id_especialidade ===
                            selectedProfessional.id_especialidade
                        )?.nome_especialidade || ""
                      }
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={selectedProfessional.email}
                      onChange={handleSelectedProfessionalChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={selectedProfessional.telefone}
                      onChange={handleSelectedProfessionalChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-bold mt-6 mb-4">
                  Horários de Expediente
                </h3>
                {daysOfWeek.map((day) => (
                  <div key={day} className="mb-4">
                    <h4 className="text-lg font-bold mb-2">{day}</h4>
                    {(workHours[day.toLowerCase()] || []).map(
                      (timeSlot, index) => {
                        const [start, end] = timeSlot.split("-");
                        return (
                          <div
                            key={index}
                            className="flex gap-4 mb-2 items-center"
                          >
                            <input
                              type="time"
                              value={start}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.toLowerCase(),
                                  index,
                                  "start",
                                  e.target.value
                                )
                              }
                              disabled={!isEditing}
                              className="w-1/4 p-2 border border-gray-300 rounded-lg"
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={end}
                              onChange={(e) =>
                                handleTimeChange(
                                  day.toLowerCase(),
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                              disabled={!isEditing}
                              className="w-1/4 p-2 border border-gray-300 rounded-lg"
                            />
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeTimeSlot(day.toLowerCase(), index)
                                }
                                className="text-red-500 font-bold"
                              >
                                Remover
                              </button>
                            )}
                          </div>
                        );
                      }
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => addTimeSlot(day.toLowerCase())}
                        className="text-blue-500 font-bold mt-2"
                      >
                        Adicionar intervalo
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    className="bg-gray-200 text-black px-4 py-2 rounded-md shadow hover:bg-gray-300"
                    onClick={() => setIsEditing((prev) => !prev)}
                  >
                    {isEditing ? "Cancelar" : "Editar"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      className="bg-yellow-400 text-black px-4 py-2 rounded-md shadow hover:bg-yellow-500"
                      onClick={handleEditProfessional}
                    >
                      Salvar
                    </button>
                  )}
                </div>
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
                  <label className="block text-sm font-semibold mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome_funcionario"
                    value={newProfessional.nome_funcionario}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={newProfessional.cpf}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newProfessional.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={newProfessional.telefone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-1">
                    Especialidade
                  </label>
                  <select
                    name="id_especialidade"
                    value={newProfessional.id_especialidade}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione uma especialidade</option>
                    {specialties.map((specialty) => (
                      <option
                        key={specialty.id_especialidade}
                        value={specialty.id_especialidade}
                      >
                        {specialty.nome_especialidade}
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
                    onClick={handleAddProfessional}
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
                  <label className="block text-sm font-semibold mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome_especialidade"
                    value={newSpecialty.nome_especialidade}
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
                    onClick={handleAddSpecialty}
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
