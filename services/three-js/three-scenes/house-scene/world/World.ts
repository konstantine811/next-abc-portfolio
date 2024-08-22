import { Scene, Vector3 } from "three";
import Experience from "@/services/three-js/three-instance/Experience";
import Resources from "@/services/three-js/three-instance/utils/Resources";
import WorldImpl from "@/services/three-js/three-instance/World";
import Floor from "./Floor";
import House from "./House";
import Environment from "./Environment";
import Character from "./Character";
import FloorTerrain from "./FloorTerrain";
import Objects from "./Objects";

export default class WorldScene implements WorldImpl {
  private _experience: Experience;
  private _scene: Scene;
  private _resources: Resources;
  // private _floor!: Floor;
  private _house!: House;
  private _floorTerrain!: FloorTerrain;
  private _environment!: Environment;
  private _character!: Character;
  private _objects!: Objects;
  constructor() {
    this._experience = new Experience();
    this._scene = this._experience.scene;
    this._resources = this._experience.resources;

    // Wait for resources
    this._resources.on("ready", () => {
      // Setup
      // this._floor = new Floor();
      this._house = new House();
      this._floorTerrain = new FloorTerrain(20, new Vector3(70.0, 1.0, 70.0));
      this._environment = new Environment();
      this._objects = new Objects();
      this._character = new Character();
    });
  }

  update() {
    if (this._house) this._house.update();
    if (this._character) this._character.update();
    if (this._objects) this._objects.update();
  }
}
