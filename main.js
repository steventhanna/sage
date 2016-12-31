/**
 * Sage
 * A stand-alone application to search through images by the text that hey contain
 * using Electron.
 * @author Steven T Hanna :: github.com/steventhanna
 */

const {
  app,
  BrowserWindow
} = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;
const fs = require('fs');
const ejs = require('ejs');
const storage = require('electron-json-storage');
const async = require('async');
var Tesseract = require('tesseract.js');
var Fuse = require('fuse.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

let loadingModal;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden'
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  updateImageGrid();
  // Open the DevTools.
  win.webContents.openDevTools();

  win.once('ready-to-show', () => {
    updateImageGrid();
    win.show();
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

function createLoadingModal() {
  loadingModal = new BrowserWindow({
    parent: win,
    modal: true,
    width: 600,
    height: 400
  });

  loadingModal.loadURL(url.format({
    pathname: path.join(__dirname, 'loadingModal.html'),
    protocol: 'file:',
    slashes: true
  }))

  loadingModal.once('ready-to-show', () => {
    loadingModal.show();
  });

  loadingModal.on('closed', () => {
    loadingModal = null;
  });
}

/**
 * error function.  Sends an error message to the renderer process
 * @param type :: common bootstrap error types.  'succcess', 'danger', 'warning'
 * @param message :: the message of the error
 */
function error(type, message) {
  var data = {
    type: type,
    message: message
  };
  win.webContents.send('error', data);
}

function getSetting(key, callback) {
  storage.get(key, function(err, data) {
    if (err || data == undefined) {
      console.log("There was an error getting the setting.");
      console.log("Error = " + err);
      error('danger', "<strong>Uh-Oh!</strong> There was an error getting the setting: " + key + ".");
    } else {
      callback(data);
    }
  });
}

function getAllSettings(callback) {
  storage.getAll(function(err, data) {
    if (err || data == undefined) {
      console.log("There was an error getting all of the settings.");
      console.log("Error = " + err);
      error('danger', "<strong>Uh-Oh!</strong> There was an error getting all of the settings.");
    } else {
      callback(data);
    }
  });
}

function setSetting(name, key, value, callback) {
  getSetting('settings', function(temp) {
    temp[key] = value;
    storage.set(name, temp, function(err) {
      if (err) {
        console.log("There was an error saving the setting.");
        console.log("Error = " + err);
        error('danger', "<strong>Uh-Oh!</strong> There was an error saving the setting: " + name + ", " + key + ", " + value + ".");
      } else {
        callback();
      }
    });
  });
}

// Attempt to get the setting on start
getSetting('settings', function(settings) {
  if (settings.lastImageSet != undefined) {
    images = settings.lastImageSet;
  }
  updateImageGrid();
});

var images = [];

ipc.on('searchChange', function(event, data) {
  if (data === "") {
    updateImageSearchGrid(images);
  } else {
    var options = {
      keys: ["content"]
    };
    var fuse = new Fuse(images, options);
    console.log(JSON.stringify(images));
    var temp = fuse.search(data);
    console.log(temp);
    updateImageSearchGrid(temp);
  }
});

ipc.on('dragDropFile', function(event, data) {
  // Analyze the images, then concat the data
  // error('success', "<strong>Analyzing...</strong> This might take some time, the page will update when ready.");
  // console.log("DRAG");
  var counter = 0;
  createLoadingModal();
  async.map(data, function(image) {
    Tesseract.recognize(image.path).progress(message => loadingModal.webContents.send('loadingUpdate', [message, counter + 1])).then(function(result) {
      console.log(result.text);
      // Build the string from the array
      image.content = result.text;
      counter++;
      if (counter == data.length) {
        images = images.concat(data);
        updateImageGrid();
        return;
      }
      return image;
    });
  }, function(err, result) {
    console.log(JSON.stringify(result));
    images = images.concat(result);
    upadateImageGrid();
  });
});

ipc.on('clearSearch', function(event, data) {
  images = [];
  // Manually update the setting
  setSetting('settings', 'lastImageSet', undefined, function() {
    updateImageGrid();
  });
});

ipc.on('renderImage', function() {
  updateImageGrid();
});

function updateImageSearchGrid(img) {
  var values = {
    images: img,
    search: true
  };
  var data = ejs.renderFile('components/imageGrid.ejs', values, function(err, str) {
    if (err || str == undefined) {
      console.log("There was an error rendering the EJS file.");
      console.log("Error = " + err);
      error('danger', "<strong>Uh-Oh!</strong> There was an error rendering the component.");
    } else {
      if (loadingModal != undefined) {
        sendNotification("Sage", "Image Analaysis Complete");
        loadingModal.close();
      }
      win.webContents.send('imageData', str);
    }
  });
}

function updateImageGrid() {
  var values = {
    images: images,
    search: false
  };
  var data = ejs.renderFile('components/imageGrid.ejs', values, function(err, str) {
    if (err || str == undefined) {
      console.log("There was an error rendering the EJS file.");
      console.log("Error = " + err);
      error('danger', "<strong>Uh-Oh!</strong> There was an error rendering the component.");
    } else {
      // Update the settings
      if (images != undefined && images.length > 0) {
        setSetting('settings', 'lastImageSet', images, function() {
          console.log("Setting should be set. Lets check");
          getSetting('settings', function(data) {
            console.log(JSON.stringify(data));
          });
        });
      }
      if (loadingModal != undefined) {
        sendNotification("Sage", "Image Analysis Complete");
        loadingModal.close();
      }
      win.webContents.send('imageData', str);
    }
  });
}

function sendNotification(title, content) {
  var option = {
    title: title,
    body: content
  };
  win.webContents.send('notification', option);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
});
