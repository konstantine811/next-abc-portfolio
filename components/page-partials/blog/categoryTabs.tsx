"use client";
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return;

  return (
    <>
      {categories && categories.length ? (
        <ToggleGroup
          defaultValue={defaultSelected ? defaultSelected : categories[0]}
          className={cn(
            "py-3 bg-background/10 rounded backdrop-blur supports-[backdrop-filter]:bg-background/6 z-30 flex flex-wrap justify-start px-5"
          )}
          type="single"
          variant={"outline"}
          onValueChange={(value) => (onValueChange ? onValueChange(value) : "")}
        >
          {categories.map((category) => {
            return (
              <ToggleGroupItem
                className="px-3 py-1 rounded-2xl leading-none h-auto"
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
