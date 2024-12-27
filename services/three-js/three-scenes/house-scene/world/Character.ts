import { GUI } from "lil-gui";
import {
  AnimationAction,
  AnimationMixer,
  Group,
  Mesh,
  Object3DEventMap,
  Quaternion,
  Scene,
  Vector3,
} from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "@/services/three-js/three-instance/Experience";
import Resources from "@/services/three-js/three-instance/utils/Resources";
import Time from "@/services/three-js/three-instance/utils/Time";
import Debug from "@/services/three-js/three-instance/utils/Debug";
import KeyController from "@/services/three-js/three-instance/utils/KeyController";
import Camera from "@/services/three-js/three-instance/Camera";
import {
  ColliderDesc,
  Ray,
  RigidBody,
  RigidBodyDesc,
  Vector,
} from "@dimforge/rapier3d-compat";
import Physic from "@/services/three-js/three-instance/Physic";
import {
  BodyTypeProps,
  ColliderTypeProps,
} from "@/models/three-scene/rapier-physic.model";

enum AnimationName {
  IDLE = "Idle",
  WALKING = "Walking",
  RUNNING = "Running",
  JUMP = "Jump",
}

enum KeyCodeDirection {
  W = "KeyW",
  S = "KeyS",
  A = "KeyA",
  D = "KeyD",
  Space = "Space",
}

export default class Character {
  private _experience: Experience;
  private _keyController: KeyController;
  private _scene: Scene;
  private _resources: Resources;
  private _time: Time;
  private _debug: Debug;
  private _debugFolder!: GUI;
  private _resource: GLTF;
  private _camera: Camera;
  private _model!: Group<Object3DEventMap>;
  private _physicWorld: Physic;
  private _rigidBody!: RigidBody;
  private _ray!: Ray;
  private _animation!: {
    mixer: AnimationMixer;
    actions: {
      [AnimationName.IDLE]: AnimationAction;
      [AnimationName.WALKING]: AnimationAction;
      [AnimationName.RUNNING]: AnimationAction;
      [AnimationName.JUMP]: AnimationAction;
      current: AnimationAction;
      currentName: AnimationName;
    };
    play: (name: AnimationName) => void;
  };
  private _keys = [
    KeyCodeDirection.W,
    KeyCodeDirection.S,
    KeyCodeDirection.A,
    KeyCodeDirection.D,
  ];
  // character control
  private _rotationQuaternion = new Quaternion();
  private _rotateAngle = new Vector3(0, 1, 0);
  private _walkDirection = new Vector3();
  private _cameraTarget = new Vector3();
  // constants
  private _fadeDuration: number = 0.2;
  private _runVelocity = 20;
  private _walkVelocity = 10;
  private _storedFall = 0;
  private CONTROLER_BORDER_RADIUS = 0.28;
  private _bodys: { rigid: RigidBody; mesh: Mesh }[] = [];
  constructor() {
    this._experience = new Experience();
    this._keyController = this._experience.keyController;
    this._scene = this._experience.scene;
    this._camera = this._experience.camera;
    this._physicWorld = this._experience.physicWorld;
    const controls = this._camera.controls;
    controls.enableDamping = false;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();
    this._resources = this._experience.resources;
    this._time = this._experience.time;
    this._debug = this._experience.debug;

    // Debug
    if (this._debug.active) {
      this._debugFolder = this._debug.ui.addFolder("character");
    }
    // Resource
    this._resource = this._resources.items.characterModel as GLTF;
    this.setRigidBody();
    this.setModel();
    this.setAnimation();
  }

  setRigidBody() {
    const { mesh, rigid } = this._physicWorld.body(
      BodyTypeProps.DYNAMIC,
      ColliderTypeProps.CAPSULE,
      { hh: 1.68, radius: this.CONTROLER_BORDER_RADIUS },
      { x: 0, y: 1.8, z: 0 },
      { x: 0, y: 0, z: 0 },
      "black",
      true
    );
    rigid.lockRotations(true, true);
    this._rigidBody = rigid;
    this._bodys.push({ mesh, rigid });
    /*     let bodyDesc = RigidBodyDesc.kinematicPositionBased().setTranslation(
      -1,
      3,
      1
    );
    this._rigidBody = this._physicWorld.world.createRigidBody(bodyDesc);
    const dynamicCollider = ColliderDesc.ball(this.CONTROLER_BORDER_RADIUS);
    this._physicWorld.world.createCollider(dynamicCollider, this._rigidBody); */
    this._ray = new Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
  }

