import { RapierRigidBody } from "@react-three/rapier";

export type camListenerTargetType = "document" | "domElement";
export type cameraModeType =
  | "CameraBasedMovement"
  | "FixedCamera"
  | "PointToMove";

export interface CustomControllerRigidBody extends RapierRigidBody {
  rotateCamera?: (x: number, y: number) => void;
  rotateCharacterOnY?: (rad: number) => void;
}

export interface userDataType {
  canJump?: boolean;
  slopeAngle?: number | null;
  characterRotated?: boolean;
  isOnMovingObject?: boolean;
  excludeControllerRay: boolean;
}
