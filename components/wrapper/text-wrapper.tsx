import { ElementType, ReactNode, forwardRef, memo } from "react";
import { cn } from "@/lib/utils";

export interface ITextWrapperProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
}

const TextWrapper = memo(
  forwardRef<HTMLElement, ITextWrapperProps>(
    ({ as: Tag = "p", className, children, id, ...props }, ref) => {
      return (
        <Tag id={id} ref={ref} {...props} className={cn(className)}>
          {children}
        </Tag>
      );
    }
  )
);

export default TextWrapper;
