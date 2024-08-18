"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const MainWrapper = ({ children, className }: Props) => {
  const [mounted, setMounted] = useState(false);
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.headerHeight
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <div
      className={className}
      style={{ height: `calc(100vh - ${headerHeight}px)` }}
    >
      {children}
    </div>
  );
};

export default MainWrapper;
