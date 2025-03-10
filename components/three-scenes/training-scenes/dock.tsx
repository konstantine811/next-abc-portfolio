"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Baseline } from "lucide-react";
import { PATH_ROUTE_NAME } from "@/configs/navigation";
import { Link } from "@/i18n/routing";

function getRepativePath(path: string = "") {
  return `${PATH_ROUTE_NAME.threeTrain}/${PATH_ROUTE_NAME.traineScene}${
    path === "" ? "" : `/${path}`
  }`;
}

const apps = [
  {
    id: 1,
    icon: Baseline,
    name: "3d-2d Text Scene",
    link: getRepativePath(),
  },
];

export default function Dock() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4 p-3 bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg">
      {apps.map((app, index) => (
        <div key={app.id} className="relative flex flex-col items-center">
          <motion.button
            className="p-2 bg-gray-900 rounded-lg text-white"
            whileHover={{ scale: 1.4 }}
            onHoverStart={() => setHovered(index)}
            onHoverEnd={() => setHovered(null)}
          >
            <Link href={app.link}>
              <app.icon size={32} />
            </Link>
          </motion.button>
          {hovered === index && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-16 bg-gray-700 w-36 text-center text-white text-sm px-2 py-1 rounded-md"
            >
              {app.name}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
