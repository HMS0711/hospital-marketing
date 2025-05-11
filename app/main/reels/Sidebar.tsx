'use client'

import { useState } from 'react';
import styles from './Reels.module.css';
import { generateInitialSteps, Step } from './stepData';
import { useRouter } from 'next/navigation';

type Vendor = {
  name: string;
  steps: Step[];
};

interface SidebarProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  selectedVendor: Vendor | null;
  setSelectedVendor: React.Dispatch<React.SetStateAction<Vendor | null>>;
}

export default function Sidebar({
  vendors,
  setVendors,
  selectedVendor,
  setSelectedVendor,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [newVendor, setNewVendor] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleAddVendor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newVendor.trim()) {
      const newVendorObj: Vendor = {
        name: newVendor.trim(),
        steps: generateInitialSteps(),
      };
      setVendors((prev) => [...prev, newVendorObj]);
      setNewVendor('');
      setShowInput(false);
    }
  };

  const handleDeleteVendor = () => {
    if (!vendorToDelete) return;
    setVendors((prev) => prev.filter((v) => v.name !== vendorToDelete));
    if (selectedVendor?.name === vendorToDelete) {
      setSelectedVendor(null);
    }
    setVendorToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>🎬 릴스</h2>
      <ul className={styles.menu}>
        <li className={styles.expandable}>
          <div className={styles.menuHeader}>
            <span
              onClick={() => setIsExpanded((prev) => !prev)}
              className={styles.clickable}
            >
              진행중인 업체
            </span>
            <button
              onClick={() => setShowInput((prev) => !prev)}
              className={styles.plusBtn}
            >
              ＋
            </button>
          </div>

          {showInput && (
            <input
              type="text"
              className={styles.input}
              value={newVendor}
              onChange={(e) => setNewVendor(e.target.value)}
              onKeyDown={handleAddVendor}
              placeholder="업체명을 입력하세요"
              autoFocus
            />
          )}

          {isExpanded && (
            <ul className={styles.subMenu}>
              {vendors.map((vendor, idx) => (
                <li
                  key={vendor.name}
                  className={styles.vendorItem}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedVendor(vendor)}
                  style={{
                    backgroundColor:
                      selectedVendor?.name === vendor.name ? '#2a2a2a' : undefined,
                  }}
                >
                  {vendor.name}
                  {hoveredIndex === idx && (
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setVendorToDelete(vendor.name);
                        setShowDeleteModal(true);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>

        <li>종료된 업체</li>
        {/* 릴스 대학 및 목표 항목 완전 제거됨 */}
      </ul>

      {/* 고정 기능 (항상 표시) */}
      <hr className={styles.divider} />
      <ul className={styles.menu}>
        <li className={styles.menuItem} onClick={() => router.push('/main/attendance')}>📝 출석</li>
        <li className={styles.menuItem} onClick={() => router.push('/main/goals')}>🎯 목표</li>
        <li className={styles.menuItem} onClick={() => router.push('/main/meeting')}>🗓️ 회의</li>
      </ul>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>해당 업체를 정말 삭제하시겠습니까?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleDeleteVendor} className={styles.modalYes}>
                예
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.modalNo}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
