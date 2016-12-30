const ipc = require('electron').ipcRenderer;

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

ipc.on('loadingUpdate', (event, data) => {
  console.log("UPDATE: " + data[0]);
  document.getElementById('currentAnalysis').innerHTML = "Image Number: " + data[1] + " - " + data[0].status;
  $('#progressBar').css('width', (data[0].progress * 100) + '%').attr('aria-valuenow', (data.progress[0] * 100));
});

$(document).ready(function() {

});
