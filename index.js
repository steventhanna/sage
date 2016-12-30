const ipc = require('electron').ipcRenderer;

$(document).ready(function() {

  ipc.on('imageData', function(event, data) {
    console.log("INSIDE");
    console.log(data);
    document.getElementById('imageGrid').innerHTML = data;
  });

  document.ondragover = document.ondrop = (ev) => {
    ev.preventDefault()
  }

  document.body.ondrop = (ev) => {
    // Send the content to the main
    console.log(ev.dataTransfer.files);
    // ipc.send('dragDropFile', ev.dataTransfer.files);
    ev.preventDefault()
  }

});
