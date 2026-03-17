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
      
      .catch(err => {
        console.error("Error:", err)
      })
  }, [session])

  return (
    <div>
<br />
<br />
      Есть новые идеи или нужно помощь? Пиши в телеграм <a href="https://t.me/elfasatasa" target="_blank">@elfasatasa </a>
    </div>
  )
}