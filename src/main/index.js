import {app, BrowserWindow, ipcMain, Tray, Menu } from 'electron'

const {join} = require("path")

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow // 主视窗
let tray // 托盘

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  // --- 初始化窗口
  mainWindow = new BrowserWindow({
    height: 650,
    useContentSize: true,
    width: 1050,
    minWidth: 1050,
    minHeight: 650,
    frame: false,
    title: "网易云音乐 for electron",
    titleBarStyle: 'hidden'
  })
  // --- end

  // --- 托盘初始化
  tray = new Tray(join(__dirname, "../renderer/assets/images/icon.png"))
  const contextMenu = Menu.buildFromTemplate([
    { label: '暂停'},
    { label: '上一首'},
    { label: '下一首'},
    { label: '退出'},
  ])
  tray.setToolTip('网易云音乐 for electron')
  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  })
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  })
  // --- end

  // --- 监听鼠标返回按钮
  // --- end

  // --- 加载启动页
  mainWindow.loadURL(winURL)
  // --- end

  // --- 监听win关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // --- end

  // --- 监听render
  ipcMain.on('min', e => mainWindow.minimize());
  ipcMain.on('max', e => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      e.sender.send("isMax", false)
    } else {
      mainWindow.maximize()
      e.sender.send("isMax", true)
    }
  });
  ipcMain.on('close', e => mainWindow.close());
  // --- end
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
