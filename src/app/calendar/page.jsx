import React from "react";
import Layout from "../components/layout";
import Calendar from "../components/calendar";
import styles from "./CalendarPage.module.css";

export default function CalendarPage() {
  return (
    <Layout title={"Calendario"}>
      <div className={styles.calendarToolbar}>
        <div className={styles.filters}>
          <button className={styles.filterButton}>Semana</button>
          <button className={styles.filterButton}>Hoje</button>
        </div>

        <button className={styles.addButton}>+ Novo agendamento</button>
      </div>
      <Calendar />
    </Layout>
  );
}
