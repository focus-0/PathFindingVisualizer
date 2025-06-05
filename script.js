let startx=0;
let starty=0;

let endx=0;
let endy=0;

const gridContainer = document.querySelector('.grid'); 

function createGrid(rows, cols) {
    gridContainer.innerHTML = ''; 

    for (let row = 0; row < rows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${row}-${col}`;
            rowDiv.appendChild(cell);
        }

        gridContainer.appendChild(rowDiv);
    }
}

createGrid(30, 30);



function randomMaze(Maze){

}


function dijkstra(Maze){

}

