import { app, ipcMain } from 'electron';

import { EVENT_ERROR_THROWN } from '../ipc';

export const relaunchApp = (...args) => {
	const command = process.argv.slice(1, app.isPackaged ? 1 : 2);
	app.relaunch({ args: [...command, ...args] });
	app.exit();
};

export const setupApp = (reduxStore, rootWindow) => {
	app.addListener('activate', () => {
		rootWindow.showInactive();
		rootWindow.focus();
	});

	app.addListener('before-quit', () => {
		if (rootWindow.isDestroyed()) {
			return;
		}

		rootWindow.destroy();
	});

	app.addListener('second-instance', () => {
		rootWindow.showInactive();
		rootWindow.focus();
	});

	app.addListener('window-all-closed', () => {
		app.quit();
	});

	ipcMain.addListener(EVENT_ERROR_THROWN, (event, error) => {
		console.error(error);
	});
};
