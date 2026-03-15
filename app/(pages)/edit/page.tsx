'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./Edit.module.scss";
import { Work } from "@/app/types/work";

export default function EditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [works, setWorks] = useState<Work[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newDate, setNewDate] = useState("");
  const [startWork, setStartWork] = useState("09:00");
  const [endWork, setEndWork] = useState("18:00");
  const [hasBreak, setHasBreak] = useState(false);
  const [isDayOff, setIsDayOff] = useState(false);
  const [workType, setWorkType] = useState("packer");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");

    if (status === "authenticated") {
      fetchWorks();
    }
  }, [status, router, session?.user?.email]);

  const fetchWorks = async () => {
    if (!session?.user?.email) return;

    try {
      const res = await fetch(`/api/work/get_user_works?email=${session.user.email}`);
      const data = await res.json();
      if (data.success) setWorks(data.works);
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading") return <p>Загрузка...</p>;

  const filteredWorks = works
    .filter((work) =>
      `${work.date} ${work.start_work} ${work.end_work}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleEditClick = (work: Work) => {
    setEditingWork(work);

    setNewDate(work.date.slice(0, 10));
    setStartWork(work.start_work.slice(0, 5));
    setEndWork(work.end_work.slice(0, 5));
    setHasBreak(work.has_break);
    setIsDayOff(work.is_day_off);
    setWorkType(work.work_type);

    setIsModalOpen(true);
  };

  const handleSaveWork = async () => {
    if (!newDate || isSaving) return;

    setIsSaving(true);

    try {
      const url = editingWork
        ? "/api/work/edit_work"
        : "/api/work/add_work";

      const body = editingWork
        ? {
            email: session?.user?.email,
            work_id: editingWork.work_id,
            date: newDate,
            start_work: startWork,
            end_work: endWork,
            has_break: hasBreak,
            is_day_off: isDayOff,
            work_type: workType
          }
        : {
            email: session?.user?.email,
            date: newDate,
            start_work: startWork,
            end_work: endWork,
            has_break: hasBreak,
            is_day_off: isDayOff,
            work_type: workType
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (data.success || data) {
        await fetchWorks();

        setIsModalOpen(false);
        setEditingWork(null);

        setSuccessMessage(
          editingWork
            ? "Смена обновлена"
            : "Смена добавлена"
        );

        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => setIsSaving(false), 2000);
  };

  const handleDeleteWork = async () => {
    if (!editingWork || isDeleting) return;

    const confirmDelete = confirm("Удалить эту смену?");
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      const res = await fetch("/api/work/delete_work", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: session?.user?.email,
          work_id: editingWork.work_id
        })
      });

      const data = await res.json();

      if (data.success) {
        await fetchWorks();

        setIsModalOpen(false);
        setEditingWork(null);

        setSuccessMessage("Смена удалена");

        setTimeout(() => setSuccessMessage(""), 2000);
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => setIsDeleting(false), 1500);
  };

  const openAddModal = () => {
    setEditingWork(null);
    setNewDate("");
    setStartWork("09:00");
    setEndWork("18:00");
    setHasBreak(false);
    setIsDayOff(false);
    setWorkType("packer");
    setIsModalOpen(true);
  };

  return (
    <div className={styles.container}>
      {successMessage && (
        <div className={styles.success}>{successMessage}</div>
      )}

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
          <div key={work.work_id} className={styles.row}>
            <span>{work.date.slice(0, 10)}</span>

            {work.is_day_off ? (
              <>
                <span>-</span>
                <span className={styles.dayOff}>Выходной</span>
                <span>-</span>
              </>
            ) : (
              <>
                <span>{work.work_type}</span>
                <span>
                  {work.start_work.slice(0, 5)} | {work.end_work.slice(0, 5)}
                </span>
                <span>{work.has_break ? "+" : "-"}</span>
              </>
            )}

            <button
              className={styles.edit}
              onClick={() => handleEditClick(work)}
            >
              ✏️
            </button>
          </div>
        ))}
      </div>

      <div className={styles.add}>
        <button
          className={styles.addWork}
          onClick={openAddModal}
        >
          Добавить
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>
              {editingWork
                ? "Редактировать смену"
                : "Добавить смену"}
            </h3>

            <div style={{ margin: "10px 0" }}>
              <label>Дата: </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            {!isDayOff && (
              <>
                <div style={{ margin: "10px 0" }}>
                  <label>Время от: </label>
                  <input
                    type="time"
                    value={startWork}
                    onChange={(e) => setStartWork(e.target.value)}
                  />
                </div>

                <div style={{ margin: "10px 0" }}>
                  <label>Время до: </label>
                  <input
                    type="time"
                    value={endWork}
                    onChange={(e) => setEndWork(e.target.value)}
                  />
                </div>

                <div style={{ margin: "10px 0", display: "flex", gap: "6px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={hasBreak}
                      onChange={(e) => setHasBreak(e.target.checked)}
                    />
                    Обед
                  </label>
                </div>

                <div style={{ margin: "10px 0" }}>
                  <label>Тип работы: </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                  >
                    <option value="пакер">Пакер</option>
                    <option value="презентер">Презентер</option>
                    <option value="кассир">Кассир</option>
                    <option value="мойщик">Мойщик</option>
                    <option value="повар">Повар</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ margin: "10px 0", display: "flex", gap: "6px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={isDayOff}
                  onChange={(e) => setIsDayOff(e.target.checked)}
                />
                Выходной
              </label>
            </div>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button onClick={handleSaveWork} disabled={isSaving}>
                {isSaving
                  ? "Сохранение..."
                  : editingWork
                  ? "Обновить"
                  : "Сохранить"}
              </button>

              {editingWork && (
                <button
                  onClick={handleDeleteWork}
                  disabled={isDeleting}
                  style={{ background: "#ff4d4f", color: "white" }}
                >
                  {isDeleting ? "Удаление..." : "Удалить"}
                </button>
              )}

              <button onClick={() => setIsModalOpen(false)}>
                Отмена
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}