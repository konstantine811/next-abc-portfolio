import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Prop = {
  children: ReactNode;
  className?: string;
};

const MainContainer = ({ children, className }: Prop) => {
  return <div className={cn(`container ${className}`)}>{children}</div>;
};

export default MainContainer;
