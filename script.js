// Editable sections with durations for green and red
const sections = [
  { type: 'green', duration: 1500 }, // Green section for left key (in ms)
  { type: 'red', duration: 1000 },   // Red section for right key (in ms)
  { type: 'green', duration: 1200 }, // Another green section for left key
  { type: 'red', duration: 1300 },   // Another red section for right key
];

let currentIndex = 0;
let startTime = null;
let missedBy = 0;
let currentDuration = 0;

// DOM Elements
const movingBar = document.getElementById("moving-bar");
const resultsDiv = document.getElementById("results");

// Function to update the moving bar's position and color
function updateMovingBar() {
  const section = sections[currentIndex];
  movingBar.style.width = '100%'; // Move bar across the container
  movingBar.style.transition = `width ${section.duration}ms linear`; // Duration for each section
  
  // Change color based on section type (green or red)
  movingBar.style.backgroundColor = section.type === 'green' ? 'green' : 'red';
}

// Function to handle key presses and timing feedback
function handleKeyPress(event) {
  if (currentIndex < sections.length && startTime !== null) {
    const section = sections[currentIndex];
    const duration = performance.now() - startTime;

    // Check if the key pressed matches the section type
    if ((section.type === 'green' && event.key === 'ArrowLeft') || (section.type === 'red' && event.key === 'ArrowRight')) {
      const accuracy = Math.abs(duration - section.duration);
      missedBy = accuracy;
      resultsDiv.innerHTML = `You missed by ${missedBy.toFixed(2)} ms.`;
    } else {
      missedBy = Math.abs(duration - section.duration);
      resultsDiv.innerHTML = `Wrong key! Missed by ${missedBy.toFixed(2)} ms.`;
    }

    // Move to the next section or finish the game
    currentIndex++;
    if (currentIndex < sections.length) {
      startTime = performance.now();
      updateMovingBar();
    } else {
      resultsDiv.innerHTML += "<br>Game Over!";
    }
  }
}

// Function to start the game
function startGame() {
  currentIndex = 0;
  missedBy = 0;
  startTime = performance.now();
  updateMovingBar();
}

// Event listener for key presses
window.addEventListener("keydown", handleKeyPress);

// Start the game immediately
startGame();
