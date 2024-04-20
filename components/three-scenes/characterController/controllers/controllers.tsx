import { RapierRigidBody } from "@react-three/rapier";
import {
  ForwardRefRenderFunction,
  RefObject,
  forwardRef,
  use,
  useMemo,
  useRef,
} from "react";
import { ControllerProps } from "./models";
import { Group, Object3D, Vector3 } from "three";
// storeage
import { useAppSelector } from "@/lib/store/hooks";
import { setCameraBased } from "@/lib/store/features/character-contoller/game-state.slice";
import { useDispatch } from "react-redux";

const Controller: ForwardRefRenderFunction<RapierRigidBody, ControllerProps> = (
  {
    children,
    debug = false,
    capsuleHalfHeight = 0.35,
    capsuleRadius = 0.3,
    floatHeight = 0.3,
    characterInitDir = 0, // in rad
    followLight = false,
    disableFollowCam = false,
    disableFollowCamPos = { x: 0, y: 0, z: -5 },
    disableFollowCamTarget = { x: 0, y: 0, z: 0 },
    // Follow camera setups
    camInitDis = -5,
    camMaxDis = -7,
    camInitDir = { x: 0, y: 0 }, // in rad
    camTargetPos = { x: 0, y: 0, z: 0 },
    camMoveSpeed = 1,
    camZoomSpeed = 1,
    camCollision = true,
    camCollisionOffset = 0.7,
    // Follow light setups
    followLightPos = { x: 20, y: 30, z: 10 },
    // Base controller setups
    maxVelLimit = 2.5,
    turnVelMultiplier = 0.2,
    turnSpeed = 15,
    sprintMult = 2,
    jumpVel = 4,
    jumpForceToGroundMult = 5,
    slopJumpMult = 0.25,
    sprintJumpMult = 1.2,
    airDragMultiplier = 0.2,
    dragDampingC = 0.15,
    accDeltaTime = 8,
    rejectVelMult = 4,
    moveImpulsePointY = 0.5,
    camFollowMult = 11,
    fallingGravityScale = 2.5,
    fallingMaxVel = -20,
    wakeUpDealay = 200,
    // Floating Ray setups
    rayOriginOffset = { x: 0, y: -capsuleHalfHeight, z: 0 },
    rayHitForgiveness = 0.1,
    rayLength = capsuleRadius + 2,
    rayDir = { x: 0, y: -1, z: 0 },
    floatingDis = capsuleRadius + floatHeight,
    springK = 1.2,
    dampingC = 0.08,
    // Slope Ray setups
    showSlopeRayOrigin = false,
    slopeMaxAngle = 1, // in rad
    slopeRayOriginOffset = capsuleRadius - 0.03,
    slopeRayLength = capsuleRadius + 3,
    slopeRayDir = { x: 0, y: -1, z: 0 },
    slopeUpExtraForce = 0.1,
    slopeDownExtraForce = 0.2,
    // AutoBalance Force setups
    autoBalance = true,
    autoBalanceSpringK = 0.3,
    autoBalanceDampingC = 0.03,
    autoBalanceSpringOnY = 0.5,
    autoBalanceDampingOnY = 0.015,
    // Animation temporary setups
    animated = false,
    // Mode setups
    mode = null,
    // Controller setups
    controllerKeys = {
      forward: 12,
      backward: 13,
      leftward: 14,
      rightward: 15,
      jump: 2,
      action1: 11,
      action2: 3,
      action3: 1,
      action4: 0,
    },
    // Other rigidbody props from parent
    ...props
  }: ControllerProps,
  ref
) => {
  const dispatch = useDispatch();
  const characterRef = useRef<RapierRigidBody>(null);
  const forwardRef = ref as RefObject<RapierRigidBody>; // Forward ref to parent
  const controllerRef = forwardRef || characterRef; // Use parent ref if available
  const characterModelRef = useRef<Group>();
  const characterModelIndicator = useMemo(() => new Object3D(), []);
  const defaultControllerKeys = {
    forward: 12,
    backward: 13,
    leftward: 14,
    rightward: 15,
    jump: 2,
    action1: 11,
    action2: 3,
    action3: 1,
    action4: 0,
  };

  //   Mode setups
  let isModePointMove = false;
  const isCameraBased = useAppSelector(
    (state) => state.gameStateReducer.isCameraBased
  );
  if (mode) {
    if (mode === "PointMove") {
      isModePointMove = true;
    }
    if (mode === "CameraBasedMovement") {
      dispatch(setCameraBased(true));
    }
  }
  //   Body collider setup
  const modelFacingVec = useMemo(() => new Vector3(), []);
  const bodyFacingVec = useMemo(() => new Vector3(), []);
  const bodyBalanceVec = useMemo(() => new Vector3(), []);
  const bodyBalanceVecOnX = useMemo(() => new Vector3(), []);
  const bodyBalanceVecOnY = useMemo(() => new Vector3(), []);
  const bodyBalanceVecOnZ = useMemo(() => new Vector3(), []);
  const vectorY = useMemo(() => new Vector3(0, 1, 0), []);
  const vectorZ = useMemo(() => new Vector3(0, 0, 1), []);
  const bodyContactForce = useMemo(() => new Vector3(), []);

  // Animation
  return <></>;
};

export default forwardRef(Controller);
