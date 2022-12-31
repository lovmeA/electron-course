const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron')
const path = require("path");
const WinState = require('electron-win-state').default

const winState = new WinState({
    defaultWidth: 1000,
    defaultHeight: 700
})

const mainTray = (win) => {
    const menu = Menu.buildFromTemplate([
        {
            label: '显示', click: () => {
                win.show()
            }
        },
        {
            label: '隐藏', click: () => {
                win.hide()
            }
        },
        {
            label: '退出', click: () => {
                win.isAppQuit = true
                app.quit()
            }
        }
    ])

    const tray = new Tray('Course.ico');
    tray.setToolTip("双击显示或隐藏")
    tray.setContextMenu(menu)
    tray.on('double-click', () => {
        win.isVisible() ? win.hide() : win.show()
    })
}

app.whenReady().then(() => {
    const win = new BrowserWindow({
        ...winState.winOptions,
        autoHideMenuBar: true,
        icon: 'Course.ico',
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainTray(win)
    winState.manage(win)
    win.loadFile('index.html')
    // win.webContents.openDevTools()
    Menu.setApplicationMenu(Menu.buildFromTemplate([]))
    win.on('ready-to-show', () => {
        win.show()
    })
    win.on('close', (e) => {
        if (win.isAppQuit) {
            app.quit()
        } else {
            win.hide()
            e.preventDefault()
        }
    })
})

ipcMain.handle('getCourseAllData', (event, courseName) => {
    return courseName
})

ipcMain.handle('getCourseSearch', (event, courseName) => {
    return courseName
})