import GUI from "lil-gui";

export default class Debug {
  private _active: boolean;
  private _ui!: GUI;
  constructor() {
    this._active = window.location.hash === "#debug";

    if (this._active) {
      this._ui = new GUI();
    }
  }

  get active() {
    return this._active;
  }

  get ui() {
    return this._ui;
  }
}
