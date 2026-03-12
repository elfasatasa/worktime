'use client';

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workStatus, setWorkStatus] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Перенаправление если не авторизован
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Получаем профиль
  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/profile/get-own-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setWorkStatus(data.profile.work_status);
          }
        });
    }
  }, [session]);

  if (status === "loading") return <p>Загрузка...</p>;
  if (!session) return null;

  const handleSignOut = () => {
    if (confirm("Вы точно хотите выйти?")) signOut();
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!session?.user?.email) return;

    // Получаем work_id
    const profileRes = await fetch("/api/profile/get-own-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email }),
    });
    const profileData = await profileRes.json();
    const work_id = profileData.profile.work_id;

    // Отправляем обновление статуса
    const res = await fetch("/api/profile/edit-work-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ work_id, newStatus }),
    });
    const updated = await res.json();
    if (updated.success) {
      setWorkStatus(updated.profile.work_status);
      setModalOpen(false);
    } else {
      alert("Ошибка обновления статуса");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {session.user?.image && (
        <Image
          src={session.user.image}
          alt="Profile"
          width={100}
          height={100}
        />
      )}

      <h2>{session.user?.name}</h2>
      <p>{session.user?.email}</p>

      {workStatus && (
        <p style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
          Ваш статус: {workStatus}{" "}
          <span 
            style={{ cursor: "pointer", color: "white" }} 
            onClick={() => setModalOpen(true)}
            title="Edit work status"
          >
            <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M12 20h9" />
  <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
</svg>
          </span>
        </p>
      )}

      <button onClick={handleSignOut} style={{ marginTop: "20px" }}>
        Выйти
      </button>

      {/* Модальное окно */}
      {modalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#000",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px",
            textAlign: "center"
          }}>
            <h3>Выберите новый статус</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["Starter", "Instructor", "Universal", "Trainer"].map(statusOption => (
                <li key={statusOption} style={{ margin: "10px 0" }}>
                  <button 
                  
                    onClick={() => handleStatusChange(statusOption)}
                    style={{ padding: "8px 16px", cursor: "pointer" , backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "4px"}}
                  >
                    {statusOption}
                  </button>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setModalOpen(false)}
              style={{ marginTop: "10px", cursor: "pointer" }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}