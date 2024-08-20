import Experience from "@/services/three-js/three-instance/Experience";
import Resources from "@/services/three-js/three-instance/utils/Resources";
import { ColliderDesc, RigidBodyDesc, World } from "@dimforge/rapier3d-compat";
import {
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector3,
} from "three";

export default class FloorTerrain {
  private _experience: Experience;
  private _scene: Scene;
  private _resources: Resources;
  private _world: World;
  private _textures!: {
    color: Texture;
    normal: Texture;
  };
  constructor(nsubdivs: number, scale: Vector3) {
    this._experience = new Experience();
    this._scene = this._experience.scene;
    this._resources = this._experience.resources;
    this._world = this._experience.physicWorld.world;
    this.generateTerrain(nsubdivs, scale);
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
  private generateTerrain(nsubdivs: number, scale: Vector3) {
    const heights: number[] = [];
    // three plane
    this.setTextures();
    const threeFloor = new Mesh(
      new PlaneGeometry(scale.x, scale.z, nsubdivs, nsubdivs),
      new MeshStandardMaterial({
        map: this._textures.color,
        normalMap: this._textures.normal,
        side: DoubleSide,
      })
    );

    threeFloor.rotateX(-Math.PI / 2);
    threeFloor.receiveShadow = true;
    threeFloor.castShadow = true;
    this._scene.add(threeFloor);

    // add height to the plane
    const vertices = threeFloor.geometry.attributes.position.array;
    const dx = scale.x / nsubdivs;
    const dz = scale.z / nsubdivs;
    // store height data to plane
    const columnRows = new Map();
    for (let i = 0; i < vertices.length; i += 3) {
      // translate into column/row indices
      let row = Math.floor(Math.abs(vertices[i] + scale.x / 2) / dx);
      let column = Math.floor(Math.abs(vertices[i + 1] + scale.z / 2) / dz);
      // generate height for this column & row
      const randomHeight = Math.random();
      vertices[i + 2] = scale.y * randomHeight;
      // store height
      if (!columnRows.get(column)) {
        columnRows.set(column, new Map());
      }
      columnRows.get(column).set(row, randomHeight);
    }
    threeFloor.geometry.computeVertexNormals();
    // store height data into column-major order matrix array
    for (let i = 0; i <= nsubdivs; ++i) {
      for (let j = 0; j <= nsubdivs; ++j) {
        heights.push(columnRows.get(j).get(i));
      }
    }
    let groundBodyDesc = RigidBodyDesc.fixed();
    let groundBody = this._world.createRigidBody(groundBodyDesc);
    let groundCollder = ColliderDesc.heightfield(
      nsubdivs,
      nsubdivs,
      new Float32Array(heights),
      { x: scale.x, y: scale.y, z: scale.z }
    );
    this._world.createCollider(groundCollder, groundBody);
  }
}
