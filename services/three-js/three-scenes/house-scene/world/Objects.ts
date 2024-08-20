import { RigidBody, World } from "@dimforge/rapier3d-compat";

import {
  BodyTypeProps,
  ColliderTypeProps,
} from "@/models/three-scene/rapier-physic.model";
import Experience from "@/services/three-js/three-instance/Experience";
import Physic from "@/services/three-js/three-instance/Physic";
import { Mesh, Quaternion, Scene } from "three";

export default class Objects {
  private _experience: Experience;
  private _scene: Scene;
  private _physicWorld: Physic;
  private _world: World;
  private _bodys: { rigid: RigidBody; mesh: Mesh }[] = [];
  constructor() {
    this._experience = new Experience();
    this._scene = this._experience.scene;
    this._physicWorld = this._experience.physicWorld;
    this._world = this._experience.physicWorld.world;
    this.addObjects();
  }

  private addObjects() {
    this._bodys.push(
      this._physicWorld.body(
        BodyTypeProps.STATIC,
        ColliderTypeProps.CUBE,
        { hx: 10, hy: 0.8, hz: 10 },
        { x: 20.5, y: 2.5, z: 0.3 },
        { x: 0, y: 0, z: 0.3 },
        "pink"
      )
    );

    this._bodys.push(
      this._physicWorld.body(
        BodyTypeProps.DYNAMIC,
        ColliderTypeProps.CUBE,
        { hx: 0.5, hy: 0.5, hz: 0.5 },
        { x: 0, y: 15, z: 0 },
        { x: 0, y: 0.4, z: 0.7 },
        "orange"
      )
    );
    this._bodys.push(
      this._physicWorld.body(
        BodyTypeProps.DYNAMIC,
        ColliderTypeProps.SPHERE,
        { radius: 0.7 },
        { x: 4, y: 15, z: 1 },
        { x: 0, y: 1, z: 0.7 },
        "blue"
      )
    );
    this._bodys.push(
      this._physicWorld.body(
        BodyTypeProps.DYNAMIC,
        ColliderTypeProps.SPHERE,
        { radius: 0.7 },
        { x: 0, y: 15, z: 0 },
        { x: 0, y: 1, z: 0.7 },
        "red"
      )
    );
    this._bodys.push(
      this._physicWorld.body(
        BodyTypeProps.DYNAMIC,
        ColliderTypeProps.CYLINDER,
        { hh: 1, radius: 0.7 },
        { x: -7, y: 15, z: 8 },
        { x: 0, y: 1, z: 0 },
        "green"
      )
    );
    this._bodys.push(
      this._physicWorld.body(
        BodyTypeProps.DYNAMIC,
        ColliderTypeProps.CONE,
        { hh: 1, radius: 1 },
        { x: 7, y: 15, z: -8 },
        { x: 0, y: 1, z: 0 },
        "purple"
      )
    );
  }

  update() {
    this._bodys.forEach((body) => {
      const position = body.rigid.translation();
      const rotation = body.rigid.rotation();
      body.mesh.position.set(position.x, position.y, position.z);
      body.mesh.setRotationFromQuaternion(
        new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
      );
    });
  }
}
