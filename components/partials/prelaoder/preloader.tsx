"use client";

import { useAppSelector } from "@/lib/store/hooks";
import styles from "./styles.module.scss";

const Preloader = () => {
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.headerHeight
  );
  return (
    <div
      style={{ height: `calc(100vh - ${headerHeight}px)` }}
      className="flex justify-center items-center"
    >
      <div className={styles.boxes}>
        <div className={styles.box}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.box}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.box}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.box}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
