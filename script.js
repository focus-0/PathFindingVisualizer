document.addEventListener('DOMContentLoaded', () => {
    new PathfindingVisualizer();
});

class PathfindingVisualizer {
    constructor() {
        this.gridSize = window.innerWidth <= 768 ? 20 : 25;
        this.grid = [];
        this.startPos = { row: 1, col: 1 };
        this.endPos = { row: this.gridSize - 2, col: this.gridSize - 2 };
        this.isAnimating = false;
        this.isDrawing = false; 

        this.gridElement = document.getElementById('grid');
        this.mazeAlgoSelect = document.getElementById('mazeAlgorithm');
        this.pathAlgoSelect = document.getElementById('pathAlgorithm');

        this.initializeGrid();
        this.setupEventListeners();
        this.render();
    }

    initializeGrid() {
        this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.gridElement.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;

        this.grid = [];
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col] = {
                    row,
                    col,
                    isWall: false,
                    isStart: row === this.startPos.row && col === this.startPos.col,
                    isEnd: row === this.endPos.row && col === this.endPos.col,
                    isVisited: false,
                    isPath: false,
                    distance: Infinity,
                    previousNode: null,
                    fScore: Infinity,
                    gScore: Infinity,
                    hScore: 0,
                };
            }
        }
    }

    render() {
        this.gridElement.innerHTML = '';
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${row}-${col}`;
                const node = this.grid[row][col];

                if (node.isStart) cell.classList.add('start');
                else if (node.isEnd) cell.classList.add('end');
                else if (node.isWall) cell.classList.add('wall');
                else if (node.isPath) cell.classList.add('path');
                else if (node.isVisited) cell.classList.add('visited');

                this.gridElement.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('generateMaze').addEventListener('click', () => this.generateMaze());
        document.getElementById('clearMaze').addEventListener('click', () => this.clearMaze());
        document.getElementById('findPath').addEventListener('click', () => this.findPath());
        document.getElementById('clearPath').addEventListener('click', () => this.clearPath());

        this.gridElement.addEventListener('mousedown', e => {
            if (this.isAnimating) return;
            const targetCell = e.target.closest('.cell');
            if (targetCell) {
                this.isDrawing = true;
                this.toggleWallFromElement(targetCell);
            }
        });

        this.gridElement.addEventListener('mousemove', e => {
            if (!this.isDrawing || this.isAnimating) return;
            const targetCell = e.target.closest('.cell');
            if (targetCell) {
                const [row, col] = this.getCoordsFromId(targetCell.id);
                const node = this.grid[row][col];
                if (!node.isStart && !node.isEnd && !node.isWall) {
                    this.toggleWall(row, col);
                }
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
    }

    getCoordsFromId(id) {
        return id.split('-').slice(1).map(Number);
    }

    toggleWallFromElement(element) {
        const [row, col] = this.getCoordsFromId(element.id);
        this.toggleWall(row, col);
    }

    toggleWall(row, col) {
        const node = this.grid[row][col];
        if (!node.isStart && !node.isEnd) {
            node.isWall = !node.isWall;
            const cellElement = document.getElementById(`cell-${row}-${col}`);
            if (cellElement) {
                cellElement.classList.toggle('wall', node.isWall);
            }
        }
    }

    async generateMaze() {
        if (this.isAnimating) return;
        this.setAnimating(true);
        
        try {
            this.clearMaze(true);

            const algorithm = this.mazeAlgoSelect.value;
            if (algorithm === 'random') {
                await this.generateRandomMaze();
            } else if (algorithm === 'kruskal') {
                await this.generateKruskalMaze();
            }
            
        
            this.ensureStartEndAccessible();
        } catch (error) {
            console.error('Error generating maze:', error);
        } finally {
            this.setAnimating(false);
        }
    }

    ensureStartEndAccessible() {
    
        this.grid[this.startPos.row][this.startPos.col].isWall = false;
        this.grid[this.endPos.row][this.endPos.col].isWall = false;
        
        const startCell = document.getElementById(`cell-${this.startPos.row}-${this.startPos.col}`);
        const endCell = document.getElementById(`cell-${this.endPos.row}-${this.endPos.col}`);
        
        if (startCell) startCell.classList.remove('wall');
        if (endCell) endCell.classList.remove('wall');
    }

    async generateRandomMaze() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col].isStart && !this.grid[row][col].isEnd) {
                    if (Math.random() < 0.3) {
                        this.toggleWall(row, col);
                    }
                }
            }
        }
    }

    async generateKruskalMaze() {

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col].isStart && !this.grid[row][col].isEnd) {
                    this.grid[row][col].isWall = true;
                }
            }
        }
        this.render();

        const edges = [];
        for (let row = 1; row < this.gridSize - 1; row += 2) {
            for (let col = 1; col < this.gridSize - 1; col += 2) {
           
                this.grid[row][col].isWall = false;
                const cellElement = document.getElementById(`cell-${row}-${col}`);
                if (cellElement) {
                    cellElement.classList.remove('wall');
                }


                if (col + 2 < this.gridSize - 1) {
                    edges.push({
                        wall: { row: row, col: col + 1 },
                        cell1: { row: row, col: col },
                        cell2: { row: row, col: col + 2 }
                    });
                }

               
                if (row + 2 < this.gridSize - 1) {
                    edges.push({
                        wall: { row: row + 1, col: col },
                        cell1: { row: row, col: col },
                        cell2: { row: row + 2, col: col }
                    });
                }
            }
        }


        for (let i = edges.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [edges[i], edges[j]] = [edges[j], edges[i]];
        }

       
        const unionFind = new UnionFind();
        for (let row = 1; row < this.gridSize - 1; row += 2) {
            for (let col = 1; col < this.gridSize - 1; col += 2) {
                unionFind.makeSet(`${row}-${col}`);
            }
        }


        for (const edge of edges) {
            const cell1Key = `${edge.cell1.row}-${edge.cell1.col}`;
            const cell2Key = `${edge.cell2.row}-${edge.cell2.col}`;

      
            if (unionFind.find(cell1Key) !== unionFind.find(cell2Key)) {
                unionFind.union(cell1Key, cell2Key);

            
                const wallRow = edge.wall.row;
                const wallCol = edge.wall.col;
                this.grid[wallRow][wallCol].isWall = false;
                const wallElement = document.getElementById(`cell-${wallRow}-${wallCol}`);
                if (wallElement) {
                    wallElement.classList.remove('wall');
                }

           
                this.grid[edge.cell2.row][edge.cell2.col].isWall = false;
                const cell2Element = document.getElementById(`cell-${edge.cell2.row}-${edge.cell2.col}`);
                if (cell2Element) {
                    cell2Element.classList.remove('wall');
                }

                await this.sleep(15);
            }
        }
    }

    async findPath() {
        if (this.isAnimating) return;
        this.setAnimating(true);
        
        try {
            this.clearPath(true);

            const algorithm = this.pathAlgoSelect.value;
            let pathFound = false;
            if (algorithm === 'bfs') {
                pathFound = await this.breadthFirstSearch();
            } else if (algorithm === 'astar') {
                pathFound = await this.aStarSearch();
            }

            if (pathFound) {
                await this.animatePath(pathFound);
            }
        } catch (error) {
            console.error('Error finding path:', error);
        } finally {
            this.setAnimating(false);
        }
    }

    async breadthFirstSearch() {
        const startNode = this.grid[this.startPos.row][this.startPos.col];
        const queue = [startNode];
        startNode.isVisited = true;

        while (queue.length > 0) {
            const currentNode = queue.shift();

            if (currentNode.isEnd) return currentNode; 

            const neighbors = this.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (!neighbor.isVisited && !neighbor.isWall) {
                    neighbor.isVisited = true;
                    neighbor.previousNode = currentNode;
                    queue.push(neighbor);
                    if (!neighbor.isEnd) {
                        const cellElement = document.getElementById(`cell-${neighbor.row}-${neighbor.col}`);
                        if (cellElement) {
                            cellElement.classList.add('visited');
                        }
                        await this.sleep(5);
                    }
                }
            }
        }
        return false; // No path found
    }

    async aStarSearch() {
        const startNode = this.grid[this.startPos.row][this.startPos.col];
        const endNode = this.grid[this.endPos.row][this.endPos.col];
        const openSet = new MinHeap();
        const closedSet = new Set();

        startNode.gScore = 0;
        startNode.hScore = this.heuristic(startNode, endNode);
        startNode.fScore = startNode.hScore;
        openSet.add(startNode);

        while (!openSet.isEmpty()) {
            const currentNode = openSet.poll();

            if (currentNode.isEnd) return currentNode; 

            closedSet.add(currentNode);

            if (!currentNode.isStart && !currentNode.isEnd) {
                const cellElement = document.getElementById(`cell-${currentNode.row}-${currentNode.col}`);
                if (cellElement) {
                    cellElement.classList.add('visited');
                }
                await this.sleep(5);
            }

            const neighbors = this.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (closedSet.has(neighbor) || neighbor.isWall) continue;

                const tentativeGScore = currentNode.gScore + 1;
                if (tentativeGScore < neighbor.gScore) {
                    neighbor.previousNode = currentNode;
                    neighbor.gScore = tentativeGScore;
                    neighbor.hScore = this.heuristic(neighbor, endNode);
                    neighbor.fScore = neighbor.gScore + neighbor.hScore;

                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    } else {
                        openSet.update(neighbor);
                    }
                }
            }
        }
        return false; 
    }

    clearMaze(skipRender = false) {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col].isWall = false;
            }
        }
        this.clearPath(skipRender);
    }

    clearPath(skipRender = false) {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const node = this.grid[row][col];
                node.isVisited = false;
                node.isPath = false;
                node.distance = Infinity;
                node.previousNode = null;
                node.fScore = Infinity;
                node.gScore = Infinity;
                node.hScore = 0;
            }
        }
        if (!skipRender) this.render();
    }

    heuristic(nodeA, nodeB) {
        // Manhattan distance
        return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
    }

    getNeighbors(node, distance = 1, includeWalls = false) {
        const neighbors = [];
        const { row, col } = node;
        const directions = [
            [-distance, 0], [distance, 0], [0, -distance], [0, distance]
        ];

        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;

            if (this.isInBounds(newRow, newCol)) {
                const neighborNode = this.grid[newRow][newCol];
                if (includeWalls || !neighborNode.isWall) {
                    neighbors.push(neighborNode);
                }
            }
        }
        return neighbors;
    }

    async animatePath(endNode) {
        const path = [];
        let currentNode = endNode;
        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }

        for (const node of path) {
            if (!node.isStart && !node.isEnd) {
                const cellElement = document.getElementById(`cell-${node.row}-${node.col}`);
                if (cellElement) {
                    cellElement.classList.add('path');
                }
                await this.sleep(25);
            }
        }
    }

    isInBounds(row, col) {
        return row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setAnimating(isAnimating) {
        this.isAnimating = isAnimating;
        document.querySelectorAll('.controls button, .controls select').forEach(el => {
            el.disabled = isAnimating;
        });
    }
}

class UnionFind {
    constructor() {
        this.parent = new Map();
        this.rank = new Map();
    }

    makeSet(x) {
        this.parent.set(x, x);
        this.rank.set(x, 0);
    }

    find(x) {
        if (this.parent.get(x) !== x) {
            this.parent.set(x, this.find(this.parent.get(x)));
        }
        return this.parent.get(x);
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX !== rootY) {
            // Union by rank
            if (this.rank.get(rootX) < this.rank.get(rootY)) {
                this.parent.set(rootX, rootY);
            } else if (this.rank.get(rootX) > this.rank.get(rootY)) {
                this.parent.set(rootY, rootX);
            } else {
                this.parent.set(rootY, rootX);
                this.rank.set(rootX, this.rank.get(rootX) + 1);
            }
        }
    }
}


class MinHeap {
    constructor() {
        this.heap = [];
        this.positions = new Map();
    }
    
    add(node) {
        this.heap.push(node);
        this.positions.set(node, this.heap.length - 1);
        this.heapifyUp(this.heap.length - 1);
    }
    
    poll() {
        if (this.isEmpty()) return null;
        this.swap(0, this.heap.length - 1);
        const polledNode = this.heap.pop();
        this.positions.delete(polledNode);
        if (!this.isEmpty()) this.heapifyDown(0);
        return polledNode;
    }
    
    update(node) {
        const pos = this.positions.get(node);
        if (pos !== undefined) this.heapifyUp(pos);
    }
    
    heapifyUp(index) {
        let parentIndex = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[index].fScore < this.heap[parentIndex].fScore) {
            this.swap(index, parentIndex);
            index = parentIndex;
            parentIndex = Math.floor((index - 1) / 2);
        }
    }
    
    heapifyDown(index) {
        let smallest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        if (left < this.heap.length && this.heap[left].fScore < this.heap[smallest].fScore) smallest = left;
        if (right < this.heap.length && this.heap[right].fScore < this.heap[smallest].fScore) smallest = right;
        if (smallest !== index) {
            this.swap(index, smallest);
            this.heapifyDown(smallest);
        }
    }
    
    swap(i, j) {
        this.positions.set(this.heap[i], j);
        this.positions.set(this.heap[j], i);
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    isEmpty() { return this.heap.length === 0; }
    has(node) { return this.positions.has(node); }
}