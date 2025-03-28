import AnimatedButton from "@/components/partials/ui/AnimatedButton";
import { setMode } from "@/lib/store/features/game-engine/game-engine-state.slice";
import { RootState } from "@/lib/store/store";
import { GameEngineMode } from "@/models/three-scene/game-engine/game-engine-state.model";
import { Play, Pause } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

const CenterContent = () => {
  const { mode } = useAppSelector((state: RootState) => state.gameEngineState);
  const dispatch = useAppDispatch();
  return (
    <AnimatedButton
      onClick={() => {
        dispatch(
          setMode(
            mode === GameEngineMode.edit
              ? GameEngineMode.play
              : GameEngineMode.edit
          )
        );
      }}
      className="px-4 py-2 bg-secondary text-white rounded"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mode === GameEngineMode.edit ? (
          <motion.div
            key="play"
            initial={{ opacity: 0.8, rotate: -9, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0.8, rotate: 9, scale: 0.8 }}
            transition={{ duration: 0.1 }}
          >
            <Play size={24} />
          </motion.div>
        ) : (
          <motion.div
            key="pause"
            initial={{ opacity: 0.8, rotate: 9, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0.8, rotate: -9, scale: 0.8 }}
            transition={{ duration: 0.1 }}
          >
            <Pause size={24} />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedButton>
  );
};

export default CenterContent;
