(() => {
  // 0 empty, 1 wall, 2 exit
  const MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const FOV = Math.PI / 3;
  const MOVE_SPEED = 2.6;
  const TURN_SPEED = 2.4;
  const RADIUS = 0.18;
  const DECOR_KINDS = ["plant", "flower", "mushroom", "rock", "bush"];
  const ANIMAL_CHARS = [
    {
      id: "fox",
      name: "Fox",
      src: "../../assets/animals/fox.png",
      x: 3.5,
      y: 3.5,
      scale: 0.575,
    },
    {
      id: "frog",
      name: "Frog",
      src: "../../assets/animals/frog.png",
      x: 7.5,
      y: 5.5,
      scale: 0.5,
    },
    {
      id: "penguin",
      name: "Penguin",
      src: "../../assets/animals/penguin.png",
      x: 1.5,
      y: 7.5,
      scale: 0.55,
    },
  ];

  const startScreen = document.getElementById("startScreen");
  const playScreen = document.getElementById("playScreen");
  const resultsScreen = document.getElementById("resultsScreen");
  const startBtn = document.getElementById("startBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const canvas = document.getElementById("view");
  const ctx = canvas.getContext("2d");

  const keys = {
    forward: false,
    back: false,
    left: false,
    right: false,
  };

  let player = { x: 1.5, y: 1.5, angle: 0 };
  let playing = false;
  let won = false;
  let lastTime = 0;
  let rafId = null;
  let decorations = [];
  let characters = [];
  let nearestFriend = null;
  const animalImages = {};

  function loadAnimalImages() {
    return Promise.all(
      ANIMAL_CHARS.map(
        (animal) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              animalImages[animal.id] = img;
              resolve();
            };
            img.onerror = () => resolve();
            img.src = animal.src;
          })
      )
    );
  }

  function showScreen(screen) {
    startScreen.hidden = screen !== startScreen;
    playScreen.hidden = screen !== playScreen;
    resultsScreen.hidden = screen !== resultsScreen;
  }

  function tileAt(x, y) {
    const mapX = Math.floor(x);
    const mapY = Math.floor(y);
    if (mapY < 0 || mapY >= MAP.length || mapX < 0 || mapX >= MAP[0].length) {
      return 1;
    }
    return MAP[mapY][mapX];
  }

  function isBlocked(x, y) {
    return tileAt(x, y) === 1;
  }

  function mulberry32(seed) {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildDecorations() {
    const rand = mulberry32(42);
    const items = [];

    function pushTowardWall(x, y, cellX, cellY) {
      // Nudge props to the nearest wall so they sit at the edges, not mid-path.
      const neighbors = [
        [cellX, cellY - 1, 0, -1],
        [cellX, cellY + 1, 0, 1],
        [cellX - 1, cellY, -1, 0],
        [cellX + 1, cellY, 1, 0],
      ];
      let best = null;
      for (const [nx, ny, dx, dy] of neighbors) {
        if (ny < 0 || ny >= MAP.length || nx < 0 || nx >= MAP[0].length) {
          continue;
        }
        if (MAP[ny][nx] === 1) {
          best = [dx, dy];
          break;
        }
      }
      if (!best) {
        return { x, y };
      }
      return {
        x: x + best[0] * 0.32,
        y: y + best[1] * 0.32,
      };
    }

    for (let y = 0; y < MAP.length; y += 1) {
      for (let x = 0; x < MAP[0].length; x += 1) {
        if (MAP[y][x] !== 0) {
          continue;
        }
        if (x === 1 && y === 1) {
          continue;
        }
        if (rand() > 0.5) {
          continue;
        }

        const kind = DECOR_KINDS[Math.floor(rand() * DECOR_KINDS.length)];
        const baseX = x + 0.5 + (rand() - 0.5) * 0.12;
        const baseY = y + 0.5 + (rand() - 0.5) * 0.12;
        const pos = pushTowardWall(baseX, baseY, x, y);
        items.push({
          x: pos.x,
          y: pos.y,
          kind,
          scale: 0.55 + rand() * 0.4,
        });
      }
    }

    items.push(
      { x: 2.2, y: 1.22, kind: "plant", scale: 0.85 },
      { x: 3.78, y: 3.22, kind: "flower", scale: 0.7 },
      { x: 5.22, y: 5.78, kind: "mushroom", scale: 0.75 },
      { x: 7.22, y: 7.25, kind: "bush", scale: 0.95 },
      { x: 4.22, y: 7.78, kind: "rock", scale: 0.65 }
    );

    return items;
  }

  function tryMove(dx, dy) {
    const nextX = player.x + dx;
    const nextY = player.y + dy;

    if (
      !isBlocked(nextX - RADIUS, player.y) &&
      !isBlocked(nextX + RADIUS, player.y) &&
      !isBlocked(nextX, player.y - RADIUS) &&
      !isBlocked(nextX, player.y + RADIUS)
    ) {
      player.x = nextX;
    }

    if (
      !isBlocked(player.x - RADIUS, nextY) &&
      !isBlocked(player.x + RADIUS, nextY) &&
      !isBlocked(player.x, nextY - RADIUS) &&
      !isBlocked(player.x, nextY + RADIUS)
    ) {
      player.y = nextY;
    }

    if (tileAt(player.x, player.y) === 2) {
      finish();
    }
  }

  function castRay(rayAngle) {
    const sin = Math.sin(rayAngle);
    const cos = Math.cos(rayAngle);

    let dist = 0;
    const step = 0.02;
    let hit = 0;
    let side = 0;
    let mapX = 0;
    let mapY = 0;
    let hitX = 0;
    let hitY = 0;
    let prevX = player.x;
    let prevY = player.y;

    while (dist < 14) {
      dist += step;
      const x = player.x + cos * dist;
      const y = player.y + sin * dist;
      const tile = tileAt(x, y);
      if (tile === 1 || tile === 2) {
        hit = tile;
        side = Math.floor(x) !== Math.floor(prevX) ? 0 : 1;
        mapX = Math.floor(x);
        mapY = Math.floor(y);
        hitX = x;
        hitY = y;
        break;
      }
      prevX = x;
      prevY = y;
    }

    const corrected = dist * Math.cos(rayAngle - player.angle);
    return { dist: corrected, hit, side, mapX, mapY, hitX, hitY };
  }

  function drawSkyAndFloor(width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height / 2);
    sky.addColorStop(0, "#6bb8de");
    sky.addColorStop(0.55, "#a9daf0");
    sky.addColorStop(1, "#d7eef8");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height / 2);

    // Soft clouds that drift with view angle.
    const drift = ((player.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const cloudShift = (drift / (Math.PI * 2)) * width * 1.5;
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    for (let i = 0; i < 5; i += 1) {
      const cx = ((i * 180 - cloudShift) % (width + 160)) - 80;
      const cy = 28 + (i % 3) * 18;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 48, 18, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 28, cy + 4, 36, 14, 0, 0, Math.PI * 2);
      ctx.ellipse(cx - 24, cy + 6, 30, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sun
    ctx.fillStyle = "rgba(255, 214, 102, 0.9)";
    ctx.beginPath();
    ctx.arc(width * 0.82, height * 0.12, 22, 0, Math.PI * 2);
    ctx.fill();

    const floor = ctx.createLinearGradient(0, height / 2, 0, height);
    floor.addColorStop(0, "#cbb57a");
    floor.addColorStop(1, "#8f7948");
    ctx.fillStyle = floor;
    ctx.fillRect(0, height / 2, width, height / 2);

    // Perspective floor stripes for a bit of depth.
    ctx.strokeStyle = "rgba(70, 55, 30, 0.12)";
    ctx.lineWidth = 2;
    for (let i = 1; i <= 8; i += 1) {
      const y = height / 2 + (i * i * 4.5);
      if (y >= height) {
        break;
      }
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function drawDecorSprite(kind, x, y, w, h) {
    // (x, y) is the sprite's feet on the ground. Draw upward with negative Y.
    ctx.save();
    ctx.translate(x, y);

    if (kind === "plant" || kind === "bush") {
      const leaf = kind === "bush" ? "#3d8f4a" : "#4caf50";
      ctx.fillStyle = "#6d4c2f";
      ctx.fillRect(-w * 0.06, -h * 0.55, w * 0.12, h * 0.55);
      ctx.fillStyle = leaf;
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.62, w * 0.34, h * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-w * 0.22, -h * 0.48, w * 0.22, h * 0.17, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.22, -h * 0.48, w * 0.22, h * 0.17, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === "flower") {
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(-w * 0.05, -h * 0.55, w * 0.1, h * 0.55);
      ctx.fillStyle = "#66bb6a";
      ctx.fillRect(-w * 0.18, -h * 0.2, w * 0.12, h * 0.08);
      const petals = ["#ff8a80", "#ffd54f", "#ce93d8", "#81d4fa"];
      for (let i = 0; i < 4; i += 1) {
        const a = (i / 4) * Math.PI * 2;
        ctx.fillStyle = petals[i];
        ctx.beginPath();
        ctx.ellipse(
          Math.cos(a) * w * 0.16,
          -h * 0.62 + Math.sin(a) * h * 0.12,
          w * 0.12,
          h * 0.1,
          a,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.fillStyle = "#fff59d";
      ctx.beginPath();
      ctx.arc(0, -h * 0.62, w * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === "mushroom") {
      // Stem from ground up into the cap
      ctx.fillStyle = "#f5f0e6";
      ctx.beginPath();
      ctx.roundRect(-w * 0.1, -h * 0.42, w * 0.2, h * 0.42, w * 0.06);
      ctx.fill();

      // Cap dome sitting on the stem
      const capY = -h * 0.42;
      ctx.fillStyle = "#e53935";
      ctx.beginPath();
      ctx.ellipse(0, capY, w * 0.32, h * 0.22, 0, Math.PI, 0);
      ctx.fill();

      // Cap underside / rim
      ctx.fillStyle = "#c62828";
      ctx.beginPath();
      ctx.ellipse(0, capY, w * 0.32, h * 0.07, 0, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = "#ffe0b2";
      ctx.beginPath();
      ctx.ellipse(0, capY, w * 0.18, h * 0.045, 0, 0, Math.PI);
      ctx.fill();

      // Spots clipped to the red dome (separate paths so they stay circles)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, capY, w * 0.32, h * 0.22, 0, Math.PI, 0);
      ctx.clip();
      ctx.fillStyle = "#ffe082";
      const spots = [
        [-w * 0.12, capY - h * 0.1, w * 0.055],
        [w * 0.1, capY - h * 0.06, w * 0.045],
        [w * 0.02, capY - h * 0.14, w * 0.035],
      ];
      for (const [sx, sy, sr] of spots) {
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (kind === "rock") {
      ctx.fillStyle = "#8d8d8d";
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.12, w * 0.28, h * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#bdbdbd";
      ctx.beginPath();
      ctx.ellipse(-w * 0.08, -h * 0.16, w * 0.12, h * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawDecorations(width, height, zBuffer, timeSec) {
    const dirX = Math.cos(player.angle);
    const dirY = Math.sin(player.angle);
    const planeX = -dirY * Math.tan(FOV / 2);
    const planeY = dirX * Math.tan(FOV / 2);

    const sprites = [
      ...decorations.map((decor) => ({ ...decor, spriteType: "decor" })),
      ...characters.map((character) => ({ ...character, spriteType: "animal" })),
    ];

    const visible = sprites
      .map((sprite) => {
        const relX = sprite.x - player.x;
        const relY = sprite.y - player.y;
        const invDet = 1 / (planeX * dirY - dirX * planeY);
        const transformX = invDet * (dirY * relX - dirX * relY);
        const transformY = invDet * (-planeY * relX + planeX * relY);
        return { sprite, transformX, transformY };
      })
      .filter((item) => item.transformY > 0.2)
      .sort((a, b) => b.transformY - a.transformY);

    for (const item of visible) {
      const { sprite, transformX, transformY } = item;
      const screenX = Math.floor((width / 2) * (1 + transformX / transformY));
      const bob =
        sprite.spriteType === "animal"
          ? Math.sin(timeSec * 3 + (sprite.bob || 0)) * 4
          : 0;
      const spriteH = Math.abs(
        Math.floor((height / transformY) * sprite.scale)
      );
      const spriteW = spriteH;
      const feetY = Math.floor(height / 2 + height / (2 * transformY) + bob);
      const drawStartX = Math.floor(screenX - spriteW / 2);
      const drawEndX = drawStartX + spriteW;

      let visibleCols = 0;
      for (let stripe = drawStartX; stripe < drawEndX; stripe += 4) {
        if (stripe >= 0 && stripe < width && transformY < zBuffer[stripe]) {
          visibleCols += 1;
        }
      }
      if (visibleCols < 2) {
        continue;
      }

      const fog = Math.min(0.55, transformY / 11);
      ctx.globalAlpha = 1 - fog * 0.85;

      if (sprite.spriteType === "animal") {
        const img = animalImages[sprite.id];
        if (img) {
          ctx.drawImage(
            img,
            screenX - spriteW / 2,
            feetY - spriteH,
            spriteW,
            spriteH
          );
        }
      } else {
        drawDecorSprite(sprite.kind, screenX, feetY, spriteW, spriteH);
      }
      ctx.globalAlpha = 1;
    }
  }

  function refreshNearestFriend() {
    nearestFriend = null;
    let best = 1.4;
    for (const character of characters) {
      const dist = Math.hypot(character.x - player.x, character.y - player.y);
      if (dist < best) {
        best = dist;
        nearestFriend = character;
      }
    }
    const hint = document.getElementById("hint");
    if (!hint) {
      return;
    }
    hint.textContent = nearestFriend
      ? `Hello, ${nearestFriend.name}! Keep going to the green exit.`
      : "Find the green exit — say hi to animals on the way!";
  }

  function drawFrame() {
    const width = canvas.width;
    const height = canvas.height;
    const zBuffer = new Array(width);

    drawSkyAndFloor(width, height);

    for (let col = 0; col < width; col += 1) {
      const cameraX = (2 * col) / width - 1;
      const rayAngle = player.angle + Math.atan(cameraX * Math.tan(FOV / 2));
      const { dist, hit, side, mapX, mapY, hitX, hitY } = castRay(rayAngle);
      zBuffer[col] = hit ? dist : 100;

      if (!hit) {
        continue;
      }

      const wallHeight = Math.min(height, height / Math.max(dist, 0.0001));
      const top = (height - wallHeight) / 2;

      let shade;
      if (hit === 2) {
        shade = side ? "#3cbc7f" : "#5fd897";
      } else {
        const band = Math.floor((col + top) / 18) % 2 === 0;
        if (side) {
          shade = band ? "#64533c" : "#6f5a42";
        } else {
          shade = band ? "#8a7354" : "#9a8160";
        }
      }

      const fog = Math.min(0.65, dist / 10);
      ctx.fillStyle = shade;
      ctx.fillRect(col, top, 1, wallHeight);

      // Windows drawn on the wall surface (not as floor props).
      if (hit === 1) {
        const wallU = side === 0 ? hitY - Math.floor(hitY) : hitX - Math.floor(hitX);
        const windowCell = (mapX * 3 + mapY * 5) % 4 !== 0;
        const inWindowX = wallU > 0.28 && wallU < 0.72;
        if (windowCell && inWindowX) {
          const winTop = top + wallHeight * 0.22;
          const winBottom = top + wallHeight * 0.58;
          const frame = Math.max(1, wallHeight * 0.03);
          ctx.fillStyle = side ? "#4a3728" : "#5a4533";
          ctx.fillRect(col, winTop, 1, winBottom - winTop);
          ctx.fillStyle = side ? "#7ec8e3" : "#9fd6ec";
          ctx.fillRect(col, winTop + frame, 1, winBottom - winTop - frame * 2);
          // Cross pane
          const midY = (winTop + winBottom) / 2;
          ctx.fillStyle = side ? "#4a3728" : "#5a4533";
          ctx.fillRect(col, midY - frame * 0.5, 1, frame);
          if (wallU > 0.48 && wallU < 0.52) {
            ctx.fillRect(col, winTop, 1, winBottom - winTop);
          }
        }
      }

      if (fog > 0) {
        ctx.fillStyle = `rgba(40, 50, 45, ${fog})`;
        ctx.fillRect(col, top, 1, wallHeight);
      }
    }

    drawDecorations(width, height, zBuffer, lastTime / 1000);
  }

  function update(dt) {
    if (!playing || won) {
      return;
    }

    if (keys.left) {
      player.angle -= TURN_SPEED * dt;
    }
    if (keys.right) {
      player.angle += TURN_SPEED * dt;
    }

    let move = 0;
    if (keys.forward) {
      move += 1;
    }
    if (keys.back) {
      move -= 1;
    }
    if (move !== 0) {
      tryMove(
        Math.cos(player.angle) * MOVE_SPEED * dt * move,
        Math.sin(player.angle) * MOVE_SPEED * dt * move
      );
    }
    refreshNearestFriend();
  }

  function loop(timestamp) {
    if (!playing) {
      return;
    }
    const dt = Math.min(0.033, (timestamp - lastTime) / 1000 || 0.016);
    lastTime = timestamp;
    update(dt);
    drawFrame();
    rafId = window.requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function resetPlayer() {
    player = { x: 1.5, y: 1.5, angle: 0 };
    won = false;
    decorations = buildDecorations();
    characters = ANIMAL_CHARS.map((animal) => ({
      ...animal,
      bob: Math.random() * Math.PI * 2,
    }));
    nearestFriend = null;
    refreshNearestFriend();
  }

  function startGame() {
    stopLoop();
    resetPlayer();
    playing = true;
    showScreen(playScreen);
    lastTime = performance.now();
    drawFrame();
    rafId = window.requestAnimationFrame(loop);
  }

  function finish() {
    if (won) {
      return;
    }
    won = true;
    playing = false;
    stopLoop();
    showScreen(resultsScreen);
  }

  function bindHold(button, key) {
    const down = (event) => {
      event.preventDefault();
      keys[key] = true;
    };
    const up = (event) => {
      event.preventDefault();
      keys[key] = false;
    };
    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointerleave", up);
    button.addEventListener("pointercancel", up);
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  bindHold(document.getElementById("moveForward"), "forward");
  bindHold(document.getElementById("moveBack"), "back");
  bindHold(document.getElementById("turnLeft"), "left");
  bindHold(document.getElementById("turnRight"), "right");

  window.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp" || event.code === "KeyW") {
      keys.forward = true;
    }
    if (event.code === "ArrowDown" || event.code === "KeyS") {
      keys.back = true;
    }
    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      keys.left = true;
    }
    if (event.code === "ArrowRight" || event.code === "KeyD") {
      keys.right = true;
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowUp" || event.code === "KeyW") {
      keys.forward = false;
    }
    if (event.code === "ArrowDown" || event.code === "KeyS") {
      keys.back = false;
    }
    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      keys.left = false;
    }
    if (event.code === "ArrowRight" || event.code === "KeyD") {
      keys.right = false;
    }
  });

  decorations = buildDecorations();
  startBtn.disabled = true;
  startBtn.textContent = "Loading…";
  loadAnimalImages().then(() => {
    startBtn.disabled = false;
    startBtn.textContent = "Start";
  });
  startBtn.addEventListener("click", startGame);
  playAgainBtn.addEventListener("click", startGame);
})();
