import React, { ElementType, ReactNode, forwardRef, memo } from "react";
import { cn } from "@/lib/utils";

export interface ITextWrapperProps {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  id?: string;
}

const TextWrapper = memo(
  forwardRef<HTMLElement, ITextWrapperProps>(function TextWrapper(
    { as: Tag = "p", className, children, id, ...props },
    ref
  ) {
    const Component = Tag as any;
    return (
      <Component id={id} ref={ref} {...props} className={cn(className)}>
        {children ?? null}
      </Component>
    );
  })
);

export default TextWrapper;
