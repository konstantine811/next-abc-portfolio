import {
  CineonToneMapping,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
} from "three";
import Camera from "./Camera";
import Experience from "./Experience";
import Sizes from "./utils/Sizes";

export default class Renderer {
  private _experience: Experience;
  private _sizes: Sizes;
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _camera: Camera;
  private _instance!: WebGLRenderer;
  constructor() {
    this._experience = new Experience();
    this._canvas = this._experience.canvasElement;
    this._sizes = this._experience.sizes;
    this._scene = this._experience.scene;
    this._camera = this._experience.camera;

    this.setInstance();
  }

  get instance() {
    return this._instance;
  }

  setInstance() {
    this._instance = new WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
    });
    this._instance.toneMapping = CineonToneMapping;
    this._instance.toneMappingExposure = 1.75;
    this._instance.shadowMap.enabled = true;
    this._instance.shadowMap.type = PCFSoftShadowMap;
    this._instance.setClearColor("#211d20");
    this._instance.setSize(this._sizes.width, this._sizes.height);
    this._instance.setPixelRatio(this._sizes.pixelRatio);
  }

  resize() {
    this._instance.setSize(this._sizes.width, this._sizes.height);
    this._instance.setPixelRatio(this._sizes.pixelRatio);
  }

  update() {
    this._instance.render(this._scene, this._camera.instance);
  }
}
