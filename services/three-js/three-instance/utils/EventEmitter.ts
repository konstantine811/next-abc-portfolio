export default class EventEmitter {
  private _callbacks: { [key: string]: { [key: string]: Function[] } };

  constructor() {
    this._callbacks = {};
    this._callbacks.base = {};
  }

  on(_names: string, callback: Function) {
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong names");
      return false;
    }

    if (typeof callback === "undefined") {
      console.warn("wrong callback");
      return false;
    }

    const names = this.resolveNames(_names);

    names.forEach((_name: string) => {
      const name = this.resolveName(_name);

      if (!(this._callbacks[name.namespace] instanceof Object))
        this._callbacks[name.namespace] = {};

      if (!(this._callbacks[name.namespace][name.value] instanceof Array))
        this._callbacks[name.namespace][name.value] = [];

      this._callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  off(_names: string) {
    if (typeof _names === "undefined" || _names === "") {
      console.warn("wrong name");
      return false;
    }

    const names = this.resolveNames(_names);

    names.forEach((_name) => {
      const name = this.resolveName(_name);

      if (name.namespace !== "base" && name.value === "") {
        delete this._callbacks[name.namespace];
      } else {
        if (name.namespace === "base") {
          for (const namespace in this._callbacks) {
            if (
              this._callbacks[namespace] instanceof Object &&
              this._callbacks[namespace][name.value] instanceof Array
            ) {
              delete this._callbacks[namespace][name.value];

              if (Object.keys(this._callbacks[namespace]).length === 0)
                delete this._callbacks[namespace];
            }
          }
        } else if (
          this._callbacks[name.namespace] instanceof Object &&
          this._callbacks[name.namespace][name.value] instanceof Array
        ) {
          delete this._callbacks[name.namespace][name.value];

          if (Object.keys(this._callbacks[name.namespace]).length === 0)
            delete this._callbacks[name.namespace];
        }
      }
    });

    return this;
  }

  trigger(_name: string, _args: any[] = []) {
    if (typeof _name === "undefined" || _name === "") {
      console.warn("wrong name");
      return false;
    }

    let finalResult: any = null;
    let result: any = null;

    const args = !(_args instanceof Array) ? [] : _args;

    let name: any = this.resolveNames(_name);

    name = this.resolveName(name[0]);

    if (name.namespace === "base") {
      for (const namespace in this._callbacks) {
        if (
          this._callbacks[namespace] instanceof Object &&
          this._callbacks[namespace][name.value] instanceof Array
        ) {
          this._callbacks[namespace][name.value].forEach(
            (callback: Function) => {
              result = callback.apply(this, args);

              if (typeof finalResult === "undefined") {
                finalResult = result;
              }
            }
          );
        }
      }
    } else if (this._callbacks[name.namespace] instanceof Object) {
      if (name.value === "") {
        console.warn("wrong name");
        return this;
      }

      this._callbacks[name.namespace][name.value].forEach(
        (callback: Function) => {
          result = callback.apply(this, args);

          if (typeof finalResult === "undefined") finalResult = result;
        }
      );
    }

    return finalResult;
  }

  resolveNames(_names: string) {
    let names: string | string[] = _names;
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, "");
    names = names.replace(/[,/]+/g, " ");
    names = names.split(" ");

    return names;
  }

  resolveName(name: string) {
    const newName = {
      original: "",
      value: "",
      namespace: "",
    };
    const parts = name.split(".");

    newName.original = name;
    newName.value = parts[0];
    newName.namespace = "base";

    if (parts.length > 1 && parts[1] !== "") {
      newName.namespace = parts[1];
    }

    return newName;
  }
}
