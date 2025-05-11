'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/ko';

dayjs.extend(weekday);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('ko');

interface Props {
  department: string;
}

type MemoItem = {
  date: string;
  content: string;
};

export default function AttendancePage({ department }: Props) {
  const today = dayjs().format('YYYY-MM-DD');

  const [attendanceMap, setAttendanceMap] = useState<{ [date: string]: boolean }>({});
  const [remarksMap, setRemarksMap] = useState<{ [date: string]: string }>({});
  const [memoInput, setMemoInput] = useState('');
  const [memoList, setMemoList] = useState<MemoItem[]>([]);
  const [memoSaved, setMemoSaved] = useState(false);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [memoSearchFrom, setMemoSearchFrom] = useState('');
  const [memoSearchTo, setMemoSearchTo] = useState('');
  const [filteredMemoDates, setFilteredMemoDates] = useState<MemoItem[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  useEffect(() => {
    const savedAttendance = localStorage.getItem(`attendance:${department}`);
    const savedMemos = localStorage.getItem(`memo:${department}`);
    const savedRemarks = localStorage.getItem(`remarks:${department}`);

    if (savedAttendance) {
      const parsed = JSON.parse(savedAttendance);
      setAttendanceMap(parsed.attendance || {});
      setRemarksMap(parsed.remarks || {});
    }

    if (savedMemos) {
      setMemoList(JSON.parse(savedMemos));
    }

    if (savedRemarks) {
      setRemarksMap(JSON.parse(savedRemarks));
    }
  }, [department]);

  useEffect(() => {
    localStorage.setItem(
      `attendance:${department}`,
      JSON.stringify({ attendance: attendanceMap, remarks: remarksMap })
    );
    localStorage.setItem(`memo:${department}`, JSON.stringify(memoList));
    localStorage.setItem(`remarks:${department}`, JSON.stringify(remarksMap));
  }, [attendanceMap, remarksMap, memoList, department]);

  const handleCheckIn = () => {
    setAttendanceMap((prev) => ({ ...prev, [today]: true }));
  };

  const handleRemarkChange = (date: string, text: string) => {
    setRemarksMap((prev) => ({ ...prev, [date]: text }));
  };

  const handleMemoAdd = () => {
    if (!memoInput.trim()) return;

    const newMemo: MemoItem = { date: today, content: memoInput.trim() };
    const updated = [...memoList, newMemo];

    setMemoList(updated);
    setMemoInput('');
    setMemoSaved(true);
    setTimeout(() => setMemoSaved(false), 2000);
  };

  const handleMemoSearch = () => {
    if (!memoSearchFrom || !memoSearchTo) return;
    const from = dayjs(memoSearchFrom);
    const to = dayjs(memoSearchTo);

    const filtered = memoList.filter((memo) => {
      const date = dayjs(memo.date);
      return date.isSameOrAfter(from) && date.isSameOrBefore(to);
    });

    setFilteredMemoDates(filtered);
  };

  const handleSearchAttendance = () => {
    if (!fromDate || !toDate) return;

    const from = dayjs(fromDate);
    const to = dayjs(toDate);
    const results: string[] = [];

    for (let d = from; d.isSameOrBefore(to); d = d.add(1, 'day')) {
      const key = d.format('YYYY-MM-DD');
      if (attendanceMap[key]) {
        results.push(key);
      }
    }

    setSearchResults(results);
  };

  const formatDateLabel = (dateStr: string) => dayjs(dateStr).format('YYYY-MM-DD dddd');

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', color: '#fff' }}>
      {/* 왼쪽: 출근 기록 */}
      <div style={{ flex: 1 }}>
        <h2 style={{ marginBottom: '1rem' }}>📅 {department}팀 출근 기록</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>출근 조회 범위:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={handleSearchAttendance}>출근 조회</button>
        </div>

        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {(searchResults.length > 0 ? searchResults : attendanceMap[today] ? [today] : []).map((date) => (
            <li
              key={date}
              style={{
                backgroundColor: '#1e3a8a',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                color: '#bbf7d0',
                fontWeight: 500,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📅 {formatDateLabel(date)} | ✅ 출근완료</span>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => setEditingDate(editingDate === date ? null : date)}
                >
                  ✏️
                </span>
              </div>

              {editingDate === date && (
                <input
                  type="text"
                  value={remarksMap[date] || ''}
                  onChange={(e) => handleRemarkChange(date, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setEditingDate(null);
                    }
                  }}
                  placeholder="비고를 입력하세요"
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    color: '#111',
                  }}
                />
              )}

              {remarksMap[date] && editingDate !== date && (
                <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#d1fae5' }}>
                  비고: {remarksMap[date]}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽: 메모 */}
      <div style={{ flex: 1 }}>
        <h2 style={{ marginBottom: '1rem' }}>📝 메모 관리</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label>메모 조회:</label>
          <input
            type="date"
            value={memoSearchFrom}
            onChange={(e) => setMemoSearchFrom(e.target.value)}
            style={{ marginLeft: '1rem', marginRight: '1rem' }}
          />
          <input
            type="date"
            value={memoSearchTo}
            onChange={(e) => setMemoSearchTo(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={handleMemoSearch}>메모 조회</button>
        </div>

        <textarea
          value={memoInput}
          onChange={(e) => setMemoInput(e.target.value)}
          placeholder={`${today} 메모를 입력하세요`}
          rows={4}
          style={{
            width: '100%',
            marginBottom: '1rem',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#111',
          }}
        />
        <button
          onClick={handleMemoAdd}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4ade80',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ✅ 확인
        </button>

        {memoSaved && (
          <div style={{ marginTop: '1rem', color: '#86efac', fontWeight: 'bold' }}>
            메모가 저장되었습니다.
          </div>
        )}

        {/* 메모 출력 (블록 단위 + 수정 가능) */}
        <div style={{ marginTop: '2rem' }}>
          {(filteredMemoDates.length > 0 ? filteredMemoDates : memoList).map((memo, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '1.5rem',
                backgroundColor: '#111827',
                padding: '1rem',
                borderRadius: '6px',
                color: '#e0f2fe',
                position: 'relative',
              }}
            >
              <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
                📌 {dayjs(memo.date).format('YYYY-MM-DD dddd')}
              </strong>

              {editingDate === `${memo.date}-${idx}` ? (
                <>
                  <textarea
                    value={memo.content}
                    onChange={(e) => {
                      const updated = [...memoList];
                      updated[idx].content = e.target.value;
                      setMemoList(updated);
                    }}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: '1rem',
                      borderRadius: '6px',
                      backgroundColor: '#fff',
                      color: '#111',
                      resize: 'none',
                      border: '1px solid #ccc',
                    }}
                  />
                  <button
                    onClick={() => setEditingDate(null)}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.3rem 0.8rem',
                      backgroundColor: '#4ade80',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      color: '#000',
                      cursor: 'pointer',
                    }}
                  >
                    수정 완료
                  </button>
                </>
              ) : (
                <>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{memo.content}</p>
                  <button
                    onClick={() => setEditingDate(`${memo.date}-${idx}`)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'transparent',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                    }}
                    title="수정하기"
                  >
                    ✏️
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
