import { IProjectsData } from "./projects";

type Prop = {
  data: IProjectsData[];
  selectedProject: number | null;
};

const Description = ({ data, selectedProject }: Prop) => {
  const crop = (string: string, maxLength: number) => {
    return string.substring(0, maxLength);
  };
  return (
    <div className="absolute top-0  h-full w-full z-10 pointer-events-none">
      {data.map((project, i) => {
        const { title, description } = project;
        return (
          <div
            className="flex  justify-between items-center ml-52 pr-20 transition-all"
            key={i}
            style={{
              clipPath:
                selectedProject == i ? "inset(0 0 0)" : "inset(50% 0 50%)",
            }}
          >
            <p className="text-8xl  m-0 font-bold uppercase relative">
              {crop(title, 9)}
            </p>
            <p className="w-[40%] text-1xl font-black">{description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Description;
