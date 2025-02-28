"use client";
import Loading from "@/app/[locale]/loading";
import { useAppSelector } from "@/lib/store/hooks";
import { Suspense, useEffect, useState } from "react";

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
    <Suspense fallback={<Loading />}>
      <div
        className={className}
        style={{ height: `calc(100vh - ${headerHeight}px)` }}
      >
        {children}
      </div>
    </Suspense>
  );
};

export default MainWrapper;
