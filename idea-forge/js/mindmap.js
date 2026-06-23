/* ==========================================
   IDEAFORGE - INTERACTIVE 2D PHYSICS MINDMAP
   ========================================== */

class MindmapNode {
  constructor(id, text, x, y, isRoot = false, color = '#00f0ff') {
    this.id = id;
    this.text = text;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = isRoot ? 45 : Math.max(28, text.length * 5 + 10);
    this.isRoot = isRoot;
    this.color = color;
    this.mass = isRoot ? 10 : 1;
    this.targetRadius = this.radius;
    this.pulseTime = Math.random() * 100;
  }

  update() {
    // Subtle breathing animation for nodes
    this.pulseTime += 0.05;
    if (this.isRoot) {
      this.radius = this.targetRadius + Math.sin(this.pulseTime) * 3;
    } else {
      this.radius = this.targetRadius + Math.sin(this.pulseTime) * 1;
    }
  }
}

class MindmapConnection {
  constructor(fromNode, toNode) {
    this.from = fromNode;
    this.to = toNode;
    this.strength = 0.06; // Spring strength
    this.length = fromNode.isRoot ? 120 : 90; // Rest length
  }
}

class MindmapGraph {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    this.nodes = [];
    this.connections = [];
    this.particles = [];
    
    // View Transform
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1;
    
    // Interaction State
    this.draggedNode = null;
    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;
    this.hoveredNode = null;
    
    // Physics constants
    this.repulsionStrength = 600;
    this.friction = 0.85;
    this.gravity = 0.02; // Pull towards center
    
    this.animationFrameId = null;
    this.setupListeners();
    this.resizeCanvas();
    
    // Resize handler
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = rect.height || 450;
    
