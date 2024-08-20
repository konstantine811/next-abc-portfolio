export default class KeyController {
  private _keys: { [key: string]: boolean } = {};
  private _keysPressed: { [key: string]: boolean } = {};
  private _keysReleased: { [key: string]: boolean } = {};
  private _shiftKey: boolean = false;
  constructor() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (event.shiftKey) {
        this._shiftKey = true;
      }
      this._keys[key] = true;
      this._keysPressed[key] = true;
    });
    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (key === "shift") {
        this._shiftKey = false;
      }
      this._keys[key] = false;
      this._keysReleased[key] = true;
    });
  }
  update() {
    this._keysPressed = {};
    this._keysReleased = {};
  }
  isKeyDown(key: string) {
    return this._keys[key] || false;
  }
  isKeyPressed(key: string) {
    return this._keysPressed[key] || false;
  }
  isKeyReleased(key: string) {
    return this._keysReleased[key] || false;
  }

  get shiftKey() {
    return this._shiftKey;
  }
}
