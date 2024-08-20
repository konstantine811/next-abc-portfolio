import { Mesh, Scene } from "three";
import Debug from "./utils/Debug";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Resources from "./utils/Resources";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World";
import { ISourceModel } from "@/models/three-scene/source.model";
import KeyController from "./utils/KeyController";
import Physic from "./Physic";

let instance: Experience | null = null;

export default class Experience {
  private _canvas!: HTMLCanvasElement;
  private _debug!: Debug;
  private _sizes!: Sizes;
  private _time!: Time;
  private _scene!: Scene;
  private _resources!: Resources;
  private _camera!: Camera;
  private _renderer!: Renderer;
  private _world!: World;
  private _keyController!: KeyController;
  private _physicWorld!: Physic;
  constructor(
    canvas?: HTMLCanvasElement,
    World?: new () => World,
    sourceScene?: ISourceModel[]
  ) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;
    // Global access
    window.experience = this;
    if (canvas) {
      this._canvas = canvas;
    }
    // Setup
    this._debug = new Debug();
    this._sizes = new Sizes();
    this._time = new Time();
    this._scene = new Scene();
    if (sourceScene) {
      this._resources = new Resources(sourceScene);
    }
    this._camera = new Camera();
    this._renderer = new Renderer();
    this._physicWorld = new Physic();
    this._keyController = new KeyController();
    if (World) {
      this._world = new World();
    }
    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  get canvasElement() {
    return this._canvas;
  }

  get debug() {
    return this._debug;
  }

  get sizes() {
    return this._sizes;
  }

  get time() {
    return this._time;
  }

  get scene() {
    return this._scene;
  }

  get resources() {
    return this._resources;
  }

  get camera() {
    return this._camera;
  }

  get renderer() {
    return this._renderer;
  }

  get world() {
    return this._world;
  }

  get keyController() {
    return this._keyController;
  }

  get physicWorld() {
    return this._physicWorld;
  }

  resize() {
    this.camera.resize();
    this.world.update();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
    this._physicWorld.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");
    instance = null;

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}
