import { ReactNode } from "react";

const NoiseGrid = ({
  children,
  opacity = 0.1,
}: {
  children: ReactNode;
  opacity?: number;
}) => {
  return (
    <section className="relative rounded-md overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full content-[''] z-10 pointer-events-none bg-[url('https://i.gifer.com/2Bap.gif')]"
        style={{ opacity }}
      ></div>
      <div className="bg-gradient-to-t dark:to-gray-800 dark:from-gray-950 to-[#dadada] from-white flex flex-col items-center justify-center dark:text-white text-black">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_34px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {children}
      </div>
    </section>
  );
};

export default NoiseGrid;
