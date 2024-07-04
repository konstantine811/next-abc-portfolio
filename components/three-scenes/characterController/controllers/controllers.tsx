import {
  CapsuleCollider,
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
  quat,
  useRapier,
} from "@react-three/rapier";
import {
  ForwardRefRenderFunction,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ControllerProps, userDataType } from "./models";
import {
  DirectionalLight,
  Euler,
  Group,
  Mesh,
  Object3D,
  Quaternion,
  Vector2,
  Vector3,
} from "three";
// storeage
import { useAppSelector } from "@/lib/store/hooks";
import {
  onCameraBased,
  idleAnimation,
  jumpAnimation,
  runAnimation,
  walkAnimation,
  jumpIdleAnimation,
  fallAnimation,
} from "@/lib/store/features/character-contoller/game-state.slice";
import { useDispatch } from "react-redux";
import { useControls } from "leva";
import {
  AutoBalanceForceDebug,
  CharacterControlsDebug,
  FloatingRayDebug,
  SlopeRayDebug,
} from "./debug.config";
import { useKeyboardControls } from "@react-three/drei";
import {
  onJoystick,
  pressButton1,
  pressButton2,
  pressButton3,
  pressButton4,
  pressButton5,
  resetAllButtons,
  resetJoystick,
} from "@/lib/store/features/character-contoller/joystick-controlls-state";
import useFollowCam from "../hooks/useFollowCam";
import { Collider, RayColliderToi, Vector } from "@dimforge/rapier3d-compat";
import { useFrame } from "@react-three/fiber";
import { getMovingDirection } from "./utils";

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
    camMinDis = -0.7,
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
  const characterRef = useRef<RapierRigidBody>(null!);
  const forwardRef = ref as RefObject<RapierRigidBody>; // Forward ref to parent
  const controllerRef = forwardRef || characterRef; // Use parent ref if available
  const characterModelRef = useRef<Group>(null!);
  const characterModelIndicator = useMemo(() => new Object3D(), []);
  const defaultControllerKeys = useMemo(
    () => ({
      forward: 12,
      backward: 13,
      leftward: 14,
      rightward: 15,
      jump: 2,
      action1: 11,
      action2: 3,
      action3: 1,
      action4: 0,
    }),
    []
  );

  //   Mode setups
  let isModePointToMove = false;
  const isCameraBased = useAppSelector(
    (state) => state.gameStateReducer.isCameraBased
  );
  if (mode) {
    if (mode === "PointMove") {
      isModePointToMove = true;
    }
    if (mode === "CameraBasedMovement") {
      dispatch(onCameraBased(true));
    }
  }
  //   Body collider setup
  const modelFacingVec = useMemo(() => new Vector3(), []);
  const bodyFacingVec = useMemo(() => new Vector3(), []);
  const bodyBalanceVec = useMemo(() => new Vector3(), []);
  const bodyBalanceVecOnX = useMemo(() => new Vector3(), []);
  const bodyFacingVecOnY = useMemo(() => new Vector3(), []);
  const bodyBalanceVecOnZ = useMemo(() => new Vector3(), []);
  const vectorY = useMemo(() => new Vector3(0, 1, 0), []);
  const vectorZ = useMemo(() => new Vector3(0, 0, 1), []);
  const crossVecOnX = useMemo(() => new Vector3(), []);
  const crossVecOnY = useMemo(() => new Vector3(), []);
  const crossVecOnZ = useMemo(() => new Vector3(), []);
  const bodyContactForce = useMemo(() => new Vector3(), []);
  const slopeRayOriginUpdatePosition = useMemo(() => new Vector3(), []);
  const camBasedMoveCrossVecOnY = useMemo(() => new Vector3(), []);

  // Animation change functions
  const animationSet = useAppSelector(
    (state) => state.gameStateReducer.animationSet
  );

  // Debug settings
  let characterControlsDebug = null;
  let floatingRayDebug = null;
  let slopeRayDebug = null;
  let autoBalanceForceDebug = null;
  // Character Controls
  characterControlsDebug = useControls(
    "Character Controls",
    new CharacterControlsDebug(
      maxVelLimit,
      turnVelMultiplier,
      turnSpeed,
      sprintMult,
      jumpVel,
      jumpForceToGroundMult,
      slopJumpMult,
      sprintJumpMult,
      airDragMultiplier,
      dragDampingC,
      accDeltaTime,
      rejectVelMult,
      moveImpulsePointY,
      camFollowMult
    ).config,
    { collapsed: true }
  ) as any;
  // Apply debug values
  maxVelLimit = characterControlsDebug.maxVelLimit;
  turnVelMultiplier = characterControlsDebug.turnVelMultiplier;
  turnSpeed = characterControlsDebug.turnSpeed;
  sprintMult = characterControlsDebug.sprintMult;
  jumpVel = characterControlsDebug.jumpVel;
  jumpForceToGroundMult = characterControlsDebug.jumpForceToGroundMult;
  slopJumpMult = characterControlsDebug.slopJumpMult;
  sprintJumpMult = characterControlsDebug.sprintJumpMult;
  airDragMultiplier = characterControlsDebug.airDragMultiplier;
  dragDampingC = characterControlsDebug.dragDampingC;
  accDeltaTime = characterControlsDebug.accDeltaTime;
  rejectVelMult = characterControlsDebug.rejectVelMult;
  moveImpulsePointY = characterControlsDebug.moveImpulsePointY;
  camFollowMult = characterControlsDebug.camFollowMult;

  // Floating Ray
  floatingRayDebug = useControls(
    "Floating Ray",
    new FloatingRayDebug(
      capsuleHalfHeight,
      capsuleRadius,
      floatHeight,
      rayHitForgiveness,
      springK,
      dampingC
    ).config,
    { collapsed: true }
  ) as any;
  // Apply debug values
  rayOriginOffset = floatingRayDebug.rayOriginOffset;
  rayHitForgiveness = floatingRayDebug.rayHitForgiveness;
  rayLength = floatingRayDebug.rayLength;
  rayDir = floatingRayDebug.rayDir;
  floatingDis = floatingRayDebug.floatingDis;
  springK = floatingRayDebug.springK;
  dampingC = floatingRayDebug.dampingC;

  // Slope Ray
  slopeRayDebug = useControls(
    "Slope Ray",
    new SlopeRayDebug(
      slopeMaxAngle,
      capsuleRadius,
      slopeUpExtraForce,
      slopeDownExtraForce
    ).config,
    { collapsed: true }
  ) as any;
  // Apply debug values
  showSlopeRayOrigin = slopeRayDebug.showSlopeRayOrigin;
  slopeMaxAngle = slopeRayDebug.slopeMaxAngle;
  slopeRayLength = slopeRayDebug.slopeRayLength;
  slopeRayDir = slopeRayDebug.slopeRayDir;
  slopeUpExtraForce = slopeRayDebug.slopeUpExtraForce;
  slopeDownExtraForce = slopeRayDebug.slopeDownExtraForce;

  // Auto Balance Force
  autoBalanceForceDebug = useControls(
    "Auto Balance Force",
    new AutoBalanceForceDebug(
      autoBalanceSpringK,
      autoBalanceDampingC,
      autoBalanceSpringOnY,
      autoBalanceDampingOnY
    ).config,
    { collapsed: true }
  ) as any;
  // Apply debug values
  autoBalance = autoBalanceForceDebug.autoBalance;
  autoBalanceSpringK = autoBalanceForceDebug.autoBalanceSpringK;
  autoBalanceDampingC = autoBalanceForceDebug.autoBalanceDampingC;
  autoBalanceSpringOnY = autoBalanceForceDebug.autoBalanceSpringOnY;
  autoBalanceDampingOnY = autoBalanceForceDebug.autoBalanceDampingOnY;

  // Check if inside keyboardcontrols
  function useIsInsideKeyboardControls() {
    try {
      return !!useKeyboardControls();
    } catch {
      return false;
    }
  }
  const isInsideKeyboardControls = useIsInsideKeyboardControls();

  // keyboard controls setup
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const presetKeys = {
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    jump: false,
    run: false,
  };
  const { rapier, world } = useRapier();

  // Joistick controls setup
  const joystickDis = useAppSelector(
    (state) => state.joystickControllsReducer.curJoystickDis
  );
  const joystickAng = useAppSelector(
    (state) => state.joystickControllsReducer.curJoystickAngle
  );
  const joystickState = useAppSelector(
    (state) => state.joystickControllsReducer.curRunState
  );
  const curRunState = useAppSelector(
    (state) => state.joystickControllsReducer.curRunState
  );
  const pressedButton1 = useAppSelector(
    (state) => state.joystickControllsReducer.curButton1Pressed
  );
  const pressedButton2 = useAppSelector(
    (state) => state.joystickControllsReducer.curButton2Pressed
  );
  const pressedButton3 = useAppSelector(
    (state) => state.joystickControllsReducer.curButton3Pressed
  );
  const pressedButton4 = useAppSelector(
    (state) => state.joystickControllsReducer.curButton4Pressed
  );
  const pressedButton5 = useAppSelector(
    (state) => state.joystickControllsReducer.curButton5Pressed
  );

  // Gamepade controls setup
  const [controllerIndex, setControllerIndex] = useState<number | null>(null);
  const gamepadKeys = {
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
  };
  const gamepadJoystickVec2 = useMemo(() => new Vector2(), []);
  let gamepadJoystickDis = 0;
  let gamepadJoystickAngle = 0;
  const gamepadConnect = useCallback((e: any) => {
    setControllerIndex(e.gamepad.index);
  }, []);
  const gamepadDisconnect = useCallback((e: any) => {
    setControllerIndex(null);
  }, []);
  const mergedKeys = useMemo(
    () => Object.assign({}, defaultControllerKeys, controllerKeys),
    [defaultControllerKeys, controllerKeys]
  );
  const handleButtons = (buttons: readonly GamepadButton[]) => {
    gamepadKeys.forward = buttons[mergedKeys.forward].pressed;
    gamepadKeys.backward = buttons[mergedKeys.backward].pressed;
    gamepadKeys.leftward = buttons[mergedKeys.leftward].pressed;
    gamepadKeys.rightward = buttons[mergedKeys.rightward].pressed;

    // Gampepad trigger the ControllerJoystick to play animations
    if (buttons[mergedKeys.action4].pressed) {
      dispatch(pressButton2());
    } else if (buttons[mergedKeys.action3].pressed) {
      dispatch(pressButton4());
    } else if (buttons[mergedKeys.jump].pressed) {
      dispatch(pressButton1());
    } else if (buttons[mergedKeys.action2].pressed) {
      dispatch(pressButton3());
    } else if (buttons[mergedKeys.action1].pressed) {
      dispatch(pressButton5());
    } else {
      dispatch(resetAllButtons());
    }
  };

  const handleSticks = (axes: readonly number[]) => {
    // Gamepad first joystick trigger the CharacterJoystick event to move the character
    if (Math.abs(axes[0]) > 0 || Math.abs(axes[1]) > 0) {
      gamepadJoystickVec2.set(axes[0], -axes[1]);
      gamepadJoystickDis = Math.min(
        Math.sqrt(
          Math.pow(gamepadJoystickVec2.x, 2) +
            Math.pow(gamepadJoystickVec2.y, 2)
        ),
        1
      );
      gamepadJoystickAngle = gamepadJoystickVec2.angle();
      const runState = gamepadJoystickDis > 0.7;
      dispatch(
        onJoystick({
          dis: gamepadJoystickDis,
          angle: gamepadJoystickAngle,
          isRun: runState,
        })
      );
    } else {
      dispatch(resetJoystick());
    }
    // Gamepad second joystick trigger useFollowCam event to move the camera
    if (Math.abs(axes[2]) > 0 || Math.abs(axes[3]) > 0) {
      joystickCamMove(axes[2], axes[3]);
    }
  };

  // can jump setup
  let canJump = false;
  let isFalling = false;
  const initialGravityScale = useMemo(
    () => props.gravityScale || 1,
    [props.gravityScale]
  );

  // on moving object state
  let massRatio = 1;
  let isOnMovingObject = false;
  const standingForcePoint = useMemo(() => new Vector3(), []);
  const movingObjectDragForce = useMemo(() => new Vector3(), []);
  const movingObjectVelocity = useMemo(() => new Vector3(), []);
  const movingObjectVelocityInCharacterDir = useMemo(() => new Vector3(), []);
  const distanceFromCharacterToObject = useMemo(() => new Vector3(), []);
  const objectAngelToLinvel = useMemo(() => new Vector3(), []);
  const velocityDiff = useMemo(() => new Vector3(), []);

  // Initial light setup
  const [dirLight, setDirLight] = useState<DirectionalLight>();

  // Follow camera initial setups from props
  const cameraSetups = {
    disableFollowCam,
    disableFollowCamPos,
    disableFollowCamTarget,
    camInitDir,
    camInitDis,
    camMaxDis,
    camMinDis,
    camMoveSpeed,
    camZoomSpeed,
    camCollisionOffset,
  };
  // Load camera pivot and character move preset
  const { pivot, cameraCollisionDetect, joystickCamMove } =
    useFollowCam(cameraSetups);
  const pivotPosition = useMemo(() => new Vector3(), []);
  const modelEuler = useMemo(() => new Euler(), []);
  const modelQuat = useMemo(() => new Quaternion(), []);
  const moveImpulse = useMemo(() => new Vector3(), []);
  const movingDirection = useMemo(() => new Vector3(), []);
  const moveAccNeeded = useMemo(() => new Vector3(), []);
  const jumpVelocityVec = useMemo(() => new Vector3(), []);
  const jumpDirection = useMemo(() => new Vector3(), []);
  const currentVel = useMemo(() => new Vector3(), []);
  const currentPos = useMemo(() => new Vector3(), []);
  const dragForce = useMemo(() => new Vector3(), []);
  const dragAndForce = useMemo(() => new Vector3(), []);
  const wantToMoveVel = useMemo(() => new Vector3(), []);
  const rejectVel = useMemo(() => new Vector3(), []);

  // Floating Ray setup
  let floatingForce = null;
  const springDirVec = useMemo(() => new Vector3(), []);
  const characterMassForce = useMemo(() => new Vector3(), []);
  const rayOrigin = useMemo(() => new Vector3(), []);
  const rayCast = new rapier.Ray(rayOrigin, rayDir);
  let rayHit: RayColliderToi | null = null;

  // Test shape ray
  // const shape = new rapier.Capsule(0.2, 0.1)

  // Slope detection ray setup
  let slopeAngle: number = 0;
  let actualSlopeNormal: Vector | undefined = undefined;
  let actualSlopeAngle = 0;
  const actualSlopeNormalVec = useMemo(() => new Vector3(), []);
  const floorNormal = useMemo(() => new Vector3(0, 1, 0), []);
  const slopeRayOriginRef = useRef<Mesh>(null!);
  const slopeRayOrigin = useMemo(() => new Vector3(), []);
  const slopeRayCast = new rapier.Ray(slopeRayOrigin, slopeRayDir);
  let slopeRayHit: RayColliderToi | null = null;

  // Point to move setup
  let isBodyHitWall = false;
  let isPointMoving = false;
  const crossVector = useMemo(() => new Vector3(), []);
  const pointToPoint = useMemo(() => new Vector3(), []);
  const gameMoveToPoint = useAppSelector(
    (state) => state.gameStateReducer.moveToPoint
  );
  const bodySensorRef = useRef<Collider>(null!);
  const handleOnIntersectionEnter = () => {
    isBodyHitWall = true;
  };
  const handleOnIntersectionExit = () => {
    isBodyHitWall = false;
  };

  // Character moving function
  let characterRotated = true;
  const moveCharacter = (
    _: number,
    run: boolean,
    slopeAngle: number,
    movingObjectVelocity: Vector3
  ) => {
    // Setup moving direction
    // Only apply slope angle to moving direction
    // when slope angle is between 0.2rad and slopeMaxAngle
    // and actualSlopeAngle < slopeMaxAngle
    if (
      actualSlopeAngle < slopeMaxAngle &&
      Math.abs(slopeAngle) > 0.2 &&
      Math.abs(slopeAngle) < slopeMaxAngle
    ) {
      movingDirection.set(0, Math.sin(slopeAngle), Math.cos(slopeAngle));
    }
    // If on a slopeMaxAngle sloep, only apply small a mount of forward direction
    else if (actualSlopeAngle >= slopeMaxAngle) {
      movingDirection.set(
        0,
        Math.sin(slopeAngle) > 0 ? 0 : Math.sin(slopeAngle),
        Math.sin(slopeAngle) > 0 ? 0.1 : 1
      );
    } else {
      movingDirection.set(0, 0, 1);
    }

    // Apply character quaternion to moving direction
    movingDirection.applyQuaternion(characterModelIndicator.quaternion);
    // Moving object conditions
    // Calculate moving object velocity direction according to character moving direction
    movingObjectVelocityInCharacterDir
      .copy(movingObjectVelocity)
      .projectOnVector(movingDirection)
      .multiply(movingDirection);
    // Calculate angle between moving object velocity direction and character moving direction
    const angleBetweenCharacterDirAndObjectDir =
      movingObjectVelocity.angleTo(movingDirection);

    // Setup rejection velocity, (currently only work on ground)
    const wantToMoveMeg = currentVel.dot(movingDirection);
    wantToMoveVel.set(
      movingDirection.x * wantToMoveMeg,
      0,
      movingDirection.z * wantToMoveMeg
    );
    rejectVel.copy(currentVel).sub(wantToMoveVel);

    /*
     * Calculate required acceleration and force: a = Δv/Δt
     * If it's on a moving/rotating platform, apply platform to Δv accordingly
     * Also, apply reject velocity when character is moving oppsite of it's direction
     */
    moveAccNeeded.set(
      (movingDirection.x *
        (maxVelLimit * (run ? sprintMult : 1) +
          movingObjectVelocityInCharacterDir.x) -
        (currentVel.x -
          movingObjectVelocity.x *
            Math.sin(angleBetweenCharacterDirAndObjectDir) +
          rejectVel.x * (isOnMovingObject ? 0 : rejectVelMult))) /
        accDeltaTime,
      0,
      (movingDirection.z *
        (maxVelLimit * (run ? sprintMult : 1) +
          movingObjectVelocityInCharacterDir.z) -
        (currentVel.z -
          movingObjectVelocity.z *
            Math.sin(angleBetweenCharacterDirAndObjectDir) +
          rejectVel.z * (isOnMovingObject ? 0 : rejectVelMult))) /
        accDeltaTime
    );

    // Wanted to move force function: F = ma
    const moveForceNeeded = moveAccNeeded.multiplyScalar(
      controllerRef.current
        ? controllerRef.current.mass()
        : characterRef.current.mass()
    );

    /**
     * Check if character complete turned to the wanted direction
     */
    characterRotated =
      Math.sin(characterModelIndicator.rotation.y).toFixed(3) ==
      Math.sin(modelEuler.y).toFixed(3);

    // If character hasn't complete turning, change the impulse quaternion follow characterModelIndicator quaternion
    if (!characterRotated) {
      moveImpulse.set(
        moveForceNeeded.x *
          turnVelMultiplier *
          (canJump ? 1 : airDragMultiplier), // if it's in the air, give it less control
        slopeAngle === null || slopeAngle == 0 // if it's on a slope, apply extra up/down force to the body
          ? 0
          : movingDirection.y *
              turnVelMultiplier *
              (movingDirection.y > 0 // check it is on slope up or slope down
                ? slopeUpExtraForce
                : slopeDownExtraForce) *
              (run ? sprintMult : 1),
        moveForceNeeded.z *
          turnVelMultiplier *
          (canJump ? 1 : airDragMultiplier) // if it's in the air, give it less control
      );
    } else {
      moveImpulse.set(
        moveForceNeeded.x * (canJump ? 1 : airDragMultiplier),
        slopeAngle === null || slopeAngle == 0 // if it's on a slope, apply extra up/down force to the body
          ? 0
          : movingDirection.y *
              (movingDirection.y > 0 // check it is on slope up or slope down
                ? slopeUpExtraForce
                : slopeDownExtraForce) *
              (run ? sprintMult : 1),
        moveForceNeeded.z * (canJump ? 1 : airDragMultiplier)
      );
    }

    // Move character at proper direction and impulse
    controllerRef.current?.applyImpulseAtPoint(
      moveImpulse,
      {
        x: currentPos.x,
        y: currentPos.y + moveImpulsePointY,
        z: currentPos.z,
      },
      true
    );
  };

  /**
   * Character auto balance function
   */
  const autoBalanceCharacter = () => {
    // Match body component to character model rotation on Y
    bodyFacingVec
      .set(0, 0, 1)
      .applyQuaternion(quat(controllerRef.current?.rotation()));
    bodyBalanceVec
      .set(0, 1, 0)
      .applyQuaternion(quat(controllerRef.current?.rotation()));

    bodyBalanceVecOnX.set(0, bodyBalanceVec.y, bodyBalanceVec.z);
    bodyFacingVecOnY.set(bodyFacingVec.x, 0, bodyFacingVec.z);
    bodyBalanceVecOnZ.set(bodyBalanceVec.x, bodyBalanceVec.y, 0);
    // Check if is camera based movement
    if (isCameraBased) {
      modelEuler.y = pivot.rotation.y;
      pivot.getWorldDirection(modelFacingVec);
      // Update slopeRayOrigin to new position
      slopeRayOriginUpdatePosition.set(movingDirection.x, 0, movingDirection.z);
      camBasedMoveCrossVecOnY
        .copy(slopeRayOriginUpdatePosition)
        .cross(modelFacingVec);

      slopeRayOriginRef.current.position.x =
        slopeRayOriginOffset *
        Math.sin(
          slopeRayOriginUpdatePosition.angleTo(modelFacingVec) *
            (camBasedMoveCrossVecOnY.y < 0 ? 1 : -1)
        );
      slopeRayOriginRef.current.position.z =
        slopeRayOriginOffset *
        Math.cos(
          slopeRayOriginUpdatePosition.angleTo(modelFacingVec) *
            (camBasedMoveCrossVecOnY.y < 0 ? 1 : -1)
        );
    } else {
      characterModelIndicator.getWorldDirection(modelFacingVec);
    }
    crossVecOnX.copy(vectorY).cross(bodyBalanceVecOnX);
    crossVecOnY.copy(modelFacingVec).cross(bodyFacingVecOnY);
    crossVecOnZ.copy(vectorY).cross(bodyBalanceVecOnZ);
    const controllerRefCheck = controllerRef.current
      ? controllerRef.current
      : characterRef.current;
    dragAndForce.set(
      (crossVecOnX.x < 0 ? 1 : -1) *
        autoBalanceSpringK *
        bodyBalanceVecOnX.angleTo(vectorY) -
        controllerRefCheck.angvel().x * autoBalanceDampingC,
      (crossVecOnY.y < 0 ? 1 : -1) *
        autoBalanceSpringOnY *
        modelFacingVec.angleTo(bodyFacingVecOnY) -
        controllerRefCheck.angvel().y * autoBalanceDampingOnY,
      (crossVecOnZ.z < 0 ? 1 : -1) *
        autoBalanceSpringK *
        bodyBalanceVecOnZ.angleTo(vectorY) -
        controllerRefCheck.angvel().z * autoBalanceDampingC
    );

    // Applya balance torque impulse
    controllerRefCheck.applyTorqueImpulse(dragAndForce, true);
  };

  /**
   * Character sleep function
   */
  const sleepCharacter = useCallback(() => {
    if (controllerRef.current) {
      if (document.visibilityState === "hidden") {
        controllerRef.current.sleep();
      } else {
        setTimeout(() => {
          controllerRef.current?.wakeUp();
        }, wakeUpDealay);
      }
    }
  }, [wakeUpDealay, controllerRef]);

  /**
   * Point-to-move function
   */
  const pointToMove = (
    delta: number,
    slopeAngle: number,
    movingObjectVelocity: Vector3
  ) => {
    const moveToPoint = gameMoveToPoint;
    if (moveToPoint) {
      pointToPoint.set(
        moveToPoint.x - currentPos.x,
        0,
        moveToPoint.z - currentPos.z
      );
      crossVector.crossVectors(pointToPoint, vectorZ);
      // Rotate character to  moving direction
      modelEuler.y =
        (crossVector.y < 0 ? 1 : -1) * pointToPoint.angleTo(vectorZ);
      // Once character close to the target point (distance < 0.3)
      // Or character close to the wall (bodySensor intersects)
      // stop moving
      if (controllerRef.current) {
        if (pointToPoint.length() > 0.3 && !isBodyHitWall) {
          moveCharacter(delta, false, slopeAngle, movingObjectVelocity);
          isPointMoving = true;
        } else {
          isPointMoving = false;
        }
      }
    }
  };

  useEffect(() => {
    // Initialize directional light
    if (followLight) {
      setDirLight(
        characterModelRef.current.parent?.parent?.children.find((item) => {
          return item.name === "followLight";
        }) as DirectionalLight
      );
    }
  }, [followLight]);

  /**
   * Keyboard controls setup
   */
  // If insdie keyboardcontrols, active keyboard controls

  useEffect(() => {
    // Initialize character facing direction
    modelEuler.y = characterInitDir;
    window.addEventListener("visibilitychange", sleepCharacter);
    window.addEventListener("gamepadconnected", gamepadConnect);
    window.addEventListener("gamepaddisconnected", gamepadDisconnect);
    return () => {
      window.removeEventListener("visibilitychange", sleepCharacter);
      window.removeEventListener("gamepadconnected", gamepadConnect);
      window.removeEventListener("gamepaddisconnected", gamepadDisconnect);
    };
  }, [
    characterInitDir,
    sleepCharacter,
    gamepadConnect,
    gamepadDisconnect,
    modelEuler,
  ]);

  useFrame((state, delta) => {
    if (delta > 1) delta %= 1;
    // Character current position/velocity
    if (controllerRef.current) {
      currentPos.copy(controllerRef.current.translation());
      currentVel.copy(controllerRef.current.linvel());
      // Assign userDate properties
      const characterUserData = controllerRef.current.userData as userDataType;
      characterUserData.canJump = canJump;
      characterUserData.slopeAngle = slopeAngle;
      characterUserData.characterRotated = characterRotated;
      characterUserData.isOnMovingObject = isOnMovingObject;
    }

    /**
     * Apply character position to directional light
     */
    if (followLight && dirLight) {
      dirLight.position.x = currentPos.x + followLightPos.x;
      dirLight.position.y = currentPos.y + followLightPos.y;
      dirLight.position.z = currentPos.z + followLightPos.z;
      dirLight.target = characterModelRef.current;
    }
    /**
     * Getting all gamepad control values
     */
    if (controllerIndex !== null) {
      const gamepad = navigator.getGamepads()[controllerIndex];
      if (gamepad) {
        handleButtons(gamepad.buttons);
        handleSticks(gamepad.axes);
        // Getting moving directions (IIFE)
        modelEuler.y = ((movingDirection) =>
          movingDirection === null ? modelEuler.y : movingDirection)(
          getMovingDirection(
            gamepadKeys.forward,
            gamepadKeys.backward,
            gamepadKeys.leftward,
            gamepadKeys.rightward,
            pivot
          )
        );
      }
    }

    /**
     * Getting all joystick control values
     */
    // Move character to the moving direction (joystick controls)
    if (joystickDis > 0) {
      // Apply camera rotation to character model
      modelEuler.y = pivot.rotation.y + (joystickAng - Math.PI / 2);
      moveCharacter(delta, joystickState, slopeAngle, movingObjectVelocity);
    }

    /**
     * Getting all the useful keys form useKeyboardControls
     */
    const { backward, forward, leftward, rightward, jump, run } =
      isInsideKeyboardControls ? getKeys() : presetKeys;
    // Getting moving directions (IIFE)
    modelEuler.y = ((movingDirection) =>
      movingDirection === null ? modelEuler.y : movingDirection)(
      getMovingDirection(forward, backward, leftward, rightward, pivot)
    );

    // Move character to the moving direction
    if (
      forward ||
      backward ||
      leftward ||
      rightward ||
      gamepadKeys.backward ||
      gamepadKeys.forward ||
      gamepadKeys.leftward ||
      gamepadKeys.rightward
    ) {
      moveCharacter(delta, run, slopeAngle, movingObjectVelocity);
    }

    // Jump impulse
    if ((jump || pressedButton1) && canJump) {
      jumpVelocityVec.set(
        currentVel.x,
        run ? sprintJumpMult * jumpVel : jumpVel,
        currentVel.z
      );
      controllerRef.current?.setLinvel(
        jumpDirection.set(
          0,
          (run ? sprintJumpMult * jumpVel : jumpVel) * slopJumpMult,
          0
        ),
        true
      );
      // Apply jump force downward to the standing platform
      characterMassForce.y *= jumpForceToGroundMult;
      rayHit?.collider
        .parent()
        ?.applyImpulseAtPoint(characterMassForce, standingForcePoint, true);
    }

    // Rotate character Indicitor
    modelQuat.setFromEuler(modelEuler);
    characterModelIndicator.quaternion.rotateTowards(
      modelQuat,
      delta * turnSpeed
    );

    // If autobalance is off, rotate chracter model itself
    if (!autoBalance) {
      if (isCameraBased) {
        characterModelRef.current.quaternion.copy(pivot.quaternion);
      } else {
        characterModelRef.current.quaternion.copy(
          characterModelIndicator.quaternion
        );
      }
    }

    /**
     * Camera movement
     */
    pivotPosition.set(
      currentPos.x + camTargetPos.x,
      currentPos.y + (camTargetPos.y || capsuleHalfHeight + capsuleRadius / 2),
      currentPos.z + camTargetPos.z
    );
    pivot.position.lerp(pivotPosition, 1 - Math.exp(-camFollowMult * delta));
    !disableFollowCam && state.camera.lookAt(pivot.position);
    /**
     * Rac casting detect if on ground
     */
    rayOrigin.addVectors(currentPos, rayOriginOffset);
    rayHit = world.castRay(
      rayCast,
      rayLength,
      true,
      // this exclude sensor
      16,
      undefined,
      undefined,
      controllerRef.current ? controllerRef.current : characterRef.current,
      // this exclude any collider with userData: excludeContollerRay
      (collider: Collider) =>
        (collider.parent()?.userData as userDataType) &&
        !(collider.parent()?.userData as userDataType).excludeControllerRay
    );
    /** Test shape ray */
    /*  rayHit = world.castShape(
      currentPos,
      { w: 0, x: 0, y: 0, z: 0 },
      { x: 0, y: -1, z: 0 },
      shape,
      rayLength,
      true,
      null,
      null,
      characterRef.current
    ); */

    if (rayHit && rayHit.toi < floatingDis + rayHitForgiveness) {
      if (slopeRayHit && actualSlopeAngle < slopeMaxAngle) {
        canJump = true;
      }
    } else {
      canJump = false;
    }
    /**
     * Ray detect if on rigid body or dynamic platform, then apply the linear velocity and angular velocity to character
     */
    if (rayHit && canJump) {
      if (rayHit.collider.parent()) {
        // Getting the standing force apply point
        standingForcePoint.set(
          rayOrigin.x,
          rayOrigin.y - rayHit.toi,
          rayOrigin.z
        );
        const rayHitObjectBodyType = rayHit.collider.parent()?.bodyType();
        const rayHitObjectBodyMass = rayHit.collider.parent()?.mass();
        massRatio =
          characterRef.current.mass() /
          (rayHitObjectBodyMass ? rayHitObjectBodyMass : 1);
        // Body type 0 is rigid body, body type 1 is fixed body, body type 2 is kinematic body
        if (rayHitObjectBodyType === 0 || rayHitObjectBodyType === 2) {
          isOnMovingObject = true;
          // Calculate distance between character and moving object
          distanceFromCharacterToObject
            .copy(currentPos)
            .sub(rayHit.collider.parent()?.translation() as THREE.Vector3);
          // Moving object linear velocity
          const movingObjectLinvel = rayHit.collider
            .parent()
            ?.linvel() as Vector3;
          // Moving object angular velocity
          const movingObjectAngvel = rayHit.collider
            .parent()
            ?.angvel() as THREE.Vector3;
          // Combine object linear velocity and angular velocity to movingObjectVelocity
          movingObjectVelocity
            .set(
              movingObjectLinvel.x +
                objectAngelToLinvel.crossVectors(
                  movingObjectAngvel,
                  distanceFromCharacterToObject
                ).x,
              movingObjectLinvel.y,
              movingObjectLinvel.z +
                objectAngelToLinvel.crossVectors(
                  movingObjectAngvel,
                  distanceFromCharacterToObject
                ).z
            )
            .multiplyScalar(Math.min(1, 1 / massRatio));
          // If the velocity diff is too high (> 30), ignore movingObjectVelocity
          velocityDiff.subVectors(movingObjectVelocity, currentVel);
          if (velocityDiff.length() > 30)
            movingObjectVelocity.multiplyScalar(1 / velocityDiff.length());

          // Apply opposite drage force to the stading rigid body, body type 0
          // Character moving and unmoving should provide different drag force to the platform
          if (rayHitObjectBodyType === 0) {
            if (
              !forward &&
              !backward &&
              !leftward &&
              !rightward &&
              canJump &&
              joystickDis === 0 &&
              !isPointMoving &&
              !gamepadKeys.forward &&
              !gamepadKeys.backward &&
              !gamepadKeys.leftward &&
              !gamepadKeys.rightward
            ) {
              movingObjectDragForce
                .copy(bodyContactForce)
                .multiplyScalar(delta)
                .multiplyScalar(Math.min(1, 1 / massRatio)) // Scale up/down base on different masses ratio
                .negate();
              bodyContactForce.set(0, 0, 0);
            } else {
              movingObjectDragForce
                .copy(moveImpulse)
                .multiplyScalar(Math.min(1, 1 / massRatio)) // Scale up/down base on different masses ratio
                .negate();
            }
            rayHit.collider
              .parent()
              ?.applyImpulseAtPoint(
                movingObjectDragForce,
                standingForcePoint,
                true
              );
          }
        } else {
          // on fixed body
          massRatio = 1;
          isOnMovingObject = false;
          bodyContactForce.set(0, 0, 0);
          movingObjectVelocity.set(0, 0, 0);
        }
      }
    } else {
      // in the air
      massRatio = 1;
      isOnMovingObject = false;
      bodyContactForce.set(0, 0, 0);
      movingObjectVelocity.set(0, 0, 0);
    }
    /**
     * Slope ray casting detect if on slope
     */
    slopeRayOriginRef.current.getWorldPosition(slopeRayOrigin);
    slopeRayOrigin.y = rayOrigin.y;
    slopeRayHit = world.castRay(
      slopeRayCast,
      slopeRayLength,
      true,
      16,
      undefined,
      undefined,
      controllerRef.current ? controllerRef.current : characterRef.current,
      (collider: Collider) =>
        (collider.parent()?.userData as userDataType) &&
        !(collider.parent()?.userData as userDataType).excludeControllerRay
    );
    // Calculate slope angle
    if (slopeRayHit) {
      actualSlopeNormal = slopeRayHit.collider.castRayAndGetNormal(
        slopeRayCast,
        slopeRayLength,
        false
      )?.normal;
      if (actualSlopeNormal) {
        const { x, y, z } = actualSlopeNormal;
        actualSlopeNormalVec?.set(x, y, z);
        actualSlopeAngle = actualSlopeNormalVec?.angleTo(floorNormal);
      }
    }
    if (slopeRayHit && rayHit && slopeRayHit.toi < floatingDis + 0.5) {
      if (canJump) {
        // Round the slope angle to 2 decimal
        slopeAngle = Number(
          (
            Math.atan(rayHit.toi - slopeRayHit.toi) / slopeRayOriginOffset
          ).toFixed(2)
        );
      } else {
        slopeAngle = 0;
      }
    } else {
      slopeAngle = 0;
    }

    /**
     * Applay floating force
     */
    if (rayHit != null) {
      if (canJump && rayHit.collider.parent()) {
        const controllerRefCheck = controllerRef.current
          ? controllerRef.current
          : characterRef.current;
        floatingForce =
          springK * (floatingDis - rayHit.toi) -
          controllerRefCheck.linvel().y * dampingC;
        controllerRefCheck.applyImpulse(
          springDirVec.set(0, floatingForce, 0),
          false
        );
        // Apply opposite force to standing object (gravity g in rapier is 0.11 ?_?)
        characterMassForce.set(0, floatingForce > 0 ? -floatingForce : 0, 0);
        rayHit.collider
          .parent()
          ?.applyImpulseAtPoint(characterMassForce, standingForcePoint, true);
      }
    }

    /**
     * Apply drag force if it's not moving
     */
    if (
      !forward &&
      !backward &&
      !leftward &&
      !rightward &&
      canJump &&
      joystickDis === 0 &&
      !isPointMoving &&
      !gamepadKeys.forward &&
      !gamepadKeys.backward &&
      !gamepadKeys.leftward &&
      !gamepadKeys.rightward
    ) {
      // not on a moving object
      if (!isOnMovingObject) {
        dragForce.set(
          -currentVel.x * dragDampingC,
          0,
          -currentVel.z * dragDampingC
        );
        controllerRef.current?.applyImpulse(dragForce, false);
      }
    } else {
      // on a moving object
      dragForce.set(
        (movingObjectVelocity.x - currentVel.x) * dragDampingC,
        0,
        (movingObjectVelocity.z - currentVel.z) * dragDampingC
      );
      controllerRef.current?.applyImpulse(dragForce, true);
    }
    /**
     * Detect character falling state
     */
    isFalling = currentVel.y < 0 && !canJump ? true : false;
    /**
     * Setup max falling speed && extra falling gravity
     * Remove gravity is falling speed higher than fallingMaxVel (negetive number so use "<")
     */
    if (controllerRef.current) {
      if (currentVel.y < fallingMaxVel) {
        if (controllerRef.current.gravityScale() !== 0) {
          controllerRef.current.setGravityScale(0, true);
        }
      } else {
        if (
          !isFalling &&
          controllerRef.current.gravityScale() !== initialGravityScale
        ) {
          // Apply initial gravity after landed
          controllerRef.current.setGravityScale(initialGravityScale, true);
        } else if (
          isFalling &&
          controllerRef.current.gravityScale() !== fallingGravityScale
        ) {
          // Apply larger gravity when falling (if initialGravityScale === fallingGravityScale, won't trigger this)
          controllerRef.current.setGravityScale(fallingGravityScale, true);
        }
      }
    }

    /**
     * Apply auto balance force to the character
     */
    if (autoBalance && controllerRef.current) autoBalanceCharacter();

    /**
     * Camera collision detect
     */
    camCollision && cameraCollisionDetect(delta);

    /**
     * Point-to-move feature
     */
    isModePointToMove && pointToMove(delta, slopeAngle, movingObjectVelocity);

    /**
     * Apply all the animations
     */
    if (animated) {
      if (
        !forward &&
        !backward &&
        !leftward &&
        !rightward &&
        !jump &&
        !pressedButton1 &&
        joystickDis === 0 &&
        !isPointMoving &&
        !gamepadKeys.forward &&
        !gamepadKeys.backward &&
        !gamepadKeys.leftward &&
        !gamepadKeys.rightward &&
        canJump
      ) {
        dispatch(idleAnimation(animationSet.idle));
      } else if ((jump || pressedButton1) && canJump) {
        dispatch(jumpAnimation(animationSet.jump));
      } else if (
        canJump &&
        (forward ||
          backward ||
          leftward ||
          rightward ||
          joystickDis > 0 ||
          isPointMoving ||
          gamepadKeys.forward ||
          gamepadKeys.backward ||
          gamepadKeys.leftward ||
          gamepadKeys.rightward)
      ) {
        run || curRunState
          ? dispatch(runAnimation(animationSet.run))
          : dispatch(walkAnimation(animationSet.walk));
      } else if (!canJump) {
        dispatch(jumpIdleAnimation(animationSet.jumpIdle));
      }
      // On high sky plya falling animation
      if (rayHit === null && isFalling) {
        dispatch(fallAnimation(animationSet.fall));
      }
    }
  });
  return (
    <RigidBody
      colliders={false}
      ref={controllerRef}
      position={props.position || [0, 5, 0]}
      friction={props.friction || 0.5}
      onContactForce={(e) =>
        bodyContactForce.set(e.totalForce.x, e.totalForce.y, e.totalForce.z)
      }
      onCollisionExit={() => bodyContactForce.set(0, 0, 0)}
      userData={{ canJump: false }}
      {...props}
    >
      <CapsuleCollider
        name="character-capsule-collider"
        args={[capsuleHalfHeight, capsuleRadius]}
      />
      {/* Body collide sensor (only for point to move mode) */}
      {isModePointToMove && (
        <CylinderCollider
          ref={bodySensorRef}
          sensor
          args={[capsuleHalfHeight / 2, capsuleRadius]}
          position={[0, 0, capsuleRadius / 2]}
          onIntersectionEnter={handleOnIntersectionEnter}
          onIntersectionExit={handleOnIntersectionExit}
        />
      )}
      <group ref={characterModelRef} userData={{ camExcludeCollision: true }}>
        {/* this mesh is used for positioning the slope ray origin */}
        <mesh
          position={[
            rayOriginOffset.x,
            rayOriginOffset.y,
            rayOriginOffset.z + slopeRayOriginOffset,
          ]}
          ref={slopeRayOriginRef}
          visible={showSlopeRayOrigin}
          userData={{ camExcludeCollision: true }} // this won't be detected by camera collision
        >
          <boxGeometry args={[0.15, 0.15, 0.15]} />
        </mesh>
        {/* Character model */}
        {children}
      </group>
    </RigidBody>
  );
};

export default forwardRef(Controller);
