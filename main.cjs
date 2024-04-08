// kradzione z i odczytać: https://www.electronjs.org/docs/latest/tutorial/quick-start
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
	const browserWindow = new BrowserWindow({
		width: 800,
		height: 600,
	});

	// browserWindow.webContents.openDevTools();

	browserWindow.loadFile('src/index.html');
};

app.whenReady().then(() => {
	createWindow();
});
