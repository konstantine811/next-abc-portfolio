import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  Scene,
  SphereGeometry,
} from "three";
import Experience from "./Experience";
import {
  BodyTypeProps,
  ColliderTypeProps,
} from "@/models/three-scene/rapier-physic.model";
import {
  ColliderDesc,
  init,
  RigidBody,
  RigidBodyDesc,
  Vector3,
  World,
} from "@dimforge/rapier3d-compat";

export default class Physic {
  private _world!: World;
  private _scene: Scene;
  constructor() {
    const experience = new Experience();
    this._scene = experience.scene;
    // Ensure Rapier is initialized
    init()
      .then(() => {
        this._world = new World(new Vector3(0, -9.81, 0));
      })
      .catch((error) => {
        console.error("Error initializing Rapier:", error);
      });
  }

  get world() {
    return this._world;
  }

  body(
    bodyType: BodyTypeProps,
    colliderType: ColliderTypeProps,
    dimension: any,
    translation: Vector3,
    rotation: Vector3,
    color: string
  ): { rigid: RigidBody; mesh: Mesh } {
    let bodyDesc: RigidBodyDesc;
    if (bodyType === BodyTypeProps.DYNAMIC) {
      bodyDesc = RigidBodyDesc.dynamic();
    } else if (bodyType === BodyTypeProps.STATIC) {
      bodyDesc = RigidBodyDesc.fixed();
      bodyDesc.setCanSleep(false);
    } else if (bodyType === BodyTypeProps.KINEMATIC) {
      bodyDesc = RigidBodyDesc.kinematicPositionBased();
    } else {
      throw new Error("Invalid body type");
    }
    bodyDesc.setTranslation(translation.x, translation.y, translation.z);
    const q = new Quaternion().setFromEuler(
      new Euler(rotation.x, rotation.y, rotation.z, "XYZ")
    );
    bodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
    const rigidBody = this._world.createRigidBody(bodyDesc);
    let collider: ColliderDesc;
    if (colliderType === ColliderTypeProps.CUBE) {
      collider = ColliderDesc.cuboid(dimension.hx, dimension.hy, dimension.hz);
    } else if (colliderType === ColliderTypeProps.SPHERE) {
      collider = ColliderDesc.ball(dimension.radius);
    } else if (colliderType === ColliderTypeProps.CYLINDER) {
      collider = ColliderDesc.cylinder(dimension.hh, dimension.radius);
    } else if (colliderType === ColliderTypeProps.CONE) {
      collider = ColliderDesc.cone(dimension.hh, dimension.radius);
      // cone center of mass is at bottom
      collider.centerOfMass = { x: 0, y: 0, z: 0 };
    } else {
      throw new Error("Invalid collider type");
    }

    this._world.createCollider(collider, rigidBody);
    let bufferGeometry: BufferGeometry;
    if (colliderType === ColliderTypeProps.CUBE) {
      bufferGeometry = new BoxGeometry(
        dimension.hx * 2,
        dimension.hy * 2,
        dimension.hz * 2
      );
    } else if (colliderType === ColliderTypeProps.SPHERE) {
      bufferGeometry = new SphereGeometry(dimension.radius, 32, 32);
    } else if (colliderType === ColliderTypeProps.CYLINDER) {
      bufferGeometry = new CylinderGeometry(
        dimension.radius,
        dimension.radius,
        dimension.hh * 2,
        32,
        32
      );
    } else if (colliderType === ColliderTypeProps.CONE) {
      bufferGeometry = new ConeGeometry(
        0,
        dimension.radius,
        dimension.hh * 2,
        32
      );
    } else {
      throw new Error("Invalid collider type for buffer geometry");
    }
    const threeMesh = new Mesh(
      bufferGeometry,
      new MeshStandardMaterial({ color })
    );
    threeMesh.castShadow = true;
    threeMesh.receiveShadow = true;
    this._scene.add(threeMesh);
    return { rigid: rigidBody, mesh: threeMesh };
  }

  update() {
    if (this._world) {
      this._world.step();
    }
  }
}
