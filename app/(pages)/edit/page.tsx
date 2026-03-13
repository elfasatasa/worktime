'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./Edit.module.scss";
import { Work } from "@/app/types/work";
import { works as workss } from "@/app/types/data";

export default function EditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [works, setWorks] = useState<Work[]>(workss);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Новая смена
  const [newDate, setNewDate] = useState("");
  const [startWork, setStartWork] = useState("09:00");
  const [endWork, setEndWork] = useState("18:00");
  const [hasBreak, setHasBreak] = useState(false);
  const [isDayOff, setIsDayOff] = useState(false);
  const [workType, setWorkType] = useState("packer");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <p>Загрузка...</p>;

  const filteredWorks = works
    .filter((work) =>
      `${work.date} ${work.start_work} ${work.end_work}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleAddWork = async () => {
    if (!newDate) return;

    const res = await fetch("/api/work/add_work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session?.user?.email,
        date: newDate,
        start_work: startWork,
        end_work: endWork,
        has_break: hasBreak,
        is_day_off: isDayOff,
        work_type: workType
      })
    });

    const data = await res.json();
    setWorks([data, ...works]);
    setIsModalOpen(false);
    setNewDate("");
    setStartWork("09:00");
    setEndWork("18:00");
    setHasBreak(false);
    setIsDayOff(false);
    setWorkType("packer");
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.search}
        type="text"
        placeholder="Поиск (03-10, 10:00)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.infoData}>
        <span>Дата</span>
        <span>Тип</span>
        <span>Время</span>
        <span>Обед</span>
        <span></span>
      </div>

      <div className={styles.works}>
        {filteredWorks.map((work) => (
      <div key={`${work.work_id}-${work.date}`} className={styles.row}>
            <span>{work.date}</span>
            {work.is_day_off ? (
              <>
                <span>-</span>
                <span className={styles.dayOff}>Выходной</span>
                <span>-</span>
              </>
            ) : (
              <>
                <span>{work.work_type}</span>
                <span>{work.start_work} | {work.end_work}</span>
                <span>{work.has_break ? "+" : "-"}</span>
              </>
            )}
            <button className={styles.edit}>✏️</button>
          </div>
        ))}
      </div>

      <div className={styles.add}>
        <button className={styles.addWork} onClick={() => setIsModalOpen(true)}>
          Добавить
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Добавить смену</h3>
            <div style={{ margin: "10px 0" }}>
              <label>Дата: </label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>

            {!isDayOff && (
              <>
                <div style={{ margin: "10px 0" }}>
                  <label>Время от: </label>
                  <input type="time" value={startWork} onChange={(e) => setStartWork(e.target.value)} />
                </div>

                <div style={{ margin: "10px 0" }}>
                  <label>Время до: </label>
                  <input type="time" value={endWork} onChange={(e) => setEndWork(e.target.value)} />
                </div>

                <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                  <label>
                    <input type="checkbox" checked={hasBreak} onChange={(e) => setHasBreak(e.target.checked)} />
                    Обед
                  </label>
                </div>

                <div style={{ margin: "10px 0" }}>
                  <label>Тип работы: </label>
                  <select value={workType} onChange={(e) => setWorkType(e.target.value)}>
                    <option value="packer">Packer</option>
                    <option value="presenter">Presenter</option>
                    <option value="кассир">Кассир</option>
                    <option value="мойщик">Мойщик</option>
                    <option value="повар">Повар</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
              <label>
                <input type="checkbox" checked={isDayOff} onChange={(e) => setIsDayOff(e.target.checked)} />
                Выходной
              </label>
            </div>

            <div style={{ marginTop: "10px" }}>
              <button onClick={handleAddWork}>Сохранить</button>
              <button onClick={() => setIsModalOpen(false)} style={{ marginLeft: "10px"}}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
