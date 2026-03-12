"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./Login.module.scss";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // После появления сессии делаем запрос на создание профиля
  useEffect(() => {
    if (session?.user?.email && session?.user?.name) {
      fetch("/api/profile/create-new-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
        }),
      }).finally(() => router.push("/")); // редирект
    }
  }, [session, router]);

  if (status === "loading") return <p>Загрузка...</p>;

  const handleGoogleSignIn = () => {
    signIn("google"); // redirect происходит автоматически
  };

  return (
    <div>
      <div className={styles.title}>Страница входа</div>
      <br /><br />
      <button className={styles.btnAuth} onClick={handleGoogleSignIn}>
        Google
      </button>
    </div>
  );
}