"use client";
import FirstSection from "./first-seciton";
import SecondSection from "./second-section";
import { ISkillsConfig } from "./config-hook";

interface Props {
  headerHeight?: number;
  skillsConfig: ISkillsConfig[];
}

const Sections = ({ headerHeight = 0, skillsConfig }: Props) => {
  const sectionHeight = () => {
    return `calc(100vh - ${headerHeight}px)`;
  };
  return (
    <div className="w-full">
      <div style={{ height: sectionHeight() }}>
        <FirstSection />
      </div>
      <div style={{ height: sectionHeight() }}>
        <SecondSection skillsConfig={skillsConfig} />
      </div>
    </div>
  );
};

export default Sections;
