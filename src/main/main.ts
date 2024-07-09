/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  IpcMainInvokeEvent,
  OpenDialogReturnValue,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Level } from 'level';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { initSettings } from './settings';
import { Customer } from '../core/customers/models/customer.model';
import { copyDirectory } from './folder';
import { generateCustomerDatasource } from './llm/generate';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let dbCustomers!: Level<string, Customer>;
const rootFilePath = path.join(app.getPath('documents'), 'xfiles');

const createDb = (dbPath: string) => {
  dbCustomers = new Level(dbPath, { valueEncoding: 'json' });
};

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    initSettings();
    createDb(path.join(rootFilePath, 'customers.db'));
    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) await createWindow();
    });
  })
  .catch(console.log);

ipcMain.handle(
  'showOpenFolderDialog',
  async (): Promise<OpenDialogReturnValue> => {
    // Select documents
    return dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory'],
    });
  },
);

ipcMain.handle(
  'addDocuments',
  async (
    _event: IpcMainInvokeEvent,
    customerName: string,
    folderName: string,
  ) => {
    // attach documents to customer
    const customer = await dbCustomers.get(customerName);
    if (!customer) throw new Error('Customer not found');

    const files = fs.readdirSync(folderName);
    customer.files = files;
    // eslint-disable-next-line consistent-return
    await dbCustomers.put(customer.name, customer);
    await copyDirectory(
      folderName,
      path.join(rootFilePath, customerName, 'data'),
    );
  },
);

ipcMain.handle(
  'createCustomer',
  async (_event: IpcMainInvokeEvent, customerName: string): Promise<void> => {
    await dbCustomers.put(customerName, { name: customerName, files: [] });
    await fs.promises.mkdir(path.join(rootFilePath, customerName, 'data'), {
      recursive: true,
    });
  },
);
ipcMain.handle(
  'generateDatasource',
  async (_event: IpcMainInvokeEvent, customerName: string) => {
    console.log('generateDatasource', path.join(rootFilePath, customerName))
    await generateCustomerDatasource(path.join(rootFilePath, customerName));
  },
);
