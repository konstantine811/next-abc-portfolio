import { CubeTexture, CubeTextureLoader, Texture, TextureLoader } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter";
import { ISourceModel, ISourceType } from "@/models/three-scene/source.model";

export default class Resources extends EventEmitter {
  private _sources: ISourceModel[];
  private _items: { [key: string]: GLTF | Texture | CubeTexture };
  private _toLoad: number;
  private _loaded: number;
  private _loaders!: {
    gltfLoader: GLTFLoader;
    textureLoader: TextureLoader;
    cubeTextureLoader: CubeTextureLoader;
  };
  constructor(sources: ISourceModel[]) {
    super();

    this._sources = sources;

    this._items = {};
    this._toLoad = this._sources.length;
    this._loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  get items() {
    return this._items;
  }

  setLoaders() {
    this._loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new TextureLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
    };
  }

  startLoading() {
    // Load each source
    for (const source of this._sources) {
      if (source.type === ISourceType.gltfModel) {
        const path = source.path as string;
        this._loaders.gltfLoader.load(path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === ISourceType.texture) {
        const path = source.path as string;
        this._loaders.textureLoader.load(path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === ISourceType.cubeTexture) {
        const paths = source.path as string[];
        this._loaders.cubeTextureLoader.load(paths, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: ISourceModel, file: GLTF | Texture | CubeTexture) {
    this._items[source.name] = file;

    this._loaded++;

    if (this._loaded === this._toLoad) {
      this.trigger("ready");
    }
  }
}
