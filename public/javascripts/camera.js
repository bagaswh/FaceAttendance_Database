/* (function() {
  var videoElement = document.getElementById('camera');

  var imageCapture;
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    videoElement.srcObject = stream;

    var videoTrack = stream.getVideoTracks()[0];
    imageCapture = new ImageCapture(videoTrack);
  });

  var canvas = document.getElementById('grabbed-frame');
  var canvasOpenCVOutput = document.getElementById('cv-output');
  var INTERVAL = 2000;
  // grab frame every INTERVAL
  setInterval(function() {
    if (!imageCapture) return;

    imageCapture.grabFrame().then(function(bitmap) {
      drawImage(bitmap);
      var blob = canvas.toBlob();
      // fetch();
      mat.delete();
    });
  }, INTERVAL);

  var context = canvas.getContext('2d');
  function drawImage(img) {
    canvas.width = img.width;
    canvas.height = img.height;

    var x = canvas.width - img.width;
    var y = canvas.height - img.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, img.width, img.height, x, y, img.width, img.height);
  }
})();
 */
