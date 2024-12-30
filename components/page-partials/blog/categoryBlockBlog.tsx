"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
// utils
import { cn } from "@/lib/utils";
// models
import { BlogPost } from "@/@types/schema.notion";
// components
import { Separator } from "@/components/ui/separator";
import BlogCard from "./cardBlog";
import { useAppSelector } from "@/lib/store/hooks";

interface Prop {}

const CategoryBlockBlog = ({}: Prop) => {
  const [mounted, setMounted] = useState(false);
  const data = useAppSelector(
    (state) => state.blogPostStateReducer.filteredBlogPost
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Додано `null` для коректного рендерингу

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 1,
      scale: 1.01,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,

      transition: {
        staggerChildren: 0.01, // Затримка між анімаціями дочірніх елементів
        duration: 0.9,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 3 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 3.1 },
    },
  };

  return (
    <div className={cn("w-full flex flex-col gap-10")}>
      {Object.entries(data).map(([key, posts]) => {
        return (
          <motion.div
            className={cn("w-full flex flex-col gap-3 origin-center")}
            key={key}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h3 className={cn("text-3xl")}>{key}</h3>
            <Separator />
            <motion.div
              className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              )}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post: BlogPost, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <BlogCard data={post} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default memo(CategoryBlockBlog);
