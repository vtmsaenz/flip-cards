// script.js

// DOM Elements
const cardContainer = document.getElementById('card-container');
const gradeButton = document.getElementById('grade-button');
const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('file-input');
const addWordButton = document.getElementById('add-word');
const wordInput = document.getElementById('word');
const definitionInput = document.getElementById('definition');
const scoreSection = document.getElementById('score-section');

let cards = []; // Array to store card data
let currentIndex = 0; // Track the current card
let correctAnswers = 0;

// Function to display a single card
function displayCard(index) {
    cardContainer.innerHTML = ''; // Clear container

    if (index < cards.length) {
        const cardData = cards[index];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${cardData.word}</div>
                <div class="card-back">${cardData.definition}</div>
            </div>
        `;
        cardContainer.appendChild(card);

        // Add flip functionality
        const cardInner = card.querySelector('.card-inner');
        cardInner.addEventListener('click', () => {
            cardInner.classList.toggle('flipped');
        });

        // Show navigation buttons
        const navigation = document.createElement('div');
        navigation.innerHTML = `
            <button id="prev-button" ${index === 0 ? 'disabled' : ''}>Previous</button>
            <button id="next-button">${index === cards.length - 1 ? 'Finish' : 'Next'}</button>
        `;
        cardContainer.appendChild(navigation);

        // Add event listeners for navigation
        document.getElementById('prev-button').addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            displayCard(currentIndex);
        });

        document.getElementById('next-button').addEventListener('click', () => {
            checkCorrectness(() => {
                if (currentIndex < cards.length - 1) {
                    currentIndex++;
                    displayCard(currentIndex);
                } else {
                    gradeGame();
                }
            });
        });
    }
}

// Add card manually
addWordButton.addEventListener('click', () => {
    const word = wordInput.value.trim();
    const definition = definitionInput.value.trim();
    if (word && definition) {
        cards.push({ word, definition });
        wordInput.value = '';
        definitionInput.value = '';
        alert('Card added! Start quiz when ready.');
    }
});

// Upload card file
uploadButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const content = JSON.parse(reader.result);
        content.forEach(({ word, definition }) => {
            cards.push({ word, definition });
        });
        alert('Cards uploaded! Start quiz when ready.');
    };
    if (file) reader.readAsText(file);
});

// Function to check if the user got the current card correct
function checkCorrectness(callback) {
    const userCorrect = confirm(
        `Did you get this card correct? (Word: ${cards[currentIndex].word})`
    );
    if (userCorrect) {
        correctAnswers++;
    }
    callback();
}

// Grade the game
function gradeGame() {
    const score = ((correctAnswers / cards.length) * 100).toFixed(2);
    scoreSection.textContent = `Your final score: ${score}% (${correctAnswers}/${cards.length})`;

    // Reset game options
    const resetOption = document.createElement('button');
    resetOption.textContent = 'Restart';
    resetOption.addEventListener('click', () => {
        resetGame();
    });
    scoreSection.appendChild(resetOption);
}

// Reset the game
function resetGame() {
    currentIndex = 0;
    correctAnswers = 0;
    scoreSection.textContent = '';
    displayCard(currentIndex);
}

// Start the quiz when cards are ready
gradeButton.addEventListener('click', () => {
    if (cards.length === 0) {
        alert('Please add or upload cards first.');
    } else {
        currentIndex = 0;
        correctAnswers = 0;
        displayCard(currentIndex);
    }
});
