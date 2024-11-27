"use client";

import React, { useState } from "react";
import styles from "./Calendario.module.css";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

export default function Calendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalVisible(false);
  };

  // Gera os dias da semana com base na data fornecida
  const generateWeek = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay(); // Dia da semana (0 = Domingo)
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Ajusta para o início da semana
    startOfWeek.setHours(0, 0, 0, 0); // Remove a hora para evitar discrepâncias
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

  const events = [
    {
      tipo_atendimento: "Fisioterapia",
      alunoNome: "Joice Pereira",
      funcionarioNome: "Ana Silva",
      especialidade: "Fisioterapeuta",
      sala: "Sala 01",
      date: "2024-11-25",
      startTime: "07:00",
      endTime: "08:00",
      status: "Atrasado",
      color: "red",
    },
    {
      tipo_atendimento: "Fonoaudiologia",
      alunoNome: "Ruan Silva",
      funcionarioNome: "Maria Souza",
      especialidade: "Fonoaudióloga",
      sala: "Sala 02",
      date: "2024-11-26",
      startTime: "09:00",
      endTime: "09:30",
      status: "Concluído",
      color: "yellow",
    },
    {
      tipo_atendimento: "Fisioterapia",
      alunoNome: "Bruno Costa",
      funcionarioNome: "Ana Silva",
      especialidade: "Fisioterapeuta",
      sala: "Sala 01",
      date: "2024-11-28",
      startTime: "10:00",
      endTime: "10:30",
      status: "Em atendimento",
      color: "green",
    },
    {
      tipo_atendimento: "Fisioterapia",
      alunoNome: "Bruno Costa",
      funcionarioNome: "Ana Silva",
      especialidade: "Fisioterapeuta",
      sala: "Sala 01",
      date: "2024-11-28",
      startTime: "10:30",
      endTime: "11:00",
      status: "Em atendimento",
      color: "green",
    },
  ];

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
          <button className={styles.filterButton}>Semana</button>
        </div>

        <button className={styles.addButton}>+ Novo agendamento</button>
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
                    .filter(
                      (event) => event.date === day.toISOString().split("T")[0]
                    )
                    .map((event, eventIndex) => {
                      const [startHour, startMinutes] = event.startTime
                        .split(":")
                        .map(Number);
                      const [endHour, endMinutes] = event.endTime
                        .split(":")
                        .map(Number);
                      const [cellHour, cellMinutes] = hour
                        .split(":")
                        .map(Number);

                      // Cálculo da posição inicial (top) e altura (height) do evento
                      const eventStartInMinutes = startHour * 60 + startMinutes;
                      const eventEndInMinutes = endHour * 60 + endMinutes;
                      const cellStartInMinutes = cellHour * 60 + cellMinutes;
                      const cellEndInMinutes = cellStartInMinutes + 60;

                      // Verifica se o evento aparece nesta célula (interseção de horários)
                      if (
                        eventStartInMinutes < cellEndInMinutes &&
                        eventEndInMinutes > cellStartInMinutes
                      ) {
                        const top =
                          ((Math.max(eventStartInMinutes, cellStartInMinutes) -
                            cellStartInMinutes) /
                            60) *
                          100;
                        const height =
                          ((Math.min(eventEndInMinutes, cellEndInMinutes) -
                            Math.max(eventStartInMinutes, cellStartInMinutes)) /
                            60) *
                          100;

                        return (
                          <div
                            key={eventIndex}
                            className={`${styles.event} ${styles[event.color]}`}
                            style={{
                              top: `${top}%`,
                              height: `${height}%`,
                              position: "absolute",
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <strong>{event.alunoNome}</strong>
                              {event.sala} <br />
                            </div>
                            {event.funcionarioNome} ({event.especialidade})
                          </div>
                        );
                      }
                      return null;
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
              <strong>Aluno:</strong> {selectedEvent.alunoNome}
            </p>
            <p>
              <strong>Profissional:</strong> {selectedEvent.funcionarioNome} (
              {selectedEvent.especialidade})
            </p>
            <p>
              <strong>Sala:</strong> {selectedEvent.sala}
            </p>
            <p>
              <strong>Status:</strong> {selectedEvent.status}
            </p>
            <p>
              <strong>Horário:</strong> {selectedEvent.startTime} -{" "}
              {selectedEvent.endTime}
            </p>
            <button onClick={handleCloseModal} className={styles.closeButton}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
