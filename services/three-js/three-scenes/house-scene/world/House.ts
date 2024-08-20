import { GUI } from "lil-gui";
import {
  Scene,
  Group,
  Mesh,
  BoxGeometry,
  MeshStandardMaterial,
  ConeGeometry,
} from "three";
import Experience from "@/services/three-js/three-instance/Experience";
import Resources from "@/services/three-js/three-instance/utils/Resources";
import Time from "@/services/three-js/three-instance/utils/Time";
import Debug from "@/services/three-js/three-instance/utils/Debug";

export default class House {
  private _experience: Experience;
  private _scene: Scene;
  private _resources: Resources;
  private _time: Time;
  private _debug: Debug;
  private _debugFolder!: GUI;
  private _house!: Group;
  constructor() {
    this._experience = new Experience();
    this._scene = this._experience.scene;
    this._resources = this._experience.resources;
    this._time = this._experience.time;
    this._debug = this._experience.debug;
    this.addHouse();
  }

  private addHouse() {
    this._house = new Group();
    this._house.position.set(5, 0, 0);
    this._scene.add(this._house);
    this.addWalls();
    this.addRoof();
  }

  private addWalls() {
    const walls = new Mesh(
      new BoxGeometry(4, 2.5, 4),
      new MeshStandardMaterial()
    );
    walls.position.y = 1.25;
    this._house.add(walls);
  }

  private addRoof() {
    const roof = new Mesh(
      new ConeGeometry(3.5, 1.5, 4),
      new MeshStandardMaterial()
    );
    roof.position.y = 2.5 + 0.75;
    roof.rotation.y = Math.PI * 0.25;
    this._house.add(roof);
  }

  update() {}
}
