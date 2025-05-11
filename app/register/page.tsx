'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        name,
        email,
        department,
        approved: false,
        role: "staff",
        createdAt: new Date()
      });

      alert("등록이 완료되었습니다. 관리자 승인 후 로그인 가능합니다.");
      router.push("/login");
    } catch (err: any) {
      setError("등록 중 오류가 발생했습니다. 이메일이 중복되었을 수 있습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>직원 등록</h1>
        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="text"
            placeholder="이름"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="이메일"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className={styles.select}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">부서를 선택하세요</option>
            <option value="viral">카페 바이럴</option>
            <option value="reels">릴스</option>
            <option value="review">리얼리뷰</option>
            <option value="etc">기타</option> {/* ✅ 추가됨 */}
          </select>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>등록하기</button>
        </form>
      </div>
    </div>
  );
}
