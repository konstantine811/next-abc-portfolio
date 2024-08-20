import {
  ISourceModel,
  ISourceName,
  ISourceType,
} from "@/models/three-scene/source.model";

export const sourceHouseScene: ISourceModel[] = [
  {
    name: ISourceName.environmentMapTexture,
    type: ISourceType.cubeTexture,
    path: [
      "/textures/environmentMap/px.jpg",
      "/textures/environmentMap/nx.jpg",
      "/textures/environmentMap/py.jpg",
      "/textures/environmentMap/ny.jpg",
      "/textures/environmentMap/pz.jpg",
      "/textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: ISourceName.grassColorTexture,
    type: ISourceType.texture,
    path: "/textures/dirt/color.jpg",
  },
  {
    name: ISourceName.grassNormalTexture,
    type: ISourceType.texture,
    path: "/textures/dirt/normal.jpg",
  },
  {
    name: ISourceName.characterModel,
    type: ISourceType.gltfModel,
    path: "/3d-models/character.glb",
  },
];
