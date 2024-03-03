"use client";

import { useAppSelector } from "@/lib/store/hooks";
import styles from "./styles.module.scss";

const Preloader = () => {
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.value.headerHeight
  );
  return;
};

export default Preloader;
