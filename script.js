// Editable sections with durations for green, red, and grey
const sections = [
  { type: 'green', duration: 1500 }, // Green section for left key (in ms)
  { type: 'grey', duration: 1000 },  // Grey section (no key press)
  { type: 'red', duration: 1200 },   // Red section for right key
  { type: 'green', duration: 1300 }, // Green section for left key
  { type: 'grey', duration: 800 },  // Grey section (no key press)
  { type: 'red', duration: 1000 },   // Red section for right key
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

// Function to move the indicator and check key presses
function moveIndicator() {
  const totalDuration = getTotalDuration();
  const section = sections[currentIndex];

  // Move the indicator across the bar
  const containerWidth = document.getElementById("moving-bar-container").clientWidth;
  const indicatorPosition = (section.duration / totalDuration) * containerWidth;
  indicator.style.left = `${indicatorPosition}px`;

  // Check if the key is pressed at the right time
  const currentTime = performance.now() - startTime;
  if ((section.type === 'green' && currentTime >= section.duration) || 
      (section.type === 'red' && currentTime >= section.duration) ||
      (section.type === 'grey' && currentTime >= section.duration)) {
    if ((section.type === 'green' && event.key === 'ArrowLeft') ||
        (section.type === 'red' && event.key === 'ArrowRight') ||
        (section.type === 'grey' && !event.key)) {
      // Add timing feedback
      const accuracy = Math.abs(currentTime - section.duration);
      missedBy = accuracy;
      resultsDiv.innerHTML = `You missed by ${missedBy.toFixed(2)} ms.`;
    }

    // Move to next section or finish
    currentIndex++;
    if (currentIndex < sections.length) {
      startTime = performance.now();
      moveIndicator();
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

// Event listener for key presses
window.addEventListener("keydown", handleKeyPress);

// Start the game immediately
startGame();
