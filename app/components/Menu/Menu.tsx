"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Menu.module.scss";

export default function Menu() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Show", path: "/show", icon: "📊" },
    { name: "Edit", path: "/edit", icon: "✏️" },
  ];

  return (
    <nav className={styles.menu}>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${styles.menuItem} ${
            pathname === item.path ? styles.active : ""
          }`}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.text}>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}