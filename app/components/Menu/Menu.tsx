"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import styles from "./Menu.module.scss";

export default function Menu() {
  const pathname = usePathname();

  const menuItems = [
    {
      path: "/",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5L12 3l9 7.5"></path>
          <path d="M5 10v10h14V10"></path>
        </svg>
      ),
    },
    {
      path: "/show",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
    },
    {
      path: "/edit",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z"></path>
        </svg>
      ),
    },
  ];

  return (
    <nav className={styles.menu}>
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link key={item.path} href={item.path} className={styles.menuItem}>
            {React.cloneElement(item.icon, {
              stroke: isActive ? "#9A19E5" : "#ffffff",
            })}
          </Link>
        );
      })}
    </nav>
  );
}