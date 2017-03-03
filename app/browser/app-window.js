'use strict';

import electron from "electron";
import Storage from 'electron-json-storage';

const WindowPrefs = 'user_window_pref';
const BrowserWindow = electron.BrowserWindow;

export default class AppWindow {

  constructor(basePath) {
    this.base_path = basePath;
    this.prefs = null;
    this.browser_window = null;
    this.loadPrefs(() => {
      this.setupWindow();
    });
  }

  loadPrefs(callback) {
    Storage.get(WindowPrefs,(error,data) => {
      if (error) {
        console.log(error);
        this.prefs = {};
      }
      else {
        this.prefs = data;
      }
      callback();
    });
  }

  updatePrefs() {
    this.prefs['fullscreen'] = this.browser_window.isFullScreen();
    if (!this.prefs['fullscreen']) {
      const bounds = this.browser_window.getBounds();
      Object.keys(bounds).forEach((key) => {
        this.prefs[key] = bounds[key];
      });
    }
    this.prefs['fullscreenable'] = true;
    Storage.set(WindowPrefs,this.prefs,(error,data) => {
      if (error) {
        console.log(error);
      }
    });
  }

  setupWindow() {
    if (this.browser_window) return;

    const options = this.prefs;
    const browser_window = new BrowserWindow(options);
    browser_window.on('closed', () => { this.browser_window = null; } );

    const updateWindowPrefs = () => { this.updatePrefs(); };
    browser_window.on('resize', updateWindowPrefs );
    browser_window.on('move', updateWindowPrefs );
    browser_window.on('maximize', updateWindowPrefs );
    browser_window.on('unmaximize', updateWindowPrefs );
    browser_window.on('enter-full-screen', updateWindowPrefs );
    browser_window.on('leave-full-screen', updateWindowPrefs );

    browser_window.loadURL(this.base_path);

    this.browser_window = browser_window;
  }
}
