import {
  initialAnimationSet,
  resetAnimation,
} from "@/lib/store/features/character-contoller/game-state.slice";
import { useAppSelector } from "@/lib/store/hooks";
import {
  SpriteAnimator,
  Trail,
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { act, useFrame } from "@react-three/fiber";
import { BallCollider, RapierCollider } from "@react-three/rapier";
import { useControls } from "leva";
import { Suspense, use, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Bone,
  Group,
  LoopOnce,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  NearestFilter,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import { GLTF } from "three/addons/loaders/GLTFLoader.js";

const PATH_TO_MODEL =
  "/assets/3dModels/characterController/Floating Character.glb";
type CharacterModelProps = JSX.IntrinsicElements["group"];
useGLTF.preload(PATH_TO_MODEL);
const CharacterModel = (props: CharacterModelProps) => {
  const dispatch = useDispatch();
  // Change the character src to yours
  const group = useRef<Group>(null!);
  const { nodes, animations } = useGLTF(PATH_TO_MODEL);
  const nodesCharacter = nodes as any;
  const { actions } = useAnimations(animations, group);
  // gradientMapTexture for MeshToonMaterial
  const gradientMapTexture = useTexture("/assets/textures/character/3.jpg");
  gradientMapTexture.minFilter = NearestFilter;
  gradientMapTexture.magFilter = NearestFilter;
  gradientMapTexture.generateMipmaps = false;

  /**
   * Prepare hands ref for attack action
   */
  const rightHandRef = useRef<Mesh>(null!);
  const rightHandColliderRef = useRef<RapierCollider>(null!);
  const leftHandRef = useRef<Mesh>(null!);
  const leftHandColliderRef = useRef<RapierCollider>(null!);
  const rightHandPos = useMemo(() => new Vector3(), []);
  const leftHandPos = useMemo(() => new Vector3(), []);
  const bodyPos = useMemo(() => new Vector3(), []);
  const bodyRot = useMemo(() => new Quaternion(), []);
  let rightHand = useRef<Object3D | null>(null);
  let leftHand = useRef<Object3D | null>(null);
  let mugModel = useRef<Object3D | null>(null!);

  /**
   * Prepare punch effect sprite
   */
  const [punchEffectProps, setPunchEffectProp] = useState({
    visible: false,
    scale: [1, 1, 1],
    play: false,
    position: [-0.2, -0.2, 0.5],
    startFrame: 0,
  });

  /**
   * Debug settings
   */
  const { mainColor, outlineColor, trailColor } = useControls(
    "Character Model",
    {
      mainColor: "mediumslateblue",
      outlineColor: "black",
      trailColor: "violet",
    }
  );

  /**
   * Prepare replacing materials
   */
  const outlineMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: outlineColor,
        transparent: true,
      }),
    [outlineColor]
  );
  const meshToonMaterial = useMemo(
    () =>
      new MeshToonMaterial({
        color: mainColor,
        gradientMap: gradientMapTexture,
        transparent: true,
      }),
    [mainColor, gradientMapTexture]
  );

  const curAnimation = useAppSelector(
    (state) => state.gameStateReducer.curAnimation
  );

  // Rename your character animation here
  const animationSet = useMemo(() => {
    return {
      idle: "Idle",
      walk: "Walk",
      run: "Run",
      jump: "Jump",
      jumpIdle: "JumpIdle",
      jumpLand: "JumpLand",
      fall: "Fall",
      action1: "Action1",
      action2: "Action2",
      action3: "Action3",
      action4: "Action4",
    };
  }, []);

  useEffect(() => {
    // Initialize animation set
    dispatch(initialAnimationSet(animationSet));
  });

  useEffect(() => {
    group.current?.traverse((obj) => {
      // Prepare both hands bone object
      if (obj instanceof Bone) {
        if (obj.name === "handSlotRight") rightHand.current = obj;
        if (obj.name === "handSlotLeft") leftHand.current = obj;
      }
      // Prepare mug model for cheer action
      if (obj.name === "mug") {
        mugModel.current = obj;
        mugModel.current.visible = false;
      }
    });
  }, []);

  useFrame(() => {
    if (curAnimation === animationSet.action4) {
      if (rightHand.current) {
        rightHand.current.getWorldPosition(rightHandPos);
        rightHandRef.current.getWorldPosition(bodyPos);
        rightHandRef.current.getWorldQuaternion(bodyRot);
      }
      // Apply hands position to hand colliders
      if (rightHandColliderRef.current) {
        // check if parent group autobalance is on or off
        if (
          group.current.parent?.quaternion.y === 0 &&
          group.current.parent?.quaternion.w === 1
        ) {
          rightHandRef.current.position
            .copy(rightHandPos)
            .sub(bodyPos)
            .applyQuaternion(bodyRot.conjugate());
        } else {
          rightHandRef.current.position.copy(rightHandPos).sub(bodyPos);
        }
        rightHandColliderRef.current.setTranslationWrtParent(
          rightHandRef.current.position
        );
      }
    }
  });

  useEffect(() => {
    // Play animation
    const action = actions[curAnimation ? curAnimation : animationSet.jumpIdle];
    const rightHandColliderRefCur = rightHandColliderRef.current;
    // For jump and jump land animation, only play once and clamp when finish
    if (action) {
      if (
        curAnimation === animationSet.jump ||
        curAnimation === animationSet.jumpLand ||
        curAnimation === animationSet.action1 ||
        curAnimation === animationSet.action2 ||
        curAnimation === animationSet.action3 ||
        curAnimation === animationSet.action4
      ) {
        action.reset().fadeIn(0.2).setLoop(LoopOnce, 1).play();
        action.clampWhenFinished = true;
        // Only show mug during cheer action
        if (mugModel.current) {
          if (curAnimation === animationSet.action3) {
            mugModel.current.visible = true;
          } else {
            mugModel.current.visible = false;
          }
        }
      } else {
        action.reset().fadeIn(0.2).play();
      }
      // When any action is clamp and finished reset animaiton
      action
        .getMixer()
        .addEventListener("finished", () => dispatch(resetAnimation()));
    }

    return () => {
      // Fade out previous action
      if (action) {
        action.fadeOut(0.2);

        // Clean up mixer listener, and empty the _listeners array
        action
          .getMixer()
          .removeEventListener("finished", () => dispatch(resetAnimation()));
        action.getMixer().stopAllAction();

        // Move hand collider back to intial position after action
        if (curAnimation === animationSet.action4) {
          if (rightHandColliderRefCur) {
            rightHandColliderRefCur.setTranslationWrtParent(
              new Vector3(0, 0, 0)
            );
          }
        }
      }
    };
  }, [curAnimation, actions, animationSet, dispatch]);
  return (
    <Suspense fallback={<capsuleGeometry args={[0.3, 0.7]} />}>
      {/* Default capsule modle */}
      {/* <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.7]} />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <mesh castShadow position={[0, 0.2, 0.2]}>
        <boxGeometry args={[0.5, 0.2, 0.3]} />
        <meshStandardMaterial color="mediumpurple" />
      </mesh> */}

      {/* Replace yours model here */}
      {/* Head collider */}
      <BallCollider args={[0.5]} position={[0, 0.45, 0]} />
      {/* Right hand collider */}
      <mesh ref={rightHandRef} />
      <BallCollider
        args={[0.1]}
        ref={rightHandColliderRef}
        onCollisionEnter={(e) => {
          if (curAnimation === animationSet.action4) {
            // Play punch effect
            setPunchEffectProp((prev) => ({
              ...prev,
              visible: true,
              play: true,
            }));
          }
        }}
      />

      {/* Left hand collider */}
      <mesh ref={leftHandRef} />
      <BallCollider args={[0.1]} ref={leftHandColliderRef} />
      {/* Character model */}
      <group ref={group} {...props} dispose={null}>
        <group name="Scene" scale={0.8} position={[0, -0.6, 0]}>
          <group name="KayKit_Animated_Character">
            <skinnedMesh
              name="outline"
              geometry={nodesCharacter.outline.geometry}
              material={outlineMaterial}
              skeleton={nodesCharacter.outline.skeleton}
            />
            <skinnedMesh
              name="PrototypePete"
              geometry={nodesCharacter.PrototypePete.geometry}
              material={meshToonMaterial}
              skeleton={nodesCharacter.PrototypePete.skeleton}
              receiveShadow
              castShadow
            />
            <Trail
              width={1.5}
              color={trailColor}
              length={3}
              decay={2}
              attenuation={(width) => width}
            >
              <primitive object={nodes.Body} />
            </Trail>
          </group>
        </group>
        <SpriteAnimator
          visible={punchEffectProps.visible}
          scale={punchEffectProps.scale as any}
          position={punchEffectProps.position as any}
          startFrame={punchEffectProps.startFrame}
          loop={true}
          onLoopEnd={() => {
            setPunchEffectProp((prev) => ({
              ...prev,
              visible: false,
              play: false,
            }));
          }}
          play={punchEffectProps.play}
          numberOfFrames={7}
          alphaTest={0.01}
          textureImageURL={"./punchEffect.png"}
        />
      </group>
    </Suspense>
  );
};

export default CharacterModel;
