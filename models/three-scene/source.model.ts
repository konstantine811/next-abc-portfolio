export enum ISourceName {
  environmentMapTexture = "environmentMapTexture",
  grassColorTexture = "grassColorTexture",
  grassNormalTexture = "grassNormalTexture",
  foxModel = "foxModel",
  characterModel = "characterModel",
}

export enum ISourceType {
  cubeTexture = "cubeTexture",
  texture = "texture",
  gltfModel = "gltfModel",
}

export interface ISourceModel {
  name: ISourceName;
  type: ISourceType;
  path: string | string[];
}
