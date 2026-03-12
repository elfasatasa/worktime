'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./Edit.module.scss";
import { exampleWorks } from "@/lib/data";

type Work = {
  id: number;
  date: string;
  start_work: string;
  end_work: string;
  has_break: boolean;
  is_day_off: boolean;
};

export default function EditPage() {

  const { data: session, status } = useSession();
  const router = useRouter();

  const [search, setSearch] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);

  const [editWork, setEditWork] = useState<Work | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Загрузка...</p>;
  if (!session) return null;

  // сортировка
  const sortedWorks: Work[] = [...exampleWorks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // поиск
  const filteredWorks = sortedWorks.filter((work) => {
    const [, month, day] = work.date.split("-");
    const shortDate = `${month}-${day}`;

    return (
      shortDate.includes(search) ||
      month.includes(search) ||
      day.includes(search) ||
      work.start_work.includes(search) ||
      work.end_work.includes(search)
    );
  });

  const worksToShow: Work[] = search ? filteredWorks : sortedWorks;

  return (
    <div className={styles.container}>

      <br />

      <input
        type="text"
        placeholder="Поиск (03, 03-11, 09:00)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      <div className={styles.info}>
        <span>Дата</span>
        <span></span>
        <span>Время</span>
        <span>Обед</span>
        <span></span>
      </div>

      {/* список */}
      <div className={styles.list}>

        {worksToShow.map((work: Work) => (
          <div className={styles.work} key={work.id}>

            {work.is_day_off ? (
              <>
                <span className={styles.date}>{work.date}</span>
                <span className={styles.dayoff}>Выходной</span>

                <span>
                  <button onClick={() => setEditWork(work)}>e</button>

              
                </span>
              </>
            ) : (
              <>
                <span className={styles.date}>{work.date}</span>
                <span>{work.start_work} | {work.end_work}</span>
                <span>{work.has_break ? "+" : "-"}</span>

                <span>
                  <button onClick={() => setEditWork(work)}>e</button>

              
                </span>
              </>
            )}

          </div>
        ))}

      </div>

      <br />

      <button onClick={() => setShowModal(true)}>Добавить</button>

      {/* ADD MODAL */}

      {showModal && (
        <div className={styles.modalBg}>
          <div className={styles.modal}>

            <h3>Добавить смену</h3>

            <input type="date" />

            <input type="time" />

            <input type="time" />

            <label>
              <input type="checkbox" />
              &nbsp; Обед
            </label>

            <label>
              <input type="checkbox" />
              &nbsp; Выходной
            </label>

            <br />

            <button>Сохранить</button>

            <button onClick={() => setShowModal(false)}>
              Закрыть
            </button>

          </div>
        </div>
      )}

   

      {/* EDIT MODAL */}

{editWork && (
  <div className={styles.modalBg}>
    <div className={styles.modal}>

      <h3>Редактировать смену</h3>

      <input
        type="date"
        defaultValue={editWork.date}
      />

      {!editWork.is_day_off && (
        <>
        От
          <input
            type="time"
            defaultValue={editWork.start_work}
          />
      До
          <input
            type="time"
            defaultValue={editWork.end_work}
          />
        </>
      )}

      <label>
        <input
          type="checkbox"
          defaultChecked={editWork.has_break}
        />
        &nbsp; Обед
      </label>

      <label>
        <input
          type="checkbox"
          defaultChecked={editWork.is_day_off}
        />
        &nbsp; Выходной
      </label>

      <br />

      <div className={styles.btnEdit} style={{display:"flex", flexDirection:"column", gap:"14px"}}>

        <button>
          Сохранить
        </button>

        <button
          onClick={() => {
            if(confirm("Удалить эту смену?")) {
              console.log("delete", editWork.id)
              setEditWork(null)
            }
          }}
        >
          Удалить
        </button>

        <button onClick={() => setEditWork(null)}>
          Закрыть
        </button>

      </div>

    </div>
  </div>
)}
    </div>
  );
}