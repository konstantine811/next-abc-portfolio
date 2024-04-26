"use client";

import TextProgressAnim from "@/components/partials/text-progress/text-progress-anim";
import TextInViewAnim from "@/components/partials/text-progress/text-in-view-anim";
import { ISkillsConfig } from "./config-hook";

interface Props {
  skillsConfig: ISkillsConfig[];
}

const SecondSection = ({ skillsConfig }: Props) => {
  return (
    <div className="container">
      {skillsConfig.map((config, index) => {
        return (
          <div key={index} className="mb-10">
            <TextInViewAnim>
              <h3 className="text-4xl mb-2">{config.title}:</h3>
            </TextInViewAnim>
            {config.children.map((child, indexCh) => {
              return (
                <TextProgressAnim
                  key={indexCh}
                  title={child.title}
                  progressCount={child.progressCount}
                  delay={index * indexCh * 0.5}
                  icon={child.icon}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SecondSection;
