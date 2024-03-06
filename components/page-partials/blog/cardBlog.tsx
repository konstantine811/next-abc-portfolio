"use client";

import { BlogPost } from "@/@types/schema.notion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
// utils
import { getPathName } from "@/utils/blog-path";
import { Badge } from "@/components/ui/badge";

type Prop = {
  data: BlogPost;
};

const BlogCard = ({ data }: Prop) => {
  console.log("data", data);
  return (
    <Link href={getPathName(data.id)}>
      <Card className={cn("flex flex-col justify-center overflow-hidden")}>
        <CardHeader
          className={cn(`mb-3 p-0 relative ${data.cover ? "min-h-32" : ""}`)}
        >
          {data.cover ? (
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              src={data.cover}
              alt={data.title}
            />
          ) : (
            ""
          )}
        </CardHeader>
        <CardContent>
          <CardTitle>{data.title}</CardTitle>
        </CardContent>
        <CardFooter>
          <Badge variant={"secondary"}>{data.category.name}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
