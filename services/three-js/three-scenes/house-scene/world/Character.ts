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

enum AnimationName {
  IDLE = "Idle",
  WALKING = "Walking",
  RUNNING = "Running",
  JUMP = "Jump",
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
  private _keys = ["w", "s", "a", "d"];
  // character control
  private _rotationQuaternion = new Quaternion();
  private _rotateAngle = new Vector3(0, 1, 0);
  private _walkDirection = new Vector3();
  private _cameraTarget = new Vector3();
  // constants
  private _fadeDuration: number = 0.2;
  private _runVelocity = 20;
  private _walkVelocity = 10;
  constructor() {
    this._experience = new Experience();
    this._keyController = this._experience.keyController;
    this._scene = this._experience.scene;
    this._camera = this._experience.camera;
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

    this.setModel();
    this.setAnimation();
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
    if (this._keyController.isKeyDown(" ")) {
      playMode = AnimationName.JUMP;
    }
    if (this._animation.actions.currentName !== playMode) {
      this._animation.play(playMode);
      this._animation.actions.currentName = playMode;
    }
    this._animation.mixer.update(delta);
  }

  private characterControlMovement(delta: number) {
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
      this._rotationQuaternion.setFromAxisAngle(
        this._rotateAngle,
        angleYCameraDirection + directionOffset + Math.PI
      );
      this._model.quaternion.rotateTowards(this._rotationQuaternion, 0.2);
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
      const moveX = this._walkDirection.x * velocity * delta;
      const moveZ = this._walkDirection.z * velocity * delta;
      this._model.position.x += moveX;
      this._model.position.z += moveZ;
      this.updateCameraPosition(moveX, moveZ);
    }
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
    if (ks.isKeyDown("w")) {
      if (ks.isKeyDown("a")) {
        directionOffset = Math.PI / 4; // w + a
      } else if (ks.isKeyDown("d")) {
        directionOffset = -Math.PI / 4; // w + d
      }
    } else if (ks.isKeyDown("s")) {
      if (ks.isKeyDown("a")) {
        directionOffset = (Math.PI * 3) / 4; // s + a
      } else if (ks.isKeyDown("d")) {
        directionOffset = (-Math.PI * 3) / 4; // s + d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (ks.isKeyDown("a")) {
      directionOffset = Math.PI / 2; // a
    } else if (ks.isKeyDown("d")) {
      directionOffset = -Math.PI / 2; // d
    }
    return directionOffset;
  }

  private characterControl(delta: number) {
    this.characterControlAnimation(delta);
    this.characterControlMovement(delta);
  }

  update() {
    this._animation.mixer.update(this._time.delta * 0.001);
    this.characterControl(this._time.delta * 0.0003);
  }
}
