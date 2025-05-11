'use client'

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import styles from "./Admin.module.css";

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  approved: boolean;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    const q = query(collection(db, "users"), where("approved", "==", false));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<User, "id">),
    }));
    setUsers(data);
    setLoading(false);
  };

  const approveUser = async (userId: string) => {
    await updateDoc(doc(db, "users", userId), {
      approved: true,
    });
    setUsers(users.filter((u) => u.id !== userId));
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>승인 대기 중인 직원</h1>
      {loading ? (
        <p className={styles.loading}>불러오는 중...</p>
      ) : users.length === 0 ? (
        <p className={styles.empty}>승인 대기 중인 직원이 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {users.map((user) => (
            <li key={user.id} className={styles.card}>
              <div className={styles.cardText}>
                <p className={styles.cardTitle}>
                  {user.name} ({user.email})
                </p>
                <p className={styles.cardSub}>부서: {user.department}</p>
              </div>
              <button
                onClick={() => approveUser(user.id)}
                className={styles.button}
              >
                승인
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
