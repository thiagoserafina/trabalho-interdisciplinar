import React from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import { LucideCalendar, LucideSettings, LucideUser } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Image
          src={"/images/apae-logo.png"}
          width={45}
          height={45}
          alt="APAE"
        />
      </div>
      <nav className={styles.nav}>
        <Link href="/calendar" passHref>
          <LucideCalendar />
        </Link>
        <Link href="/students" passHref>
          <LucideUser />
        </Link>
        <Link href="/settings" passHref>
          <LucideSettings />
        </Link>
      </nav>
    </div>
  );
}
