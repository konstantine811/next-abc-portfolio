import { useRef } from "react";
import { IProjectsData } from "./projects";
import {
  useMotionTemplate,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";

type TitlesProp = {
  data: IProjectsData[];
  setSelectedProject: (i: number | null) => void;
};
type TitleProp = {
  data: IProjectsData;
  setSelectedProject: (i: number | null) => void;
  index: number;
};

const Titles = ({ data, setSelectedProject }: TitlesProp) => {
  return (
    <div className="w-full border-t border-blue-500">
      {data.map((project, i) => {
        return (
          <Title
            key={i}
            data={project}
            index={i}
            setSelectedProject={setSelectedProject}
          />
        );
      })}
    </div>
  );
};

const Title = ({ data, setSelectedProject, index }: TitleProp) => {
  const { description, speed, title } = data;
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", `${25 / speed}vw end`],
  });
  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${clipProgress}% 0 0)`;
  return (
    <div
      ref={container}
      className="border-b border-blue-400 cursor-default relative z-[2]"
    >
      <div
        onMouseOver={() => setSelectedProject(index)}
        onMouseLeave={() => setSelectedProject(null)}
        className="inline-block ml-52 relative"
      >
        <motion.p
          className="text-gray-600/50 font-bold text-8xl relative z-[2] uppercase"
          style={{ clipPath: clip }}
        >
          {title}
        </motion.p>
        <p className="text-gray-200/5 font-bold text-8xl absolute z-[1] top-0 left-0 uppercase">
          {title}
        </p>
      </div>
    </div>
  );
};

export default Titles;
