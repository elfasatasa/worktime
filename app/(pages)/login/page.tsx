"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import styles from "./Login.module.scss";

export default function LoginPage() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (status === "loading") {
    return <p>Загзурка...</p>;
  }

  return (
    <div>
      <div className={styles.title}>Страница входа</div>
      <br /><br />

      <button
        className={styles.btnAuth}
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Google
      </button>
    </div>
  );
}