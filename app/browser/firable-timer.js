'use strict';

export default class FirableTimer {
  constructor(callback) {
    if (typeof callback !== 'function') throw 'callback should be function';
    this._callback = callback;
    this._timerId = null;
  }

  run(timeout_ms) {
    this.cancel();
    this._timerId = setTimeout(() => {
      this._timerId = null;
      this._callback();
    }, timeout_ms);
  }

  cancel() {
    if (!this._timerId) return;
    clearTimeout(this._timerId);
    this._timerId = null;
  }

  fire() {
    if (!this._timerId) return;
    this.cancel();
    this._callback();
  }
}
