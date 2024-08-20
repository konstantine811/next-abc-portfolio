import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  private _width: number;
  private _height: number;
  private _pixelRatio: number;
  constructor() {
    super();

    // Setup
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Resize event
    window.addEventListener("resize", () => {
      this._width = window.innerWidth;
      this._height = window.innerHeight;
      this._pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get pixelRatio() {
    return this._pixelRatio;
  }
}
