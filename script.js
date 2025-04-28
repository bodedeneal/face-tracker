const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const canvasCtx = canvasElement.getContext('2d');
const coordinatesDiv = document.getElementById('coordinates');

// MediaPipe Face Detection
const faceDetection = new FaceDetection.FaceDetection({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
});

faceDetection.setOptions({
  model: 'short', // Use the short-range model for close-range face detection
  minDetectionConfidence: 0.5,
});

faceDetection.onResults((results) => {
  // Clear the canvas for the next frame
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.detections.length > 0) {
    // Get the first detected face
    const face = results.detections[0];
    const boundingBox = face.boundingBox;

    // Calculate the center of the face
    const faceCenterX = boundingBox.xCenter * canvasElement.width;
    const faceCenterY = boundingBox.yCenter * canvasElement.height;

    // Update the coordinates display
    coordinatesDiv.textContent = `Coordinates: (${Math.round(faceCenterX)}, ${Math.round(faceCenterY)})`;

    // Draw a circle around the face
    const circleRadius = Math.min(boundingBox.width, boundingBox.height) * canvasElement.width / 2;
    canvasCtx.strokeStyle = 'red';
    canvasCtx.lineWidth = 4;
    canvasCtx.beginPath();
    canvasCtx.arc(faceCenterX, faceCenterY, circleRadius, 0, 2 * Math.PI);
    canvasCtx.stroke();
  } else {
    coordinatesDiv.textContent = 'Coordinates: (N/A, N/A)';
  }
});

// Function to initialize the webcam
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;

    videoElement.onloadeddata = () => {
      // Set the canvas dimensions to match the video feed
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // Start face detection
      function detect() {
        faceDetection.send({ image: videoElement });
        requestAnimationFrame(detect); // Continuously loop face detection
      }
      detect();
    };
  } catch (error) {
    alert('Error accessing the webcam: ' + error.message);
  }
}

// Start the webcam and face detection
initCamera();
