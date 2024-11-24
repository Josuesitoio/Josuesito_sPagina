const grid = [
    ['A', 'B', 'A', 'C', 'K', 'E', 'N', 'D', 'B', 'O'],
    ['D', 'B', 'C', 'D', 'A', 'T', 'O', 'S', 'C', 'M'],
    ['S', 'R', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'T'],
    ['S', 'O', 'T', 'O', 'G', 'I', 'D', 'O', 'C', 'I'],
    ['S', 'M', 'F', 'U', 'N', 'C', 'I', 'O', 'N', 'R'],
    ['S', 'A', 'T', 'A', 'P', 'I', 'F', 'R', 'O', 'O'],
    ['A', 'G', 'I', 'L', 'I', 'D', 'A', 'D', 'S', 'G'],
    ['S', 'T', 'S', 'C', 'R', 'U', 'M', 'A', 'B', 'L'],
    ['C', 'T', 'E', 'S', 'T', 'E', 'O', 'N', 'T', 'A'],
    ['K', 'D', 'F', 'R', 'O', 'N', 'T', 'E', 'N', 'D']
];

const words = ["AGILIDAD", "CODIGO", "ALGORITMO", "TESTEO", "API", "SCRUM", "BACKEND", "FRONTEND", "DATOS", "FUNCION"];
const foundWords = new Set();
let selectedCells = [];
let isSelecting = false;

const wordSearch = document.getElementById("word-search");

// Generar la cuadrícula de letras
function createGrid() {
    grid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const cell = document.createElement('div');
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;

            // Iniciar selección
            cell.addEventListener('mousedown', (event) => {
                event.preventDefault(); // Evita la selección de texto
                startSelection(cell);
            });

            // Selección continua
            cell.addEventListener('mouseenter', () => {
                if (isSelecting) selectCell(cell);
            });

            // Finalizar selección
            cell.addEventListener('mouseup', endSelection);

            wordSearch.appendChild(cell);
        });
    });

    // Detiene la selección al soltar el mouse fuera de la cuadrícula
    document.addEventListener('mouseup', () => {
        isSelecting = false;
        checkWord();
    });
}

// Iniciar selección de celdas
function startSelection(cell) {
    isSelecting = true;
    selectedCells = [cell];
    cell.classList.add("selected");
}

// Agregar celdas en arrastre continuo
function selectCell(cell) {
    if (!selectedCells.includes(cell)) {
        cell.classList.add("selected");
        selectedCells.push(cell);
    }
}

// Terminar selección y verificar la palabra formada
function endSelection() {
    isSelecting = false;
    checkWord();
}

// Comprobar si la selección forma una palabra en la lista
function checkWord() {
    const selectedWord = selectedCells.map(cell => cell.textContent).join("");

    if (words.includes(selectedWord) && !foundWords.has(selectedWord)) {
        foundWords.add(selectedWord);
        markWordAsFound(selectedWord);
        keepSelection();
    } else {
        clearSelection();
    }
}

// Marcar la palabra como encontrada en la lista
function markWordAsFound(word) {
    document.getElementById(word).classList.add("found");
}

// Mantener las celdas seleccionadas como descubiertas
function keepSelection() {
    selectedCells.forEach(cell => cell.classList.add("discovered"));
    selectedCells = [];
}

// Limpiar la selección después de verificar una palabra
function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove("selected"));
    selectedCells = [];
}

createGrid();

// Menú responsive
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// Fondo animado personalizado (partículas conectadas)
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

let particlesArray;

// Manejar el cambio de tamaño de la ventana
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// Crear clase de Partícula
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Método para dibujar la partícula
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00adb5';
        ctx.fill();
    }

    // Método para actualizar la posición de la partícula
    update() {
        // Rebotar en los bordes
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        // Mover la partícula
        this.x += this.directionX;
        this.y += this.directionY;

        // Dibujar la partícula
        this.draw();
    }
}

// Crear arreglo de partículas
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / (window.innerWidth > 768 ? 9000 : 15000);
    for (let i = 0; i < numberOfParticles * 2; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * (innerWidth - size * 2)) + size * 2;
        let y = (Math.random() * (innerHeight - size * 2)) + size * 2;
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#00adb5';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Conectar las partículas
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(0, 173, 181,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animar las partículas
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();


