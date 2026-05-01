"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Home() {
  const { data: session } = useSession()
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!session?.user?.email) return

    const email = session.user.email

    fetch("/api/work/clean_works", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).catch(err => {
      console.error("Error:", err)
    })
  }, [session])

  useEffect(() => {
    const messages: Record<number, string[]> = {
      0: [
        "Подготовься так, чтобы завтра было легче, чем у всех.",
        "Воскресенье — это старт перед рывком.",
      ],
      1: [
        "Начни так, будто от этого дня зависит вся твоя жизнь.",
        "Понедельник — это шанс стать лучше, чем ты был.",
      ],
      2: [
        "Ты уже начал — теперь не смей останавливаться.",
        "Дисциплина важнее мотивации.",
      ],
      3: [
        "Середина пути — здесь ломаются слабые и растут сильные.",
        "Не сдавайся, ты уже далеко зашёл.",
      ],
      4: [
        "Ты ближе, чем думаешь. Дожми.",
        "Сейчас решается, будешь ли ты горд собой.",
      ],
      5: [
        "Пока другие отдыхают — ты можешь вырваться вперёд.",
        "Сделай сегодня то, что другие откладывают.",
      ],
      6: [
        "Настоящие результаты делаются, когда никто не смотрит.",
        "Суббота — день для тех, кто хочет больше.",
      ],
    }

    const today = new Date().getDay()
    const randomIndex = Math.floor(Math.random() * messages[today].length)

    setMessage(messages[today][randomIndex])
  }, [])

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 className="fadeIn">{message}</h1>

      <br />
      <br />

      Есть новые идеи или нужно помощь? Пиши в телеграм{" "}
      <a href="https://t.me/elfasatasa" target="_blank">
        @elfasatasa
      </a>

      <style jsx>{`
        .fadeIn {
          animation: fadeIn 1.2s ease-in-out;
          font-size: 22px;
          font-weight: bold;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}