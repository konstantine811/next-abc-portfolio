"use client";
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppSelector } from "@/lib/store/hooks";

interface Props {
  categories: string[];
  defaultSelected?: string;
  onValueChange?(value: string): void;
}

const CategoryTabs = ({
  categories,
  defaultSelected,
  onValueChange,
}: Props) => {
  const [mounted, setMounted] = useState(false);
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.value.headerHeight
  );

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return;

  return (
    <>
      {categories && categories.length ? (
        <ToggleGroup
          defaultValue={defaultSelected ? defaultSelected : categories[0]}
          style={{ top: `${headerHeight}px` }}
          className={cn(
            "py-4 sticky bg-background/10 rounded backdrop-blur supports-[backdrop-filter]:bg-background/6 z-30"
          )}
          type="single"
          variant={"outline"}
          onValueChange={(value) => (onValueChange ? onValueChange(value) : "")}
        >
          {categories.map((category) => {
            return (
              <ToggleGroupItem
                key={category}
                value={category}
                aria-label={category}
              >
                {category}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      ) : (
        ""
      )}
    </>
  );
};

export default memo(CategoryTabs);
