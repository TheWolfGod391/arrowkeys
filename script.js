// Editable sections with durations for green, red, and grey
const sections = [
  { type: 'green', duration: 150000 }, // Green section for left key (in ms)
  { type: 'grey', duration: 100000 },  // Grey section (no key press)
  { type: 'red', duration: 120000 },   // Red section for right key
  { type: 'green', duration: 130000 }, // Green section for left key
  { type: 'grey', duration: 80000 },  // Grey section (no key press)
  { type: 'red', duration: 100000 },   // Red section for right key
];

let currentIndex = 0;
let startTime = null;
let missedBy = 0;
let currentDuration = 0;

// DOM Elements
const movingBar = document.getElementById("moving-bar");
const resultsDiv = document.getElementById("results");
const indicator = document.getElementById("indicator");

// Function to update the moving bar and add sections
function updateMovingBar() {
  const containerWidth = document.getElementById("moving-bar-container").clientWidth;
  movingBar.innerHTML = ''; // Clear previous sections

  // Create the sections inside the bar
  sections.forEach(section => {
    const sectionElement = document.createElement("div");
    sectionElement.classList.add(section.type);
    const sectionWidth = (section.duration / getTotalDuration()) * containerWidth; // Calculate width
    sectionElement.style.width = `${sectionWidth}px`;
    movingBar.appendChild(sectionElement);
  });

  // Position the bar to the left based on the current section
  const barWidth = movingBar.offsetWidth;
  movingBar.style.transform = `translateX(-${barWidth}px)`;
}

// Function to get total duration of all sections (used for resizing)
function getTotalDuration() {
  return sections.reduce((total, section) => total + section.duration, 0);
}

function moveIndicator() {
  const totalDuration = getTotalDuration(); // Total duration of all sections
  const section = sections[currentIndex];

  // Calculate how much the indicator moves for this section
  const containerWidth = document.getElementById("moving-bar-container").clientWidth;
  const indicatorPosition = (section.duration / totalDuration) * containerWidth;

  // Add delay to the movement speed, e.g., multiply duration by 1.5 to slow it down
  indicator.style.transition = `left ${(section.duration * 1.5) / 1000}s linear`; // Slow down by increasing time
  indicator.style.left = `${indicatorPosition}px`;

  const currentTime = performance.now() - startTime;

  // Check if it's time to move to the next section based on current time
  if (currentTime >= section.duration) {
    if ((section.type === 'green' && event.key === 'ArrowLeft') ||
        (section.type === 'red' && event.key === 'ArrowRight') ||
        (section.type === 'grey' && !event.key)) {
      // Provide timing feedback
      const accuracy = Math.abs(currentTime - section.duration);
      missedBy = accuracy;
      resultsDiv.innerHTML = `You missed by ${missedBy.toFixed(2)} ms.`;
    }

    // Move to the next section or finish
    currentIndex++;
    if (currentIndex < sections.length) {
      startTime = performance.now();
      moveIndicator();  // Continue with the next section
    } else {
      resultsDiv.innerHTML += "<br>Game Over!";
    }
  }
}

// Function to handle key presses
function handleKeyPress(event) {
  if (currentIndex < sections.length && startTime !== null) {
    moveIndicator();
  }
}

// Function to start the game
function startGame() {
  currentIndex = 0;
  missedBy = 0;
  startTime = performance.now();
  updateMovingBar();
  moveIndicator();
}
// Function to reset the game
function resetGame() {
  currentIndex = 0;      // Reset to the first section
  missedBy = 0;          // Clear the missed by value
  startTime = performance.now();  // Restart the timer
  updateMovingBar();     // Re-render the moving bar
  moveIndicator();       // Reset the indicator to the start
  resultsDiv.innerHTML = ''; // Clear previous results
}

// Combined keydown event listener
window.addEventListener("keydown", (event) => {
  // Reset the game when the "R" key is pressed (either uppercase or lowercase)
  if (event.key.toLowerCase() === 'r') {
    resetGame();  // Call the reset function
  } else {
    // Handle key presses for game (i.e., detecting if the player presses the correct key)
    if (currentIndex < sections.length && startTime !== null) {
      moveIndicator(); // Update the indicator position
      handleKeyPress(event); // Continue normal game handling
    }
  }
});


// Start the game immediately
startGame();
