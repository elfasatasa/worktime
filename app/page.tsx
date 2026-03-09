"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <p>Привет {session.user?.name}</p>
        <button onClick={() => signOut()}>Выйти</button>
      </>
    )
  }

  return (
    <>
      <button onClick={() => signIn("google")}>
        Войти через Google
      </button>
    </>
  )
}