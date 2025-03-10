import Dock from "@/components/three-scenes/training-scenes/dock";
import MainWrapper from "@/components/wrapper/main-wrapper";

export default function TraineSceneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainWrapper>
      <Dock />
      {children}
    </MainWrapper>
  );
}
