"use client";

import { useState } from "react";
import Titles from "./titles";
import Description from "./description";

export interface IProjectsData {
  title: string;
  description: string;
  speed: number;
}
const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const data: IProjectsData[] = [
    {
      title: "Ford",
      description:
        "Working on the Next-Generation HMI Experience without no driving experience.",
      speed: 0.5,
    },
    {
      title: "UFC",
      description:
        "Developed the Future of UFC Sports Ecosystem despite not being a sports fan.",
      speed: 0.5,
    },
    {
      title: "Lincoln",
      description:
        "Defined the visual concept and design language for the Lincoln Zephyr 2022 but never seen it in real life.",
      speed: 0.67,
    },
  ];
  return (
    <div className="absolute z-10 w-full top-30">
      <Description data={data} selectedProject={selectedProject} />
      <Titles data={data} setSelectedProject={setSelectedProject} />
    </div>
  );
};

export default Projects;
