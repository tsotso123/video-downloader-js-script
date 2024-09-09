// Select the video element
const videoElement = document.getElementsByClassName('video-stream html5-main-video')[0];

// Array to store recorded chunks
let recordedChunks = [];

// Create a MediaStream from the video element
const stream = videoElement.captureStream();

// Create a MediaRecorder instance with the stream
const mediaRecorder = new MediaRecorder(stream,{
    audioBitsPerSecond : 5000000, // 128kbps audio bitrate
    videoBitsPerSecond : 2500000, // 2.5Mbps video bitrate
});

// Event to handle when data is available
mediaRecorder.ondataavailable = function(event) {
  if (event.data.size > 0) {
    
      try {
      recordedChunks.push(event.data);
    } catch (error) {
      console.error(error);
      // Expected output: ReferenceError: nonExistentFunction is not defined
      // (Note: the exact output may be browser-dependent)
    }

  }
};
videoElement.onratechange = null;
videoElement.playbackRate = 1;
videoElement.play();
// Start recording
mediaRecorder.start();

console.log('Recording started...');

// Stop recording after 10 seconds (adjust as needed)
setTimeout(function() {
    //videoElement.pause();
    videoElement.currentTime = videoElement.duration-2;
    setTimeout(function () {
          mediaRecorder.stop();
          console.log('Recording stopped.');
        
          // Download the recorded video
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
        
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'recorded-video.webm';
          document.body.appendChild(a);
          
          a.click();
        
          // Cleanup
          setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
    },3000);
  
}, 10000);  // Stop recording after 10 seconds (adjust as needed)