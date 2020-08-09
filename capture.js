(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var startbutton = null;

  var detector = AprilTags();

  var timer = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    startbutton = document.getElementById('startbutton');
    stopbutton = document.getElementById('stopbutton');

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function(err) {
      console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4/3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      startDetections();
      ev.preventDefault();
    }, false);
    stopbutton.addEventListener('click', function(ev){
      stopDetections();
      ev.preventDefault();
    }, false);
  }

  // Draw the detections.

  function drawDetections(detections) {
    var context = canvas.getContext('2d');
    // Set the stroke style
    var gradient = context.createLinearGradient(0, 0, 170, 0);
    gradient.addColorStop("0", "green");
    gradient.addColorStop("0.5" ,"red");
    gradient.addColorStop("1.0", "yellow");
    context.strokeStyle = gradient;
    context.lineWidth = 3;
    context.font = "14px Arial";

    context.fillStyle = "#FF0000";
    for (index in detections) {
      d = detections[index];
      console.log(d);
      context.beginPath();
      context.moveTo(d['x1'], d['y1']);
      context.lineTo(d['x2'], d['y2']);
      context.lineTo(d['x3'], d['y3']);
      context.lineTo(d['x4'], d['y4']);
      context.closePath();
      context.stroke();

      context.fillText("Tag " + d['id'].toString(), d['x3'], d['y3']);
    }
  }

  var detections = [];

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, width, height);

      // Do AprilTags detections
      detections = detector(canvas);
      // console.log(detections);
      drawDetections(detections);
    }
  }

  function startDetections() {
    timer = window.setInterval(takepicture, 500);
  }

  function stopDetections() {
    if (timer != null) {
      clearInterval(timer);
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();
