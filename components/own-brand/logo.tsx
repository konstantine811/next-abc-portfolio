import { cn } from "@/lib/utils";
import { Tent } from "lucide-react";

const Logo = () => {
  return (
    <div className={cn("flex items-center")}>
      <Tent />
      <h3 className="text-sm font-sans">Ab/C</h3>
    </div>
  );
};

export default Logo;
