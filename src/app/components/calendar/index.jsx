"use client";

import React, { useEffect, useState } from "react";
import styles from "./Calendario.module.css";
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideTrash,
} from "lucide-react";
import { addEvent, deleteEvent, getEvents } from "@/service/api";
import axios from "axios";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id_aluno: "",
    id_funcionario: "",
    data_agendamento: "",
    hora_inicio: "",
    hora_fim: "",
    tipo_atendimento: "",
    cancelado: false,
    sala: "",
  });

  const fetchEvents = async () => {
    try {
      const eventData = await getEvents();
      setEvents(eventData);
      console.log("Evento atualizado", eventData);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchAlunos = async () => {
    try {
      const response = await fetch("http://localhost:3030/api/alunos", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar alunos");
      }

      const alunosData = await response.json();
      setAlunos(alunosData);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const response = await fetch("http://localhost:3030/api/funcionarios", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar funcionários");
      }

      const funcionariosData = await response.json();
      setFuncionarios(funcionariosData);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    }
  };

  const handleOpenAddModal = () => {
    fetchAlunos();
    fetchFuncionarios();
    setAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
    setNewEvent({
      id_aluno: "",
      id_funcionario: "",
      data_agendamento: "",
      hora_inicio: "",
      hora_fim: "",
      tipo_atendimento: "",
      cancelado: false,
      sala: "",
    });
  };

  const handleAddNewEvent = async () => {
    try {
      const response = await fetch("http://localhost:3030/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar agendamento");
      }

      await fetchEvents();
      handleCloseAddModal();
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      const response = await deleteEvent(id);

      if (response === 200) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id_agendamento !== id)
        );
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  const generateWeek = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = generateWeek(new Date(currentWeek));

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
  };

  // Horários do calendário
  const hours = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  return (
    <React.Fragment>
      <div className={styles.calendarToolbar}>
        <div className={styles.filters}>
          <button className={styles.filterButton} onClick={handleToday}>
            Hoje
          </button>
          {/* <button className={styles.filterButton}>Semana</button> */}
        </div>

        <button className={styles.addButton} onClick={handleOpenAddModal}>
          + Novo agendamento
        </button>
      </div>
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button onClick={handlePrevWeek}>
            <LucideChevronLeft />
          </button>
          <h2>
            Semana: {weekDays[0].toLocaleDateString()} -{" "}
            {weekDays[6].toLocaleDateString()}
          </h2>
          <button onClick={handleNextWeek}>
            <LucideChevronRight />
          </button>
        </div>
        <div className={styles.calendarHeaderLine}></div>

        <div className={styles.calendarGrid}>
          <div className={styles.timeColumnHeader}>Horário</div>
          {weekDays.map((day, index) => (
            <div key={index} className={styles.gridHeader}>
              {day.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
              })}
            </div>
          ))}
          {hours.map((hour, index) => (
            <React.Fragment key={index}>
              <div className={styles.timeColumn}>{hour}</div>
              {weekDays.map((day, dayIndex) => (
                <div key={`${index}-${dayIndex}`} className={styles.gridCell}>
                  {events
                    .filter((event) => {
                      const eventDateISO = new Date(event.data_agendamento)
                        .toISOString()
                        .split("T")[0]; // Formata a data do evento
                      const dayISO = day.toISOString().split("T")[0]; // Formata o dia atual

                      const eventStart =
                        parseInt(event.hora_inicio.split(":")[0], 10) * 60 +
                        parseInt(event.hora_inicio.split(":")[1], 10);
                      const eventEnd =
                        parseInt(event.hora_fim.split(":")[0], 10) * 60 +
                        parseInt(event.hora_fim.split(":")[1], 10);
                      const currentHour = parseInt(hour.split(":")[0], 10) * 60;

                      return (
                        eventDateISO === dayISO && // Confirma que o evento é do mesmo dia
                        eventStart < currentHour + 60 && // Começa antes do fim desta linha
                        eventEnd > currentHour // Termina depois do início desta linha
                      );
                    })
                    .map((event, eventIndex) => {
                      const startHour = parseInt(
                        event.hora_inicio.split(":")[0],
                        10
                      );
                      const startMinutes = parseInt(
                        event.hora_inicio.split(":")[1],
                        10
                      );
                      const endHour = parseInt(
                        event.hora_fim.split(":")[0],
                        10
                      );
                      const endMinutes = parseInt(
                        event.hora_fim.split(":")[1],
                        10
                      );

                      const currentStartHour = parseInt(hour.split(":")[0], 10);
                      const currentStartMinutes = parseInt(
                        hour.split(":")[1],
                        10
                      );

                      const startOffset =
                        (startHour * 60 +
                          startMinutes -
                          (currentStartHour * 60 + currentStartMinutes)) /
                        60;

                      const duration =
                        (endHour * 60 +
                          endMinutes -
                          (startHour * 60 + startMinutes)) /
                        60;

                      return (
                        <div
                          key={eventIndex}
                          className={`${styles.event} ${styles[event.color]}`}
                          style={{
                            top: `${startOffset * 100}%`,
                            height: `${duration * 100}%`,
                          }}
                          onClick={() => handleEventClick(event)}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <strong>{event.nome_aluno}</strong>
                            {event.sala} <br />
                          </div>
                          {event.nome_funcionario} ({event.nome_especialidade})
                        </div>
                      );
                    })}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      {isModalVisible && selectedEvent && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent.tipo_atendimento}</h2>
            <p>
              <strong>Aluno:</strong> {selectedEvent.nome_aluno}
            </p>
            <p>
              <strong>Profissional:</strong> {selectedEvent.nome_funcionario} (
              {selectedEvent.nome_especialidade})
            </p>
            <p>
              <strong>Sala:</strong> {selectedEvent.sala}
            </p>
            <p>
              <strong>Status:</strong> {selectedEvent.status}
            </p>
            <p>
              <strong>Horário:</strong> {selectedEvent.hora_inicio} -{" "}
              {selectedEvent.hora_fim}
            </p>
            <div className={styles.actionButtons}>
              <button onClick={handleCloseModal} className={styles.closeButton}>
                Fechar
              </button>

              <div
                className={styles.iconButton}
                title="Deletar Agendamento"
                onClick={() => {
                  if (selectedEvent && selectedEvent.id_agendamento) {
                    handleDeleteEvent(selectedEvent.id_agendamento);
                  } else {
                    console.error("ID do agendamento não encontrado!");
                  }
                }}
              >
                <LucideTrash color="red" size={20} />
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddModalVisible && (
        <div className={styles.modalOverlay} onClick={handleCloseAddModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Novo Agendamento</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddNewEvent();
              }}
            >
              <div className={styles.formGroup}>
                <label>Aluno</label>
                <select
                  value={newEvent.id_aluno}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, id_aluno: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Selecione um aluno
                  </option>
                  {alunos.map((aluno) => (
                    <option key={aluno.id_aluno} value={aluno.id_aluno}>
                      {aluno.nome_aluno}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Funcionário</label>
                <select
                  value={newEvent.id_funcionario}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, id_funcionario: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Selecione um funcionário
                  </option>
                  {funcionarios.map((funcionario) => (
                    <option
                      key={funcionario.id_funcionario}
                      value={funcionario.id_funcionario}
                    >
                      {funcionario.nome_funcionario}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Data</label>
                <input
                  type="date"
                  value={newEvent.data_agendamento}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      data_agendamento: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Hora de Início</label>
                <input
                  type="time"
                  value={newEvent.hora_inicio}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, hora_inicio: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Hora de Fim</label>
                <input
                  type="time"
                  value={newEvent.hora_fim}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, hora_fim: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tipo de Atendimento</label>
                <input
                  type="text"
                  value={newEvent.tipo_atendimento}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      tipo_atendimento: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Sala</label>
                <input
                  type="text"
                  value={newEvent.sala}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, sala: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.actionButtons}>
                <button type="submit" className={styles.addButton}>
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className={styles.closeButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
