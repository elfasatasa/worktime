'use client';

import { Work } from "@/app/types/work";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Show.module.scss";

export default function ShowPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userWorks, setUserWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const detailsRef = useRef<HTMLDivElement>(null);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [emptyDate, setEmptyDate] = useState<Date | null>(null);

  /* redirect */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  /* fetch works */
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

  /* Close details on click outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        setSelectedWork(null);
        setEmptyDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getWorkedHours = (work: Work) => {
    if (work.is_day_off) return 0;
    const [sh, sm] = work.start_work.split(":").map(Number);
    const [eh, em] = work.end_work.split(":").map(Number);
    let hours = eh + em / 60 - (sh + sm / 60);
    if (hours < 0) hours += 24;
    if (work.has_break) hours -= 1;
    return hours;
  };

  /* filter */
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

  /* total hours */
  const totalHours = useMemo(() => {
    if (!fromDate || !toDate) return null;
    return filteredWorks.reduce((sum, work) => {
      if (work.is_day_off) return sum;
      return sum + getWorkedHours(work);
    }, 0);
  }, [filteredWorks, fromDate, toDate]);

  /* months for calendar */
  const months = useMemo(() => {
    const map = new Map<string, Date>();
    userWorks.forEach(work => {
      const date = new Date(work.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!map.has(key)) {
        map.set(key, new Date(date.getFullYear(), date.getMonth(), 1));
      }
    });
    if (map.size === 0) {
      const now = new Date();
      map.set("current", new Date(now.getFullYear(), now.getMonth(), 1));
    }
    return Array.from(map.values()).sort(
      (a, b) => a.getTime() - b.getTime()
    );
  }, [userWorks]);

  /* day color */
  const getDayClass = (work: Work) => {
    const todayStr = new Date().toDateString();
    const workDay = new Date(work.date).toDateString();
    if (work.is_day_off) return styles.dayOff;
    if (workDay === todayStr) return styles.today;
    if (new Date(work.date) < new Date()) return styles.past;
    return styles.workDay;
  };

  /* reset filter */
  const resetFilter = () => {
    setFromDate("");
    setToDate("");
  };

  if (loading || status === "loading") {
    return <p className={styles.loading}>Загрузка...</p>;
  }

  if (!session) return null;

  return (
    <div className={styles.container}>
      <br />
      {/* FILTER */}
      <div className={styles.filter}>
        <label>
          С&nbsp;&nbsp;
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          По&nbsp;&nbsp;
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {totalHours !== null && (
          <div className={styles.total}>
            Всего часов <span>{totalHours}</span>
          </div>
        )}
        <button className={styles.resetBtn} onClick={resetFilter}>
          Сбросить
        </button>
      </div>

      {/* CALENDAR */}
      <div className={styles.calendarScroll}>
        {months.map(monthDate => {
          const year = monthDate.getFullYear();
          const month = monthDate.getMonth();

          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

          // Логика начала недели с Понедельника
          const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Вс) - 6 (Сб)
          const offset = (firstDayIndex + 6) % 7; // Пн станет 0, Вс станет 6
          const blanks = Array.from({ length: offset }, (_, i) => i);

          const title = monthDate.toLocaleString("ru", {
            month: "long",
            year: "numeric"
          });

          return (
            <div key={title} className={styles.monthBlock}>
              <h4 className={styles.monthTitle}>{title}</h4>

              <div className={styles.calendar}>
                {/* Заголовки дней недели */}
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>
                    {d}
                  </div>
                ))}

                {/* Пустые ячейки для выравнивания */}
                {blanks.map(b => (
                  <div key={`blank-${b}`} />
                ))}

                {/* Дни месяца */}
                {days.map(day => {
                  const work = userWorks.find(w => {
                    const d = new Date(w.date);
                    return (
                      d.getFullYear() === year &&
                      d.getMonth() === month &&
                      d.getDate() === day
                    );
                  });

                  return (
                    <div
                      key={day}
                      className={`${styles.day} ${work ? getDayClass(work) : ""}`}
                      onClick={() => {
                        if (work) {
                          setSelectedWork(work);
                          setEmptyDate(null);
                        } else {
                          setSelectedWork(null);
                          setEmptyDate(new Date(year, month, day));
                        }
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILS */}
      {(selectedWork || emptyDate) && (
        <div ref={detailsRef}>
          {selectedWork && (
            <div className={styles.details}>
              {selectedWork.is_day_off ? (
                <div className={styles.infoRow}>
                  <h4>{new Date(selectedWork.date).toLocaleDateString()}&nbsp;&nbsp;&nbsp;У вас выходной :)</h4>
                </div>
              ) : (
                <>
                  <div className={styles.infoRow}>
                    <span>Дата</span>
                         <span>Время работы</span>
                    <span>Тип работы</span>
                    <span>Часы</span>
                    <span>Перерыв</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>{new Date(selectedWork.date).toLocaleDateString()}</span>
                    <span>{selectedWork.start_work.slice(0, 5)} - {selectedWork.end_work.slice(0, 5)}</span>

                    <span>{selectedWork.work_type}</span>
                    <span>{getWorkedHours(selectedWork)}</span>
                    <span>{selectedWork.has_break ? "Да" : "Нет"}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {emptyDate && (
            <div className={styles.details}>
              <h3>{emptyDate.toLocaleDateString()}</h3>
              <p>На эту дату нет записи</p>
            </div>
          )}
        </div>
      )}
      <br /><br /><br /><br /><br />
    </div>
  );
}