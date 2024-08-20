import { Scene } from "three";
import Experience from "@services/three-instance/Experience";
import Resources from "@services/three-instance/utils/Resources";
import WorldImpl from "@services/three-instance/World";
import Floor from "./Floor";
import Fox from "./Fox";
import Environment from "./Environment";

export default class World implements WorldImpl {
  private _experience: Experience;
  private _scene: Scene;
  private _resources: Resources;
  private _floor!: Floor;
  private _fox!: Fox;
  private _environment!: Environment;
  constructor() {
    this._experience = new Experience();
    this._scene = this._experience.scene;
    this._resources = this._experience.resources;

    // Wait for resources
    this._resources.on("ready", () => {
      // Setup
      this._floor = new Floor();
      this._fox = new Fox();
      this._environment = new Environment();
    });
  }

  update() {
    if (this._fox) this._fox.update();
  }
}
