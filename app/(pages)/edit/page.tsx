'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function EditPage() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Загрузка...</p>;
  }

  if (!session) {
    return null;
  }
  return (
    <div>
      <h3>Страница редактирования</h3>
      {/* Здесь можно добавить форму для редактирования, кнопки сохранения и т.д. */}
    </div>
  );
}