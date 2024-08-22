import { get } from "./../../../../node_modules/http2-wrapper/index.d";
import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  private _width: number;
  private _height: number;
  private _pixelRatio: number;
  constructor() {
    super();

    // Setup
    this._width = window.innerWidth;
    this._height = window.innerHeight - this.getHeaderHeight();
    this._pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Resize event
    window.addEventListener("resize", () => {
      this._width = window.innerWidth;

      this._height = window.innerHeight - this.getHeaderHeight();
      this._pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });
  }

  private getHeaderHeight() {
    let headerHeight = 0;
    const headerEl = document.getElementById("header");
    if (headerEl) {
      headerHeight = headerEl.getBoundingClientRect().height;
    }
    return headerHeight;
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
