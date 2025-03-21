import { ReactNode, useMemo, useRef, useState } from "react";
import {
  CapsuleCollider,
  quat,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { Euler, Group, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import useFollowCam from "./useFollowCamera";
import { useKeyboardControls } from "@react-three/drei";
import { getPivotMovingDirection } from "@/services/three-js/game.utils";
import {
  QueryFilterFlags,
  RayColliderHit,
  Vector,
} from "@dimforge/rapier3d-compat";
import { useDispatch } from "react-redux";
import {
  fall as fallAnimation,
  idle as idleAnimation,
  jumpIdle as jumpIdleAnimation,
  walk as walkAnimation,
  run as runAnimation,
  jump as jumpAnimation,
  onMove,
  setOnGround,
} from "@/lib/store/features/character-contoller/game-state.slice";

export enum ActionName {
  Idle = "Idle",
  Jump = "Jump",
  Run = "Run",
  Walk = "Walking",
  JumpUp = "JumpUp",
  JumpIdle = "JumpIdle",
  JumpLand = "JumpLand",
}

export interface userDataType {
  canJump?: boolean;
  slopeAngle?: number | null;
  characterRotated?: boolean;
  isOnMovingObject?: boolean;
  excludeEcctrlRay?: boolean;
}

interface CharacterControllerProps {
  children: ReactNode;
  capsuleHalfHeight?: number;
  capsuleRadius?: number;
  rayOriginOffest?: { x: number; y: number; z: number };
  slopeRayOriginOffest?: number;
  showSlopeRayOrigin?: boolean;
  camTargetPos?: { x: number; y: number; z: number };
  camFollowMult?: number;
  slopeMaxAngle?: number;
  maxVelLimit?: number;
  sprintMult?: number;
  rejectVelMult?: number;
  accDeltaTime?: number;
  turnVelMultiplier?: number;
  airDragMultiplier?: number;
  slopeUpExtraForce?: number;
  slopeDownExtraForce?: number;
  moveImpulsePointY?: number;
  sprintJumpMult?: number;
  jumpVel?: number;
  slopJumpMult?: number;
  jumpForceToGroundMult?: number;
  rayDir?: { x: number; y: number; z: number };
  rayLength?: number;
  turnSpeed?: number;
  autoBalance?: boolean;
  floatHeight?: number;
  floatingDis?: number;
  rayHitForgiveness?: number;
  slopeRayDir?: { x: number; y: number; z: number };
  slopeRayLength?: number;
  springK?: number;
  dampingC?: number;
  dragDampingC?: number;
  fallingMaxVel?: number;
  fallingGravityScale?: number;
  autoBalanceSpringK?: number;
  autoBalanceDampingC?: number;
  autoBalanceSpringOnY?: number;
  autoBalanceDampingOnY?: number;
  disableFollowCam?: boolean;
  camLerpMult?: number;
  animated?: boolean;
}

export interface CustomControllerRigidBody extends RapierRigidBody {
  rotateCamera?: (x: number, y: number) => void;
  rotateCharacterOnY?: (rad: number) => void;
}

const CharacterController = ({
  capsuleHalfHeight = 0.35,
  capsuleRadius = 0.3,
  rayOriginOffest = { x: 0, y: -capsuleHalfHeight, z: 0 },
  slopeRayOriginOffest = capsuleRadius - 0.03,
  showSlopeRayOrigin = false,
  camTargetPos = { x: 0, y: 0, z: 0 },
  camFollowMult = 11,
  slopeMaxAngle = 1,
  maxVelLimit = 2.5,
  sprintMult = 2,
  rejectVelMult = 4,
  accDeltaTime = 8,
  turnVelMultiplier = 0.2,
  airDragMultiplier = 0.2,
  slopeUpExtraForce = 0.1,
  slopeDownExtraForce = 0.2,
  moveImpulsePointY = 0.5,
  sprintJumpMult = 1.2,
  jumpVel = 4,
  slopJumpMult = 0.25,
  jumpForceToGroundMult = 5,
  rayDir = { x: 0, y: -1, z: 0 },
  rayLength = capsuleRadius + 2,
  turnSpeed = 15,
  autoBalance = true,
  floatHeight = 0,
  floatingDis = capsuleRadius + floatHeight,
  rayHitForgiveness = 0.1,
  slopeRayDir = { x: 0, y: -1, z: 0 },
  springK = 1.2,
  slopeRayLength = capsuleRadius + 3,
  dampingC = 0.08,
  dragDampingC = 0.15,
  fallingMaxVel = -20,
  fallingGravityScale = 2.5,
  autoBalanceSpringK = 0.3,
  autoBalanceDampingC = 0.03,
  autoBalanceSpringOnY = 0.5,
  autoBalanceDampingOnY = 0.015,
  disableFollowCam = false,
  camLerpMult = 25,
  animated = true,
  children,
}: CharacterControllerProps) => {
  const dispatch = useDispatch();
  const [animation, setAnimation] = useState(ActionName.Idle);
  const characterRef = useRef<CustomControllerRigidBody>(null!);
  const characterModelRef = useRef<Group>(null!);
  const characterModelIndicator: Object3D = useMemo(() => new Object3D(), []);
  const [, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  //   Body collider setup
  const bodyContactForce: Vector3 = useMemo(() => new Vector3(), []);
  // Slope detection ray setup
  let actualSlopeNormal: Vector | undefined;

  const floorNormal: Vector3 = useMemo(() => new Vector3(0, 1, 0), []);
  const slopeRayOriginRef = useRef<Mesh>(null!);
  let actualSlopeAngle: number = 0;
  let slopeAngle: number = 0;
  const actualSlopeNormalVec: Vector3 = useMemo(() => new Vector3(), []);
  let slopeRayHit: RayColliderHit | null = null;
  const slopeRayorigin: Vector3 = useMemo(() => new Vector3(), []);
  const slopeRayCast = new rapier.Ray(slopeRayorigin, slopeRayDir);
  // Load camera pivot and character move preset
  const modelEuler: Euler = useMemo(() => new Euler(), []);
  const currentPos: Vector3 = useMemo(() => new Vector3(), []);
  const moveImpulse: Vector3 = useMemo(() => new Vector3(), []);
  const currentVel: Vector3 = useMemo(() => new Vector3(), []);
  const pivotPosition: Vector3 = useMemo(() => new Vector3(), []);
  const jumpVelocityVec: Vector3 = useMemo(() => new Vector3(), []);
  const pivotXAxis: Vector3 = useMemo(() => new Vector3(1, 0, 0), []);
  const pivotYAxis: Vector3 = useMemo(() => new Vector3(1, 0, 0), []);
  const pivotZAxis: Vector3 = useMemo(() => new Vector3(1, 0, 0), []);
  const movingDirection: Vector3 = useMemo(() => new Vector3(), []);
  const jumpDirection: Vector3 = useMemo(() => new Vector3(), []);
  const wantToMoveVel: Vector3 = useMemo(() => new Vector3(), []);
  const rejectVel: Vector3 = useMemo(() => new Vector3(), []);
  const moveAccNeeded: Vector3 = useMemo(() => new Vector3(), []);
  const modelQuat: Quaternion = useMemo(() => new Quaternion(), []);
  const dragForce: Vector3 = useMemo(() => new Vector3(), []);
  const dragAngForce: Vector3 = useMemo(() => new Vector3(), []);
  const followCamPosition: Vector3 = useMemo(() => new Vector3(), []);
  const { pivot, followCam, cameraCollisionDetect } = useFollowCam({
    camInitDis: -5,
    camMaxDis: -7,
    camMinDis: -0.7,
    camUpLimit: 0.5,
    camLowLimit: -1.3,
    camInitDir: { x: 0, y: 0 },
    camMoveSpeed: 1,
    camZoomSpeed: 1,
    camCollisionOffset: 0.7,
    camCollisionSpeedMult: 4,
  });
  let canJump: boolean = false;
  let isFalling: boolean = false;
  const initialGravityScale: number = useMemo(() => 1, []);
  // on moving object setup
  let isOnMovingObject: boolean = false;
  let massRatio: number = 1;
  const movingObjectVelocityInCharacterDir: Vector3 = useMemo(
    () => new Vector3(),
    []
  );
  const objectAngvelToLinvel: Vector3 = useMemo(() => new Vector3(), []);
  const velocityDiff: Vector3 = useMemo(() => new Vector3(), []);
  const distanceFromCharacterToObject: Vector3 = useMemo(
    () => new Vector3(),
    []
  );
  const standingForcePoint: Vector3 = useMemo(() => new Vector3(), []);
  const movingObjectVelocity: Vector3 = useMemo(() => new Vector3(), []);
  const movingObjectDragForce: Vector3 = useMemo(() => new Vector3(), []);
  // Character moving function
  let characterRotated: boolean = true;
  // Floating ray setup
  let floatingForce = null;
  const springDirVec: Vector3 = useMemo(() => new Vector3(), []);
  const characterMassForce: Vector3 = useMemo(() => new Vector3(), []);
  let rayHit: RayColliderHit | null = null;
  const rayOrigin: Vector3 = useMemo(() => new Vector3(), []);
  const rayCast = new rapier.Ray(rayOrigin, rayDir);
  // Body collider setup
  const modelFacingVec: Vector3 = useMemo(() => new Vector3(), []);
  const bodyFacingVec: Vector3 = useMemo(() => new Vector3(), []);
  const bodyBalanceVec: Vector3 = useMemo(() => new Vector3(), []);
  const bodyBalanceVecOnX: Vector3 = useMemo(() => new Vector3(), []);
  const bodyFacingVecOnY: Vector3 = useMemo(() => new Vector3(), []);
  const bodyBalanceVecOnZ: Vector3 = useMemo(() => new Vector3(), []);
  const slopeRayOriginUpdatePosition: Vector3 = useMemo(
    () => new Vector3(),
    []
  );
  const camBasedMoveCrossVecOnY: Vector3 = useMemo(() => new Vector3(), []);
  const crossVecOnX: Vector3 = useMemo(() => new Vector3(), []);
  const crossVecOnY: Vector3 = useMemo(() => new Vector3(), []);
  const crossVecOnZ: Vector3 = useMemo(() => new Vector3(), []);
  const vectorY: Vector3 = useMemo(() => new Vector3(0, 1, 0), []);
  // Mode setup
  let isModeCameraBased: boolean = false;
  const moveCharacter = (
    _: number,
    run: boolean,
    slopeAngle: number,
    movingObjectVelocity: Vector3
  ) => {
    /**
     * Setup moving direction
     */
    // Only apply slope angle to moving direction
    // when slope angle is between 0.2rad and slopeMaxAngle,
    // and actualSlopeAngle < slopeMaxAngle
    if (
      actualSlopeAngle &&
      actualSlopeAngle < slopeMaxAngle &&
      Math.abs(slopeAngle) > 0.2 &&
      Math.abs(slopeAngle) < slopeMaxAngle
    ) {
      movingDirection.set(0, Math.sin(slopeAngle), Math.cos(slopeAngle));
    }
    // If on a slopeMaxAngle slope, only apply small a mount of forward direction
    else if (actualSlopeAngle && actualSlopeAngle >= slopeMaxAngle) {
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

    /**
     * Moving object conditions
     */
    // Calculate moving object velocity direction according to character moving direction
    movingObjectVelocityInCharacterDir
      .copy(movingObjectVelocity)
      .projectOnVector(movingDirection)
      .multiply(movingDirection);
    // Calculate angle between moving object velocity direction and character moving direction
    const angleBetweenCharacterDirAndObjectDir =
      movingObjectVelocity.angleTo(movingDirection);

    /**
     * Setup rejection velocity, (currently only work on ground)
     */
    const wantToMoveMeg = currentVel.dot(movingDirection);
    wantToMoveVel.set(
      movingDirection.x * wantToMoveMeg,
      0,
      movingDirection.z * wantToMoveMeg
    );
    rejectVel.copy(currentVel).sub(wantToMoveVel);

    /**
     * Calculate required accelaration and force: a = Δv/Δt
     * If it's on a moving/rotating platform, apply platform velocity to Δv accordingly
     * Also, apply reject velocity when character is moving opposite of it's moving direction
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
      characterRef.current.mass()
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
    }
    // If character complete turning, change the impulse quaternion default
    else {
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
    characterRef.current.applyImpulseAtPoint(
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
      .applyQuaternion(quat(characterRef.current.rotation()));
    bodyBalanceVec
      .set(0, 1, 0)
      .applyQuaternion(quat(characterRef.current.rotation()));

    bodyBalanceVecOnX.set(0, bodyBalanceVec.y, bodyBalanceVec.z);
    bodyFacingVecOnY.set(bodyFacingVec.x, 0, bodyFacingVec.z);
    bodyBalanceVecOnZ.set(bodyBalanceVec.x, bodyBalanceVec.y, 0);

    // Check if is camera based movement
    if (isModeCameraBased) {
      modelEuler.y = pivot.rotation.y;
      pivot.getWorldDirection(modelFacingVec);
      // Update slopeRayOrigin to new positon
      slopeRayOriginUpdatePosition.set(movingDirection.x, 0, movingDirection.z);
      camBasedMoveCrossVecOnY
        .copy(slopeRayOriginUpdatePosition)
        .cross(modelFacingVec);
      slopeRayOriginRef.current.position.x =
        slopeRayOriginOffest *
        Math.sin(
          slopeRayOriginUpdatePosition.angleTo(modelFacingVec) *
            (camBasedMoveCrossVecOnY.y < 0 ? 1 : -1)
        );
      slopeRayOriginRef.current.position.z =
        slopeRayOriginOffest *
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

    dragAngForce.set(
      (crossVecOnX.x < 0 ? 1 : -1) *
        autoBalanceSpringK *
        bodyBalanceVecOnX.angleTo(vectorY) -
        characterRef.current.angvel().x * autoBalanceDampingC,
      (crossVecOnY.y < 0 ? 1 : -1) *
        autoBalanceSpringOnY *
        modelFacingVec.angleTo(bodyFacingVecOnY) -
        characterRef.current.angvel().y * autoBalanceDampingOnY,
      (crossVecOnZ.z < 0 ? 1 : -1) *
        autoBalanceSpringK *
        bodyBalanceVecOnZ.angleTo(vectorY) -
        characterRef.current.angvel().z * autoBalanceDampingC
    );

    // Apply balance torque impulse
    characterRef.current.applyTorqueImpulse(dragAngForce, true);
  };

  useFrame((state, delta) => {
    if (delta > 1) delta %= 1;

    // Character current position/velocity
    if (characterRef.current) {
      currentPos.copy(characterRef.current.translation() as Vector3);
      currentVel.copy(characterRef.current.linvel() as Vector3);
      // Assign userDate properties
      (characterRef.current.userData as userDataType).canJump = canJump;
      (characterRef.current.userData as userDataType).slopeAngle = slopeAngle;
      (characterRef.current.userData as userDataType).characterRotated =
        characterRotated;
      (characterRef.current.userData as userDataType).isOnMovingObject =
        isOnMovingObject;
    }
    // Camera movement
    pivotXAxis.set(1, 0, 0);
    pivotXAxis.applyQuaternion(pivot.quaternion);
    pivotZAxis.set(0, 0, 1);
    pivotZAxis.applyQuaternion(pivot.quaternion);
    pivotPosition
      .copy(currentPos)
      .addScaledVector(pivotXAxis, camTargetPos.x)
      .addScaledVector(
        pivotYAxis,
        camTargetPos.y + (capsuleHalfHeight + capsuleRadius / 2)
      )
      .addScaledVector(pivotZAxis, camTargetPos.z);
    pivot.position.lerp(pivotPosition, 1 - Math.exp(-camFollowMult * delta));

    if (!disableFollowCam) {
      followCam.getWorldPosition(followCamPosition);
      state.camera.position.lerp(
        followCamPosition,
        1 - Math.exp(-camLerpMult * delta)
      );
      state.camera.lookAt(pivot.position);
    }

    cameraCollisionDetect(delta);
    // Move character to the moving direction
    const { forward, backward, leftward, rightward, run, jump } = getKeys();
    // Getting moving directions (IIFE)
    modelEuler.y = ((movingDirection) =>
      movingDirection === null ? modelEuler.y : movingDirection)(
      getPivotMovingDirection(forward, backward, leftward, rightward, pivot)
    );
    if (forward || backward || leftward || rightward) {
      moveCharacter(delta, run, slopeAngle, movingObjectVelocity);
      dispatch(
        onMove({
          x: currentPos.x,
          y: currentPos.y - capsuleHalfHeight - capsuleRadius,
          z: currentPos.z,
        })
      );
    }

    rayOrigin.addVectors(currentPos, rayOriginOffest as Vector3);
    rayHit = world.castRay(
      rayCast,
      rayLength,
      false,
      QueryFilterFlags.EXCLUDE_SENSORS,
      undefined,
      undefined,
      characterRef.current,
      // this exclude any collider with userData: excludeEcctrlRay
      (collider: any) =>
        collider.parent().userData &&
        !(collider.parent().userData as userDataType).excludeEcctrlRay
    );

    // Jump impulse
    if (jump && canJump) {
      // characterRef.current.applyImpulse(jumpDirection.set(0, 0.5, 0), true);
      jumpVelocityVec.set(
        currentVel.x,
        run ? sprintJumpMult * jumpVel : jumpVel,
        currentVel.z
      );
      // Apply slope normal to jump direction
      characterRef.current.setLinvel(
        jumpDirection
          .set(0, (run ? sprintJumpMult * jumpVel : jumpVel) * slopJumpMult, 0)
          .projectOnVector(actualSlopeNormalVec)
          .add(jumpVelocityVec),
        true
      );
      // Apply jump force downward to the standing platform
      characterMassForce.y *= jumpForceToGroundMult;
      rayHit?.collider
        .parent()
        ?.applyImpulseAtPoint(characterMassForce, standingForcePoint, true);
    }

    // Rotate character Indicator
    modelQuat.setFromEuler(modelEuler);
    characterModelIndicator.quaternion.rotateTowards(
      modelQuat,
      delta * turnSpeed
    );

    // If autobalance is off, rotate character model itself
    if (!autoBalance) {
      if (isModeCameraBased) {
        characterModelRef.current.quaternion.copy(pivot.quaternion);
      } else {
        characterModelRef.current.quaternion.copy(
          characterModelIndicator.quaternion
        );
      }
    }

    if (rayHit && rayHit.timeOfImpact < floatingDis + rayHitForgiveness) {
      dispatch(setOnGround(true));
      if (slopeRayHit && actualSlopeAngle < slopeMaxAngle) {
        canJump = true;
      }
    } else {
      dispatch(setOnGround(false));
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
          rayOrigin.y - rayHit.timeOfImpact,
          rayOrigin.z
        );
        if (!rayHit.collider.parent()) return;
        const rayHitObjectBodyType = rayHit?.collider.parent()?.bodyType();
        const rayHitObjectBodyMass = rayHit?.collider.parent()?.mass();
        if (rayHitObjectBodyMass) {
          massRatio = characterRef.current.mass() / rayHitObjectBodyMass;
        }
        // Body type 0 is rigid body, body type 1 is fixed body, body type 2 is kinematic body
        if (rayHitObjectBodyType === 0 || rayHitObjectBodyType === 2) {
          isOnMovingObject = true;
          // Calculate distance between character and moving object

          distanceFromCharacterToObject
            .copy(currentPos)
            .sub(rayHit.collider.parent()?.translation() as Vector3);
          // Moving object linear velocity
          const movingObjectLinvel = rayHit.collider
            .parent()
            ?.linvel() as Vector3;
          // Moving object angular velocity
          const movingObjectAngvel = rayHit.collider
            .parent()
            ?.angvel() as Vector3;
          // Combine object linear velocity and angular velocity to movingObjectVelocity
          movingObjectVelocity
            .set(
              movingObjectLinvel.x +
                objectAngvelToLinvel.crossVectors(
                  movingObjectAngvel,
                  distanceFromCharacterToObject
                ).x,
              movingObjectLinvel.y,
              movingObjectLinvel.z +
                objectAngvelToLinvel.crossVectors(
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
            if (!forward && !backward && !leftward && !rightward && canJump) {
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
    slopeRayOriginRef.current.getWorldPosition(slopeRayorigin);
    slopeRayorigin.y = rayOrigin.y;
    slopeRayHit = world.castRay(
      slopeRayCast,
      slopeRayLength,
      false,
      QueryFilterFlags.EXCLUDE_SENSORS,
      undefined,
      undefined,
      characterRef.current,
      // this exclude any collider with userData: excludeEcctrlRay
      (collider: any) =>
        collider.parent().userData &&
        !(collider.parent().userData as userDataType).excludeEcctrlRay
    );

    // Calculate slope angle
    if (slopeRayHit) {
      actualSlopeNormal = slopeRayHit.collider.castRayAndGetNormal(
        slopeRayCast,
        slopeRayLength,
        false
      )?.normal;
      if (actualSlopeNormal) {
        actualSlopeNormalVec?.set(
          actualSlopeNormal.x,
          actualSlopeNormal.y,
          actualSlopeNormal.z
        );
        actualSlopeAngle = actualSlopeNormalVec?.angleTo(floorNormal);
      }
    }
    if (slopeRayHit && rayHit && slopeRayHit.timeOfImpact < floatingDis + 0.5) {
      if (canJump) {
        // Round the slope angle to 2 decimal places
        slopeAngle = Number(
          Math.atan(
            (rayHit.timeOfImpact - slopeRayHit.timeOfImpact) /
              slopeRayOriginOffest
          ).toFixed(2)
        );
      } else {
        slopeAngle = 0;
      }
    } else {
      slopeAngle = 0;
    }

    /**
     * Apply floating force
     */
    if (rayHit != null) {
      if (canJump && rayHit.collider.parent()) {
        floatingForce =
          springK * (floatingDis - rayHit.timeOfImpact) -
          characterRef.current.linvel().y * dampingC;
        characterRef.current.applyImpulse(
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
    if (!forward && !backward && !leftward && !rightward && canJump) {
      // not on a moving object
      if (!isOnMovingObject) {
        dragForce.set(
          -currentVel.x * dragDampingC,
          0,
          -currentVel.z * dragDampingC
        );
        characterRef.current.applyImpulse(dragForce, false);
      }
      // on a moving object
      else {
        dragForce.set(
          (movingObjectVelocity.x - currentVel.x) * dragDampingC,
          0,
          (movingObjectVelocity.z - currentVel.z) * dragDampingC
        );
        characterRef.current.applyImpulse(dragForce, true);
      }
    }

    /**
     * Detect character falling state
     */
    isFalling = currentVel.y < 0 && !canJump ? true : false;

    /**
     * Setup max falling speed && extra falling gravity
     * Remove gravity if falling speed higher than fallingMaxVel (negetive number so use "<")
     */
    if (characterRef.current) {
      if (currentVel.y < fallingMaxVel) {
        if (characterRef.current.gravityScale() !== 0) {
          characterRef.current.setGravityScale(0, true);
        }
      } else {
        if (
          !isFalling &&
          characterRef.current.gravityScale() !== initialGravityScale
        ) {
          // Apply initial gravity after landed
          characterRef.current.setGravityScale(initialGravityScale, true);
        } else if (
          isFalling &&
          characterRef.current.gravityScale() !== fallingGravityScale
        ) {
          // Apply larger gravity when falling (if initialGravityScale === fallingGravityScale, won't trigger this)
          characterRef.current.setGravityScale(fallingGravityScale, true);
        }
      }
    }
    /**
     * Apply auto balance force to the character
     */
    if (autoBalance && characterRef.current) autoBalanceCharacter();

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
        canJump
      ) {
        dispatch(idleAnimation());
      } else if (jump && canJump) {
        dispatch(jumpAnimation());
      } else if (canJump && (forward || backward || leftward || rightward)) {
        run ? dispatch(runAnimation()) : dispatch(walkAnimation());
      } else if (!canJump) {
        dispatch(jumpIdleAnimation());
      }
      // On high sky, play falling animation
      if (rayHit == null && isFalling) {
        dispatch(fallAnimation());
      }
    }
  });

  return (
    <RigidBody
      colliders={false}
      ref={characterRef}
      position={[0, 5, 0]}
      friction={-0.5}
      onContactForce={(e) =>
        bodyContactForce.set(e.totalForce.x, e.totalForce.y, e.totalForce.z)
      }
      onCollisionExit={() => bodyContactForce.set(0, 0, 0)}
      userData={{ canJump: false }}
    >
      <CapsuleCollider
        name="character-capsule-collider"
        args={[capsuleHalfHeight, capsuleRadius]}
      />
      <group ref={characterModelRef} userData={{ camExcludeCollision: true }}>
        {/* This mesh is used for positioning the slope ray origin */}
        <mesh
          position={[
            rayOriginOffest.x,
            rayOriginOffest.y,
            rayOriginOffest.z + slopeRayOriginOffest,
          ]}
          ref={slopeRayOriginRef}
          visible={showSlopeRayOrigin}
          userData={{ camExcludeCollision: true }} // this won't be collide by camera ray
        >
          <boxGeometry args={[0.15, 0.15, 0.15]} />
        </mesh>
        {/* Character model */}
        {children}
      </group>
    </RigidBody>
  );
};

export default CharacterController;
