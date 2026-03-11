"use client";
import { signIn } from "next-auth/react";

import styles from "./Login.module.scss"


export default function LoginPage() {


  return (
    <div>
      <div className={styles.title}>Страница входа</div>
      <br /><br />
      <button className={styles.btnAuth} onClick={() => signIn("google")}>Google Sign in</button>
    </div>
  );
}