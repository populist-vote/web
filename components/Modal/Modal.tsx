// src/components/Modal/Modal.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match the duration of the animation
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => setIsVisible(true), 10); // Delay to allow animation
    } else {
      setIsVisible(false);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, handleClose]);

  if (!isOpen && !isVisible) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className={`${styles.overlay} ${isVisible ? styles.open : styles.close}`}
        tabIndex={-1}
        role="dialog"
      ></div>
      <div
        className={`${styles.modal} ${isVisible ? styles.open : styles.close}`}
        ref={modalRef}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </>,
    document.getElementById("modal-root") as HTMLElement
  );
}
