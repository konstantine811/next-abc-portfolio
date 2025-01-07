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

// utils
import { getPathName } from "@/utils/blog.utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";

type Prop = {
  data: BlogPost;
};

const BlogCard = ({ data }: Prop) => {
  return (
    <Link
      href={getPathName(data.id)}
      className="hover:shadow-lg hover:shadow-foreground/10 hover:-translate-y-1 block transition-all"
    >
      <Card
        className={cn("flex flex-col justify-center overflow-hidden w-full")}
      >
        <CardHeader
          className={cn(`mb-3 p-0 relative ${data.cover ? "min-h-32" : ""}`)}
        >
          {data.cover && (
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              src={data.cover}
              alt={data.title}
            />
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
