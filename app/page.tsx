"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default function Home() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.email) return

    // Берем email из сессии
    const email = session.user.email


    // Отправляем POST-запрос на API route
    fetch("/api/work/clean_works", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Server response:", data)
      })
      .catch(err => {
        console.error("Error:", err)
      })
  }, [session])

  return (
    <>
      <h1>Main Page</h1>
      {session?.user?.email && <p>Logged in as: {session.user.email}</p>}
    </>
  )
}