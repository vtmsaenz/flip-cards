// script.js
const cardContainer = document.getElementById('card-container');
const gradeButton = document.getElementById('grade-button');
const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('file-input');
const manualInputForm = document.getElementById('manual-input');
const addWordButton = document.getElementById('add-word');
const wordInput = document.getElementById('word');
const definitionInput = document.getElementById('definition');
let cards = [];

function createCard(word, definition) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">${word}</div>
            <div class="card-back">${definition}</div>
        </div>
    `;
    cardContainer.appendChild(card);
    card.addEventListener('click', () => {
        card.querySelector('.card-inner').classList.toggle('flipped');
    });
}

addWordButton.addEventListener('click', () => {
    const word = wordInput.value.trim();
    const definition = definitionInput.value.trim();
    if (word && definition) {
        cards.push({ word, definition, correct: false });
        createCard(word, definition);
        wordInput.value = '';
        definitionInput.value = '';
    }
});

uploadButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const content = JSON.parse(reader.result);
        content.forEach(({ word, definition }) => {
            cards.push({ word, definition, correct: false });
            createCard(word, definition);
        });
    };
    if (file) reader.readAsText(file);
});

gradeButton.addEventListener('click', () => {
    const scoreSection = document.getElementById('score-section');
    const correctCount = cards.filter(card => card.correct).length;
    const grade = ((correctCount / cards.length) * 100).toFixed(2);
    scoreSection.textContent = `Your grade: ${grade}% (${correctCount}/${cards.length} correct)`;
});

