import styles from "./Logotype.module.scss";
import Image from "next/image";

import logo from "@/public/images/Logotype.png";

export default function Logotype() {
  return (
    <div className={styles.logotype}>
      <Image
        src={logo}
        alt="WorkTime logo"
        width={150}
        height={54}
      />
      <a href="/profile">  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg></a>
    </div>
  );
}