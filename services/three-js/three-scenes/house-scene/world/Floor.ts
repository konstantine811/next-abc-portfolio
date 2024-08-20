import {
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  Texture,
  DoubleSide,
} from "three";
import Experience from "@/services/three-js/three-instance/Experience";
import Resources from "@/services/three-js/three-instance/utils/Resources";

export default class Floor {
  private _experience: Experience;
  private _scene: Scene;
  private _resources: Resources;
  private _geometry!: PlaneGeometry;
  private _textures!: {
    color: Texture;
    normal: Texture;
  };
  private _material!: MeshStandardMaterial;
  private _mesh!: Mesh;
  constructor() {
    this._experience = new Experience();
    this._scene = this._experience.scene;
    this._resources = this._experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this._geometry = new PlaneGeometry(20, 20);
  }

  setTextures() {
    this._textures = {
      color: this._resources.items.grassColorTexture as Texture,
      normal: this._resources.items.grassNormalTexture as Texture,
    };

    this._textures.color.colorSpace = SRGBColorSpace;
    this._textures.color.repeat.set(1.5, 1.5);
    this._textures.color.wrapS = RepeatWrapping;
    this._textures.color.wrapT = RepeatWrapping;

    this._textures.normal.repeat.set(1.5, 1.5);
    this._textures.normal.wrapS = RepeatWrapping;
    this._textures.normal.wrapT = RepeatWrapping;
  }

  setMaterial() {
    this._material = new MeshStandardMaterial({
      map: this._textures.color,
      normalMap: this._textures.normal,
      side: DoubleSide,
    });
  }

  setMesh() {
    this._mesh = new Mesh(this._geometry, this._material);
    this._mesh.rotation.x = -Math.PI * 0.5;
    this._mesh.receiveShadow = true;
    this._scene.add(this._mesh);
  }
}
