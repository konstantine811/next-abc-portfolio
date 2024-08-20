import {
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  Scene,
  Texture,
} from "three";
import GUI from "lil-gui";
import Experience from "@/services/three-js/three-instance/Experience";
import Resources from "@/services/three-js/three-instance/utils/Resources";
import Debug from "@/services/three-js/three-instance/utils/Debug";

export default class Environment {
  private _experience: Experience;
  private _scene: Scene;
  private _resources: Resources;
  private _debug: Debug;
  private _debugFolder!: GUI;
  private _sunLight!: DirectionalLight;
  private _environmentMap!: {
    intensity: number;
    texture: Texture;
    updateMaterials: () => void;
  };
  constructor() {
    this._experience = new Experience();
    this._scene = this._experience.scene;
    this._resources = this._experience.resources;
    this._debug = this._experience.debug;

    // Debug
    if (this._debug.active) {
      this._debugFolder = this._debug.ui.addFolder("environment");
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this._sunLight = new DirectionalLight("#ffffff", 4);
    this._sunLight.castShadow = true;
    this._sunLight.shadow.camera.far = 15;
    this._sunLight.shadow.mapSize.set(1024, 1024);
    this._sunLight.shadow.normalBias = 0.05;
    this._sunLight.position.set(3.5, 2, -1.25);
    this._scene.add(this._sunLight);

    // Debug
    if (this._debug.active) {
      this._debugFolder
        .add(this._sunLight, "intensity")
        .name("sunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this._debugFolder
        .add(this._sunLight.position, "x")
        .name("sunLightX")
        .min(-5)
        .max(5)
        .step(0.001);

      this._debugFolder
        .add(this._sunLight.position, "y")
        .name("sunLightY")
        .min(-5)
        .max(5)
        .step(0.001);

      this._debugFolder
        .add(this._sunLight.position, "z")
        .name("sunLightZ")
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setEnvironmentMap() {
    this._environmentMap = {
      intensity: 0.4,
      texture: this._resources.items.environmentMapTexture as Texture,
      updateMaterials: () => {
        this._scene.traverse((child) => {
          if (
            child instanceof Mesh &&
            child.material instanceof MeshStandardMaterial
          ) {
            child.material.envMap = this._environmentMap.texture;
            child.material.envMapIntensity = this._environmentMap.intensity;
            child.material.needsUpdate = true;
          }
        });
      },
    };
    this._environmentMap.texture.colorSpace = SRGBColorSpace;

    this._scene.environment = this._environmentMap.texture;
    this._environmentMap.updateMaterials();

    // Debug
    if (this._debug.active) {
      this._debugFolder
        .add(this._environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this._environmentMap.updateMaterials);
    }
  }
}
