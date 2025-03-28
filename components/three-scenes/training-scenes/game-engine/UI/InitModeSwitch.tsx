import CenterContent from "./header/CenterContent";

const InitModeSwitch = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white/5 z-10 pointer-events-none">
      <header className="w-full grid grid-cols-3 items-center mt-2">
        <div className="flex justify-start"></div>
        <div className="flex justify-center pointer-events-auto">
          <CenterContent />
        </div>
        <div className="flex justify-end"></div>
      </header>
    </div>
  );
};

export default InitModeSwitch;
