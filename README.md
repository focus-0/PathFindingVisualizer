# Pathfinding Visualizer

A interactive web-based pathfinding visualizer that demonstrates popular maze generation and pathfinding algorithms with smooth animations. Built with vanilla JavaScript, HTML, and CSS.

## 🎯 Features

- **Interactive Grid**: Click and drag to create walls manually
- **Maze Generation Algorithms**:
  - Random Maze: Randomly places walls throughout the grid
  - Randomized Kruskal's Algorithm: Creates more structured, solvable mazes
- **Pathfinding Algorithms**:
  - Breadth-First Search (BFS): Guarantees shortest path, explores uniformly
  - A* Search: Heuristic-based algorithm for efficient pathfinding
- **Visual Animations**: Watch algorithms work step-by-step with color-coded cells
- **Responsive Design**: Adapts to mobile and desktop screens
- **Real-time Controls**: Generate mazes, clear paths, and find routes instantly

## 🎮 How to Use

### Getting Started
1. Open `index.html` in your web browser
2. The grid initializes with a **green start point** (top-left) and **red end point** (bottom-right)

### Creating Obstacles
- **Click and drag** on empty cells to create walls
- **Click on existing walls** to remove them
- Start and end points cannot be converted to walls

### Generating Mazes
1. Select a maze algorithm from the dropdown:
   - **Random Maze**: Quick random wall placement
   - **Randomized Kruskal's**: Creates connected, solvable mazes
2. Click **"Generate Maze"** to watch the algorithm work
3. Use **"Clear Maze"** to remove all walls

### Finding Paths
1. Choose a pathfinding algorithm:
   - **BFS**: Explores all directions equally, finds shortest path
   - **A***: Uses heuristics to find path more efficiently
2. Click **"Find Path"** to visualize the search process
3. **Light blue cells** show explored areas
4. **Yellow cells** highlight the final optimal path
5. Use **"Clear Path"** to reset without affecting walls

## 🎨 Visual Legend

| Color | Meaning |
|-------|---------|
| 🟢 **Green** | Start position |
| 🔴 **Red** | End position |
| 🔵 **Dark Blue** | Wall/Obstacle |
| 🔵 **Light Blue** | Visited/Explored cells |
| 🟡 **Yellow** | Final path |

## 🛠 Technical Details

### Algorithms Implemented

#### Maze Generation
- **Random Maze**: O(n²) complexity, places walls with 30% probability
- **Randomized Kruskal's Algorithm**: 
  - Uses Union-Find data structure for cycle detection
  - Ensures all areas remain connected
  - O(E log V) complexity where E = edges, V = vertices

#### Pathfinding
- **Breadth-First Search (BFS)**:
  - Guarantees shortest path in unweighted graphs
  - Time complexity: O(V + E)
  - Space complexity: O(V)
- **A* Search**:
  - Uses Manhattan distance as heuristic
  - More efficient than BFS for single-target searches
  - Time complexity: O(b^d) where b = branching factor, d = depth

### Data Structures
- **Union-Find**: Efficient set operations for maze generation
- **Min-Heap**: Priority queue implementation for A* algorithm
- **Grid**: 2D array representing the maze state

## 📱 Responsive Design

- **Desktop**: 25×25 grid with full feature set
- **Mobile/Tablet**: 20×20 grid optimized for touch interaction
- **Breakpoint**: 768px width

## 🚀 Quick Start

```bash
# Clone or download the project
git clone <repository-url>

# Navigate to project directory
cd pathfinding-visualizer

# Open in browser
open index.html
# or
python -m http.server 8000  # For local server
```

## 📁 Project Structure

```
pathfinding-visualizer/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Core JavaScript logic
└── README.md           # Project documentation
```

## 🎯 Educational Value

This project demonstrates:
- **Graph Theory**: Pathfinding in 2D grids
- **Algorithm Visualization**: Step-by-step algorithm execution
- **Data Structures**: Practical use of heaps, queues, and union-find
- **UI/UX Design**: Interactive and responsive web interfaces
- **Animation Techniques**: CSS transitions and JavaScript timing

## 🔧 Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support  
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support

## 🎨 Customization

### Modify Grid Size
```javascript
// In script.js, change the grid size
this.gridSize = window.innerWidth <= 768 ? 20 : 25; // Adjust numbers
```

### Adjust Animation Speed
```javascript
// Change sleep duration in milliseconds
await this.sleep(5);  // Faster: lower number, Slower: higher number
```

### Add New Algorithms
1. Add algorithm option to HTML select element
2. Implement algorithm method in PathfindingVisualizer class
3. Add case in generateMaze() or findPath() methods

## 🤝 Contributing

Feel free to contribute by:
- Adding new pathfinding algorithms (Dijkstra, DFS, etc.)
- Implementing additional maze generation techniques
- Improving UI/UX design
- Optimizing performance
- Adding more customization options

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Learn More

- [Pathfinding Algorithms](https://en.wikipedia.org/wiki/Pathfinding)
- [A* Search Algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [Maze Generation Algorithms](https://en.wikipedia.org/wiki/Maze_generation_algorithm)
- [Union-Find Data Structure](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)