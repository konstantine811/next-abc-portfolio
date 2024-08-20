import { PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Experience from "./Experience";
import Sizes from "./utils/Sizes";

export default class Camera {
  private _experience: Experience;
  private _sizes: Sizes;
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _instance!: PerspectiveCamera;
  private _controls!: OrbitControls;
  constructor() {
    this._experience = new Experience();
    this._sizes = this._experience.sizes;
    this._scene = this._experience.scene;
    this._canvas = this._experience.canvasElement;

    this.setInstance();
    this.setControls();
  }

  get instance() {
    return this._instance;
  }

  get controls() {
    return this._controls;
  }

  setInstance() {
    this._instance = new PerspectiveCamera(
      35,
      this._sizes.width / this._sizes.height,
      0.1,
      1000
    );
    this._instance.position.set(6, 4, 8);
    this._scene.add(this._instance);
  }

  setControls() {
    this._controls = new OrbitControls(this._instance, this._canvas);
    this._controls.enableDamping = true;
  }

  resize() {
    this._instance.aspect = this._sizes.width / this._sizes.height;
    this._instance.updateProjectionMatrix();
  }

  update() {
    this._controls.update();
  }
}
