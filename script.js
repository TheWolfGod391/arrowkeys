const sequence = [
  { key: "ArrowLeft", time: 1500 },
  { key: "ArrowRight", time: 2000 },
  { key: "ArrowLeft", time: 1000 },
];

let currentIndex = 0;
let startTime = null;

// DOM elements
const resultsDiv = document.getElementById("results");
const sequenceDiv = document.getElementById("sequence");
const progressBar = document.getElementById("progress-bar");

// Function to show the sequence
function showSequence() {
  sequenceDiv.innerHTML = sequence
    .map((item, index) => 
      `<span ${index === currentIndex ? 'style="font-weight:bold;"' : ''}>
         ${item.key} (${item.time / 1000}s)
       </span>`
    ).join(" ➔ ");
}

// Function to update the progress bar
function updateProgressBar() {
  const progressPercent = ((currentIndex + 1) / sequence.length) * 100;
  progressBar.style.width = `${progressPercent}%`; // Adjust width
}

// Function to check the timing of key presses
function checkTiming(key, duration) {
  const target = sequence[currentIndex];
  if (key === target.key) {
    const accuracy = Math.abs(duration - target.time);
    resultsDiv.innerHTML += `<div class="result">Pressed ${key}: ${duration}ms (accuracy: ±${accuracy}ms)</div>`;
    currentIndex++;
    updateProgressBar(); // Update the progress bar when progressing
    if (currentIndex < sequence.length) {
      startTime = performance.now(); // Reset start time for the next key
    } else {
      resultsDiv.innerHTML += `<div class="result">Sequence Complete!</div>`;
    }
  } else {
    resultsDiv.innerHTML += `<div class="missed">Wrong key: ${key}</div>`;
  }
}

// Keydown event listener
window.addEventListener("keydown", (event) => {
  if (currentIndex < sequence.length && startTime !== null) {
    const duration = performance.now() - startTime;
    checkTiming(event.key, duration);
    startTime = performance.now(); // Reset start time for the next key
  }
});

// Function to start the game
function startGame() {
  resultsDiv.innerHTML = "";
  currentIndex = 0;
  startTime = performance.now();
  progressBar.style.width = "0%"; // Reset progress bar
  showSequence();
}

// Start the game
startGame();