    if (this.nodes.length === 0) {
      this.recenter();
    }
  }

  recenter() {
    this.panX = this.canvas.width / 2;
    this.panY = this.canvas.height / 2;
    this.zoom = 1;
  }

  setupListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.onMouseUp());
    this.canvas.addEventListener('mouseleave', () => this.onMouseUp());
    
    // Wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 1.1;
      const mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - this.canvas.getBoundingClientRect().top;
      
      // Calculate coordinates before zoom
      const graphX = (mouseX - this.panX) / this.zoom;
      const graphY = (mouseY - this.panY) / this.zoom;
      
      if (e.deltaY < 0) {
        this.zoom = Math.min(3, this.zoom * zoomFactor);
      } else {
        this.zoom = Math.max(0.4, this.zoom / zoomFactor);
      }
      
      // Adjust pan to zoom at cursor position
      this.panX = mouseX - graphX * this.zoom;
      this.panY = mouseY - graphY * this.zoom;
    });

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.onMouseDown({
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => {}
        });
      }
    });
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        this.onMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
          preventDefault: () => {}
        });
      }
    });
    this.canvas.addEventListener('touchend', () => this.onMouseUp());
  }

  // Screen to Graph coordinates converter
  screenToGraph(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return {
      x: (x - this.panX) / this.zoom,
      y: (y - this.panY) / this.zoom
    };
  }

  onMouseDown(e) {
    const pos = this.screenToGraph(e.clientX, e.clientY);
    
    // Check if clicked a node
    let clickedNode = null;
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      const dist = Math.hypot(node.x - pos.x, node.y - pos.y);
      if (dist < node.radius) {
        clickedNode = node;
        break;
      }
    }

    if (clickedNode) {
      this.draggedNode = clickedNode;
      if (window.SFX) window.SFX.playClick();
    } else {
      this.isPanning = true;
      this.startX = e.clientX - this.panX;
      this.startY = e.clientY - this.panY;
    }
  }

  onMouseMove(e) {
    const pos = this.screenToGraph(e.clientX, e.clientY);
    
    if (this.draggedNode) {
      this.draggedNode.x = pos.x;
      this.draggedNode.y = pos.y;
      this.draggedNode.vx = 0;
      this.draggedNode.vy = 0;
    } else if (this.isPanning) {
      this.panX = e.clientX - this.startX;
      this.panY = e.clientY - this.startY;
    } else {
      // Hover detection
      let currentHover = null;
      for (let i = this.nodes.length - 1; i >= 0; i--) {
        const node = this.nodes[i];
        const dist = Math.hypot(node.x - pos.x, node.y - pos.y);
        if (dist < node.radius) {
          currentHover = node;
          break;
        }
      }
      
      if (currentHover !== this.hoveredNode) {
        this.hoveredNode = currentHover;
        this.canvas.style.cursor = this.hoveredNode ? 'grab' : 'default';
      }
    }
  }

  onMouseUp() {
    this.draggedNode = null;
    this.isPanning = false;
  }

  clear() {
    this.nodes = [];
    this.connections = [];
    this.particles = [];
    this.recenter();
  }

  setRoot(keyword, color = '#ff007f') {
    this.clear();
    const root = new MindmapNode('root', keyword.toUpperCase(), 0, 0, true, color);
    this.nodes.push(root);
  }

  addNode(text, parentId = 'root', color = '#00f0ff') {
    // Generate unique ID
    const id = 'node_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    // Find parent node
    const parent = this.nodes.find(n => n.id === parentId) || this.nodes[0];
    
    // Position near parent with a slight offset
    const angle = Math.random() * Math.PI * 2;
    const distance = 80;
    const startX = parent.x + Math.cos(angle) * distance;
    const startY = parent.y + Math.sin(angle) * distance;
    
    const newNode = new MindmapNode(id, text, startX, startY, false, color);
    this.nodes.push(newNode);
    
    // Add connection
    const conn = new MindmapConnection(parent, newNode);
    this.connections.push(conn);

    // Spawn sparks
    this.spawnSparks(parent.x, parent.y, newNode.x, newNode.y, color);
    
    return newNode;
  }

  spawnSparks(x1, y1, x2, y2, color) {
    const numSparks = 12;
    for (let i = 0; i < numSparks; i++) {
      const t = Math.random();
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      
      this.particles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: Math.random() * 2 + 1,
        color: color,
        alpha: 1,
        life: 0.02 + Math.random() * 0.03 // Decay rate
      });
    }
  }

  updatePhysics() {
    // 1. Repulsion between all nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const nodeA = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeB = this.nodes[j];
        
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.hypot(dx, dy) || 1;
        
        // Repulsion radius threshold
        const minDistance = nodeA.radius + nodeB.radius + 50;
        if (dist < minDistance) {
          const force = (minDistance - dist) * 0.02 * this.repulsionStrength / (dist * 0.1 + 1);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          if (nodeB !== this.draggedNode) {
            nodeB.vx += fx / nodeB.mass;
            nodeB.vy += fy / nodeB.mass;
          }
          if (nodeA !== this.draggedNode) {
            nodeA.vx -= fx / nodeA.mass;
            nodeA.vy -= fy / nodeA.mass;
          }
        }
      }
    }

    // 2. Attraction along connections (springs)
    this.connections.forEach(conn => {
      const dx = conn.to.x - conn.from.x;
      const dy = conn.to.y - conn.from.y;
      const dist = Math.hypot(dx, dy) || 1;
      
      const stretch = dist - conn.length;
      const force = stretch * conn.strength;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      
      if (conn.to !== this.draggedNode) {
        conn.to.vx -= fx / conn.to.mass;
        conn.to.vy -= fy / conn.to.mass;
      }
      if (conn.from !== this.draggedNode) {
        conn.from.vx += fx / conn.from.mass;
        conn.from.vy += fy / conn.from.mass;
      }
    });

    // 3. Global gravity (recenter force) & update positions
    this.nodes.forEach(node => {
      if (node === this.draggedNode) return;
      
      // Pull slightly to center (0,0)
      node.vx -= node.x * this.gravity;
      node.vy -= node.y * this.gravity;
      
      // Update nodes
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      node.update();
    });

    // 4. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.life;
      
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Save context for transform
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.zoom, this.zoom);

    // Grid lines in the background
    this.drawBackgroundGrid();

    // 1. Draw connections
    this.ctx.lineWidth = 2;
    this.connections.forEach(conn => {
      const grad = this.ctx.createLinearGradient(conn.from.x, conn.from.y, conn.to.x, conn.to.y);
      grad.addColorStop(0, conn.from.color);
      grad.addColorStop(1, conn.to.color);
      
      this.ctx.strokeStyle = grad;
      this.ctx.globalAlpha = 0.4;
      this.ctx.beginPath();
      this.ctx.moveTo(conn.from.x, conn.from.y);
      this.ctx.lineTo(conn.to.x, conn.to.y);
      this.ctx.stroke();
    });
    this.ctx.globalAlpha = 1.0;

    // 2. Draw nodes
    this.nodes.forEach(node => {
      const isHovered = (this.hoveredNode === node);
      
      // Outer neon glow
      this.ctx.shadowBlur = isHovered ? 25 : 12;
      this.ctx.shadowColor = node.color;
      
      // Node fill (Glassmorphism look)
      this.ctx.fillStyle = isHovered ? 'rgba(25, 25, 55, 0.9)' : 'rgba(10, 10, 30, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Border
      this.ctx.shadowBlur = 0; // Turn off shadow blur for border
      this.ctx.lineWidth = isHovered ? 3 : 1.5;
      this.ctx.strokeStyle = node.color;
      this.ctx.stroke();
      
      // Node Text
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = node.isRoot 
        ? 'bold 13px "Orbitron", sans-serif' 
        : '500 11px "Inter", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      // Multi-line wrap or truncate text if it is too long
      let text = node.text;
      if (text.length > 18) {
        text = text.substring(0, 16) + '...';
      }
      this.ctx.fillText(text, node.x, node.y);
    });

    // 3. Draw particles
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;

    // Restore context
    this.ctx.restore();
  }

  drawBackgroundGrid() {
    const size = 50;
    const w = this.canvas.width / this.zoom + 200;
    const h = this.canvas.height / this.zoom + 200;
    
    // Grid bounds based on zoom/pan
    const startX = Math.floor((-this.panX / this.zoom) / size) * size - size;
    const startY = Math.floor((-this.panY / this.zoom) / size) * size - size;
    const endX = startX + w;
    const endY = startY + h;
    
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    this.ctx.lineWidth = 1;
    
    this.ctx.beginPath();
    for (let x = startX; x <= endX; x += size) {
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += size) {
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
    }
    this.ctx.stroke();
  }

  startLoop() {
    if (this.animationFrameId) return;
    
    const loop = () => {
      this.updatePhysics();
      this.draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stopLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

window.MindmapGraph = MindmapGraph;
