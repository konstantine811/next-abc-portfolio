import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Prop = {
  children: ReactNode;
  className?: string;
  wrapClassName?: string;
};

const MainContent = ({ children, className, wrapClassName }: Prop) => {
  return (
    <main className={cn(`relative lg:gap-10 ${wrapClassName}`)}>
      <div className={cn(`mx-auto w-full min-w-0 ${className}`)}>
        {children}
      </div>
    </main>
  );
};

export default MainContent;
