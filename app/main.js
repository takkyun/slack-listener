'use strict';

import electron from "electron";
import AppWindow from './browser/app-window';

const crashReporter = electron.crashReporter;
if (process.env.NODE_ENV === 'develop') {
  crashReporter.start();
}

const app = electron.app;
app.on("window-all-closed", () => {
  app.quit();
});

let mainWindow = null;
app.on('ready', () => {
  const RootPath = 'file://' + __dirname + '/renderer/index.html';
  if (!mainWindow) {
    mainWindow = new AppWindow(RootPath);
  }
});
