'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

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

    </div>
  );
}