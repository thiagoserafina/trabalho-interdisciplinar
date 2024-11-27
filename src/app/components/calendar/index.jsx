"use client";

import React, { useState } from "react";
import styles from "./Calendario.module.css";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

export default function Calendario() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const generateWeek = (date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
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
    const prevWeek = new Date(currentWeek.setDate(currentWeek.getDate() - 7));
    setCurrentWeek(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek.setDate(currentWeek.getDate() + 7));
    setCurrentWeek(nextWeek);
  };

  const handleToday = () => {
    setCurrentWeek(new Date()); // Redefine para a semana do dia atual
  };

  const events = [
    {
      date: "2024-10-14",
      startTime: "07:00",
      endTime: "07:30",
      title: "Pedagogo 03",
      status: "Atrasado",
      student: "Joice Pereira",
      color: "red",
    },
    {
      date: "2024-10-15",
      startTime: "08:00",
      endTime: "08:30",
      title: "Fono 02",
      status: "Concluído",
      student: "Ruan Silva",
      color: "yellow",
    },
    {
      date: "2024-10-17",
      startTime: "07:30",
      endTime: "08:00",
      title: "Fisio 03",
      status: "Em Atendimento",
      student: "Joice Pereira",
      color: "green",
    },
  ];

  const hours = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
  ];

  const getEventsForDayAndTime = (day, time) => {
    return events.filter(
      (event) =>
        event.date === day.toISOString().split("T")[0] &&
        event.startTime === time
    );
  };

  return (
    <React.Fragment>
      <div className={styles.calendarToolbar}>
        <div className={styles.filters}>
          <button className={styles.filterButton}>Semana</button>
          <button className={styles.filterButton} onClick={handleToday}>
            Hoje
          </button>
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
          <div className={styles.timeColumn}>Horário</div>
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
                  {getEventsForDayAndTime(day, hour).map(
                    (event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`${styles.event} ${styles[event.color]}`}
                      >
                        <strong>{event.title}</strong> <br />
                        {event.status} <br />
                        {event.student}
                      </div>
                    )
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
