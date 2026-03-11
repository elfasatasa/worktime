'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ShowPage() {
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
      <h3>Show Page</h3>
      <p>This is the show page.</p>
    </div>
  );
}