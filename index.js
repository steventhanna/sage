const ipc = require('electron').ipcRenderer;
const shell = require('electron').shell;

/**
 * error function handles errors sent from the main process.
 * Errors should appear on the rendered side of the display.
 */
ipc.on('error', (event, errorMessage) => {
  var type = errorMessage.type;
  var message = errorMessage.message;
  document.getElementById('error').innerHTML = '<div style="margin-right: 10px; position: relative;" class="alert alert-' + type + ' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + message + '</div>';
  $("#errorBar").fadeIn();
  $("#error").fadeIn();
  window.setTimeout(function() {
    var alertT = '.alert-' + type;
    // TODO :: Implement JQuery fade out of alert.
    $("#error").fadeOut();
    $("#errorBar").fadeOut();
    // $(alertT).alert('close');
  }, 10000);
});

ipc.on('notification', function(err, data) {
  new Notification(data.title, data);
});

$(document).ready(function() {
  console.log("READY");

  ipc.on('imageData', function(event, data) {
    console.log("IMAGE RUN");
    console.log(data);
    document.getElementById('imageGrid').innerHTML = data;
  });

  $("#restoreImageGroupButton").click(function() {
    ipc.send('renderImage');
  });

  document.ondragover = document.ondrop = (ev) => {
    ev.preventDefault()
  }

  $("#clearSearch").click(function() {
    ipc.send('clearSearch', undefined);
  });

  function openImage(imagePath) {
    shell.openItem(imagePath);
  }

  $("#openImageButton").click(function() {
    // Get the value
    var val = $("#openImageButton").val();
    console.log(val);
    shell.openItem(val);
  });

  document.body.ondrop = (ev) => {
    // Send the content to the main
    var images = [];
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      var temp = {
        name: ev.dataTransfer.files[i].name,
        path: ev.dataTransfer.files[i].path,
        type: ev.dataTransfer.files[i].type,
        content: ""
      };
      images.push(temp);
    }
    ipc.send('dragDropFile', images);
    ev.preventDefault()
  }

});