  setModel() {
    this._model = this._resource.scene;

    this._scene.add(this._model);
    const scale = 1.8;
    this._model.scale.set(scale, scale, scale);
    this._model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    // Mixer
    // Mixer
    const mixer = new AnimationMixer(this._model);

    // Actions
    const actions = {
      [AnimationName.IDLE]: mixer.clipAction(this._resource.animations[0]),
      [AnimationName.WALKING]: mixer.clipAction(this._resource.animations[3]),
      [AnimationName.RUNNING]: mixer.clipAction(this._resource.animations[2]),
      [AnimationName.JUMP]: mixer.clipAction(this._resource.animations[1]),
      current: mixer.clipAction(this._resource.animations[0]),
      currentName: AnimationName.IDLE,
    };
    // Play function
    const play = (name: AnimationName) => {
      const newAction = actions[name];
      const oldAction = actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, this._fadeDuration, true);
      actions.current = newAction;
      actions.currentName = name;
    };

    // Assigning to this._animation
    this._animation = {
      mixer: mixer,
      actions: actions,
      play: play,
    };

    this._animation.actions.current.play();

    // Debug
    if (this._debug.active) {
      const debugObject = {
        playIdle: () => {
          this._animation.play(AnimationName.IDLE);
        },
        playWalking: () => {
          this._animation.play(AnimationName.WALKING);
        },
        playRunning: () => {
          this._animation.play(AnimationName.RUNNING);
        },
        playJump: () => {
          this._animation.play(AnimationName.JUMP);
        },
      };
      this._debugFolder.add(debugObject, "playIdle");
      this._debugFolder.add(debugObject, "playWalking");
      this._debugFolder.add(debugObject, "playRunning");
      this._debugFolder.add(debugObject, "playJump");
    }
  }

  private characterControlAnimation(delta: number) {
    const directionPressed = this._keys.some((key) =>
      this._keyController.isKeyDown(key)
    );
    let playMode = AnimationName.IDLE;
    if (directionPressed && !this._keyController.shiftKey) {
      playMode = AnimationName.WALKING;
    } else if (directionPressed && this._keyController.shiftKey) {
      playMode = AnimationName.RUNNING;
    } else {
      playMode = AnimationName.IDLE;
    }
    if (this._keyController.isKeyDown(KeyCodeDirection.Space)) {
      playMode = AnimationName.JUMP;
    }
    if (this._animation.actions.currentName !== playMode) {
      this._animation.play(playMode);
      this._animation.actions.currentName = playMode;
    }
    this._animation.mixer.update(delta);
  }

  private characterControlMovement(delta: number) {
    this._walkDirection.x = this._walkDirection.y = this._walkDirection.z = 0;
    if (
      this._animation.actions.currentName === AnimationName.RUNNING ||
      this._animation.actions.currentName === AnimationName.WALKING
    ) {
      const angleYCameraDirection = Math.atan2(
        this._camera.instance.position.x - this._model.position.x,
        this._camera.instance.position.z - this._model.position.z
      );
      // diagonal movement angle offset
      const directionOffset = this.directionOffset();
      // rotate model
      // Поворот фізичного тіла
      const newRotationQuaternion = new Quaternion();
      newRotationQuaternion.setFromAxisAngle(
        new Vector3(0, 1, 0),
        angleYCameraDirection + directionOffset + Math.PI
      );

      // Застосування обертання до фізичного тіла
      this._rigidBody.setNextKinematicRotation(newRotationQuaternion);

      // calculate direction
      this._camera.instance.getWorldDirection(this._walkDirection);
      this._walkDirection.y = 0;
      this._walkDirection.normalize();
      this._walkDirection.applyAxisAngle(this._rotateAngle, directionOffset);

      // run/walk velocity
      const velocity =
        this._animation.actions.currentName === AnimationName.RUNNING
          ? this._runVelocity
          : this._walkVelocity;

      this.characterTranslate(delta, velocity);

      // const moveX = this._walkDirection.x * velocity * delta;
      // const moveZ = this._walkDirection.z * velocity * delta;
      // this._model.position.x += moveX;
      // this._model.position.z += moveZ;
      // this.updateCameraPosition(moveX, moveZ);
    }
  }

  private characterTranslate(delta: number, velocity: number) {
    /* const translation = this._rigidBody.translation();
    if (translation.y < -1) {
      this._rigidBody.setNextKinematicTranslation({
        x: 0,
        y: 10,
        z: 0,
      });
    } else {
      const cameraPositionOffset = this._camera.instance.position.sub(
        this._model.position
      );
      // update model and camera
      this._model.position.set(translation.x, translation.y, translation.z);
      this.updatePhysicsCameraPosition(cameraPositionOffset);
      this._walkDirection.y += this.lerp(this._storedFall, -9.81 * delta, 0.1);
      this._storedFall = this._walkDirection.y;
      this._ray.origin.x = translation.x;
      this._ray.origin.y = translation.y;
      this._ray.origin.z = translation.z;
      const hit = this._physicWorld.world.castRay(this._ray, 0.5, false);
      if (hit) {
        const point = this._ray.pointAt(hit.toi);
        let diff = translation.y - (point.y + this.CONTROLER_BORDER_RADIUS);
        if (diff < 0.0) {
          this._storedFall = 0;
          this._walkDirection.y = this.lerp(0, Math.abs(diff), 0.5);
        }
      }
      this._walkDirection.x = this._walkDirection.x * velocity * delta;
      this._walkDirection.z = this._walkDirection.z * velocity * delta;

      const impulse = new Vector3(
        this._walkDirection.x * velocity * delta,
        0,
        this._walkDirection.z * velocity * delta
      );

      this._rigidBody.applyImpulse(impulse, true);
    } */

    const translation = this._rigidBody.translation();
    const force = new Vector3(
      (this._walkDirection.x * velocity) / 10,
      this._walkDirection.y,
      (this._walkDirection.z * velocity) / 10
    );

    // Застосування сили до тіла
    this._rigidBody.setLinvel(force, true);

    // Оновлення позиції моделі, щоб відповідала позиції фізичного тіла
    const newTranslation = this._rigidBody.translation();
    this._model.position.set(
      newTranslation.x,
      newTranslation.y,
      newTranslation.z
    );

    // Оновлення камери, щоб відповідала руху героя
    const cameraPositionOffset = this._camera.instance.position.sub(
      this._model.position
    );
    this.updatePhysicsCameraPosition(cameraPositionOffset);
  }

  private lerp(x: number, y: number, a: number) {
    return x * (1 - a) + y * a;
  }

  private updatePhysicsCameraPosition(offset: Vector3) {
    const rigidTranslation = this._rigidBody.translation();
    // move camera
    this._camera.instance.position.set(
      rigidTranslation.x + offset.x,
      rigidTranslation.y + offset.y,
      rigidTranslation.z + offset.z
    );
    // update camera target
    this._cameraTarget.set(
      rigidTranslation.x,
      rigidTranslation.y + 1,
      rigidTranslation.z
    );
    this._camera.controls.target = this._cameraTarget;
  }

  private updateCameraPosition(moveX: number, moveY: number) {
    // move camera
    this._camera.instance.position.x += moveX;
    this._camera.instance.position.z += moveY;
    // update camera target
    this._cameraTarget.set(
      this._model.position.x,
      this._model.position.y + 1,
      this._model.position.z
    );
    this._camera.controls.target = this._cameraTarget;
  }

  private directionOffset() {
    const ks = this._keyController;
    let directionOffset = 0; // w
    if (ks.isKeyDown(KeyCodeDirection.W)) {
      if (ks.isKeyDown(KeyCodeDirection.A)) {
        directionOffset = Math.PI / 4; // w + a
      } else if (ks.isKeyDown(KeyCodeDirection.D)) {
        directionOffset = -Math.PI / 4; // w + d
      }
    } else if (ks.isKeyDown(KeyCodeDirection.S)) {
      if (ks.isKeyDown(KeyCodeDirection.A)) {
        directionOffset = (Math.PI * 3) / 4; // s + a
      } else if (ks.isKeyDown(KeyCodeDirection.D)) {
        directionOffset = (-Math.PI * 3) / 4; // s + d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (ks.isKeyDown(KeyCodeDirection.A)) {
      directionOffset = Math.PI / 2; // a
    } else if (ks.isKeyDown(KeyCodeDirection.D)) {
      directionOffset = -Math.PI / 2; // d
    }
    return directionOffset;
  }

  private characterControl(delta: number) {
    this.characterControlAnimation(delta);
    this.characterControlMovement(delta);
  }

  update() {
    // Оновлення позиції і обертання моделі на основі фізичного тіла
    const position = this._rigidBody.translation();
    const rotation = this._rigidBody.rotation();

    this._model.position.set(position.x, position.y, position.z);
    this._model.setRotationFromQuaternion(
      new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    );
    this._animation.mixer.update(this._time.delta * 0.001);
    this.characterControl(this._time.delta * 0.0003);

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
