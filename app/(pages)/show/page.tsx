'use client';

import { Work } from "@/app/types/work";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./Show.module.scss";

export default function ShowPage() {

  const { data: session, status } = useSession();
  const router = useRouter();

  const [userWorks, setUserWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [emptyDate, setEmptyDate] = useState<Date | null>(null);

  /* редирект */

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  /* загрузка работ */

  useEffect(() => {

    if (status === "authenticated" && session?.user?.email) {
      fetchWorks();
    }

  }, [status, session?.user?.email]);

  const fetchWorks = async () => {

    try {

      const res = await fetch(
        `/api/work/get_user_works?email=${encodeURIComponent(session!.user!.email!)}`
      );

      const data = await res.json();

      if (data.success) {
        setUserWorks(data.works);
      }

    } catch (error) {
      console.error(error);
    }

    setLoading(false);

  };

  /* подсчет часов */

  const getWorkedHours = (work: Work) => {

    if (work.is_day_off) return 0;

    const [sh, sm] = work.start_work.split(":").map(Number);
    const [eh, em] = work.end_work.split(":").map(Number);

    let hours = eh + em / 60 - (sh + sm / 60);

    if (hours < 0) hours += 24;

    if (work.has_break) hours -= 1;

    return hours;
  };

  /* фильтр */

  const filteredWorks = useMemo(() => {

    if (!fromDate || !toDate) return [];

    const start = new Date(fromDate);
    const end = new Date(toDate);

    end.setHours(23, 59, 59, 999);

    return userWorks.filter(work => {

      const date = new Date(work.date);

      return date >= start && date <= end;

    });

  }, [userWorks, fromDate, toDate]);

  /* итог часов */

  const totalHours = useMemo(() => {

    if (!fromDate || !toDate) return null;

    return filteredWorks.reduce((sum, work) => {

      if (work.is_day_off) return sum;

      return sum + getWorkedHours(work);

    }, 0);

  }, [filteredWorks, fromDate, toDate]);

  /* календарь */

  const today = new Date();

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  /* цвет дня */

  const getDayClass = (work: Work) => {

    const todayStr = new Date().toDateString();
    const workDay = new Date(work.date).toDateString();

    if (work.is_day_off) return styles.dayOff;
    if (workDay === todayStr) return styles.today;
    if (new Date(work.date) < new Date()) return styles.past;

    return styles.workDay;

  };

  /* сброс фильтра */

  const resetFilter = () => {

    setFromDate("");
    setToDate("");

  };

  /* loading */

  if (loading || status === "loading") {
    return <p className={styles.loading}>Загрузка...</p>;
  }

  if (!session) return null;

  return (

    <div className={styles.container}>
<br />
      <div className={styles.filter}>

        <div className={styles.inputs}>

          <label>
            С &nbsp;&nbsp;
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>
<br />
<br />
          <label>
            По&nbsp;&nbsp;
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>

        </div>

        <button
          className={styles.resetBtn}
          onClick={resetFilter}
        >
          Сбросить
        </button>

        {totalHours !== null && (
          <div className={styles.total}>
            Всего часов: <span>{totalHours}</span>
          </div>
        )}

      </div>

      {/* календарь */}

      <div className={styles.calendar}>

        {days.map(day => {

          const work = userWorks.find(
            w => new Date(w.date).getDate() === day
          );

          const colorClass = work ? getDayClass(work) : "";

          return (

            <div
              key={day}
              className={`${styles.day} ${colorClass}`}
              onClick={() => {

                if (work) {

                  setSelectedWork(work);
                  setEmptyDate(null);

                } else {

                  setSelectedWork(null);

                  setEmptyDate(
                    new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      day
                    )
                  );

                }

              }}
            >

              {day}

            </div>

          );

        })}

      </div>

      {/* если есть запись */}

      {selectedWork && (

        <div className={styles.details}>

          <h3>Детали работы</h3>

          <p>
            <strong>Дата:</strong>{" "}
            {new Date(selectedWork.date).toLocaleDateString()}
          </p>

          <p>
            <strong>Тип работы:</strong> {selectedWork.work_type}
          </p>

          <p>
            <strong>Часы:</strong>{" "}
            {selectedWork.is_day_off
              ? "Выходной"
              : getWorkedHours(selectedWork)}
          </p>

          <p>
            <strong>Обед:</strong>{" "}
            {selectedWork.is_day_off
              ? "-"
              : selectedWork.has_break
                ? "Есть"
                : "Нет"}
          </p>

        </div>

      )}

      {/* если нет записи */}

      {emptyDate && (

        <div className={styles.details}>

          <h3>{emptyDate.toLocaleDateString()}</h3>

          <p>
            Вы пока ничего не добавили на эту дату
          </p>

        </div>

      )}

    </div>

  );

}