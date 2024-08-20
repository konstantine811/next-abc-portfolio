import { GUI } from "lil-gui";
import {
  AnimationAction,
  AnimationMixer,
  Group,
  Mesh,
  Object3DEventMap,
  Scene,
} from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "@/services/three-js/three-instance/Experience";
import Resources from "@/services/three-js/three-instance/utils/Resources";
import Time from "@/services/three-js/three-instance/utils/Time";
import Debug from "@/services/three-js/three-instance/utils/Debug";

enum AnimationName {
  IDLE = "idle",
  WALKING = "walking",
  RUNNING = "running",
}

export default class Fox {
  private _experience: Experience;
  private _scene: Scene;
  private _resources: Resources;
  private _time: Time;
  private _debug: Debug;
  private _debugFolder!: GUI;
  private _resource: GLTF;
  private _model!: Group<Object3DEventMap>;
  private _animation!: {
    mixer: AnimationMixer;
    actions: {
      [AnimationName.IDLE]: AnimationAction;
      [AnimationName.WALKING]: AnimationAction;
      [AnimationName.RUNNING]: AnimationAction;
      current: AnimationAction;
    };
    play: (name: AnimationName) => void;
  };
  constructor() {
    this._experience = new Experience();
    this._scene = this._experience.scene;
    this._resources = this._experience.resources;
    this._time = this._experience.time;
    this._debug = this._experience.debug;

    // Debug
    if (this._debug.active) {
      this._debugFolder = this._debug.ui.addFolder("fox");
    }

    // Resource
    this._resource = this._resources.items.foxModel as GLTF;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this._model = this._resource.scene;
    this._model.scale.set(0.02, 0.02, 0.02);
    this._scene.add(this._model);

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
      [AnimationName.WALKING]: mixer.clipAction(this._resource.animations[1]),
      [AnimationName.RUNNING]: mixer.clipAction(this._resource.animations[2]),
      current: mixer.clipAction(this._resource.animations[0]),
    };

    // Play function
    const play = (name: AnimationName) => {
      const newAction = actions[name];
      const oldAction = actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1, true);
      actions.current = newAction;
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
      };
      this._debugFolder.add(debugObject, "playIdle");
      this._debugFolder.add(debugObject, "playWalking");
      this._debugFolder.add(debugObject, "playRunning");
    }
  }

  update() {
    this._animation.mixer.update(this._time.delta * 0.001);
  }
}
