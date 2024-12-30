import { Volume2, VolumeX } from "lucide-react";
import { AnimatedSubscribeButton } from "../ui/animated-subscribe-button";
import { useDispatch, useSelector } from "react-redux";

import { onSfxEnabled } from "@/lib/store/features/ui-state.slice";

const SoundToggler = () => {
  const dispatch = useDispatch();

  return (
    <AnimatedSubscribeButton
      onChange={(status) => dispatch(onSfxEnabled(!status))}
      subscribeStatus={false}
      initialText={
        <span className="group inline-flex items-center">
          <Volume2 className="h-3" />
        </span>
      }
      changeText={
        <span className="group inline-flex items-center">
          <VolumeX className="h-3" />
        </span>
      }
    />
  );
};

export default SoundToggler;
