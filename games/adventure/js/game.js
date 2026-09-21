(() => {
  const START_STRENGTH = 2;
  const CASTLE_NEED = 5;
  const MAX_PLAYERS = 3;
  const MAX_SKILLS = 3;
  const MAX_STAR_SLOTS = 7;
  const MAX_PET_SLOTS = 2;
  const PLAYER_COLORS = ["#e8a317", "#2f9e6b", "#4f7cac", "#d45b4a"];
  const HERO_IDS = [
    "lion",
    "fox",
    "frog",
    "penguin",
    "rabbit",
    "tiger",
    "owl",
    "dinosaur",
  ];

  const SKILLS = {
    smash: {
      id: "smash",
      name: "Smash",
      icon: "💥",
      desc: "Hit hard (+2)",
    },
    heal: {
      id: "heal",
      name: "Heal",
      icon: "💚",
      desc: "Restore 2 HP",
    },
    shield: {
      id: "shield",
      name: "Shield",
      icon: "🛡️",
      desc: "Block next hit",
    },
    frenzy: {
      id: "frenzy",
      name: "Frenzy",
      icon: "⚡",
      desc: "Attack twice",
    },
    stun: {
      id: "stun",
      name: "Stun",
      icon: "💫",
      desc: "Boss skips a turn",
    },
  };
  const SKILL_IDS = Object.keys(SKILLS);

  const CHANCE_CARDS = [
    {
      id: "monkey-noise",
      title: "Monkey Mayhem!",
      text: "Make a noise like a monkey! The others score you out of 5. Get that many stars!",
      kind: "score",
    },
    {
      id: "lion-roar",
      title: "Mighty Roar!",
      text: "Roar like a lion! The others score you out of 5. Get that many stars!",
      kind: "score",
    },
    {
      id: "robot-dance",
      title: "Robot Dance!",
      text: "Do your best robot dance! The others score you out of 5. Get that many stars!",
      kind: "score",
    },
    {
      id: "silly-face",
      title: "Silly Face!",
      text: "Make the silliest face you can! The others score you out of 5. Get that many stars!",
      kind: "score",
    },
    {
      id: "frog-hop",
      title: "Frog Hop!",
      text: "Hop like a frog three times! The others score you out of 5. Get that many stars!",
      kind: "score",
    },
    {
      id: "opera-note",
      title: "Opera Star!",
      text: "Sing a long silly note! The others score you out of 5. Get that many stars!",
      kind: "score",
    },
    {
      id: "lucky-stars",
      title: "Lucky Stars",
      text: "You find shiny stars on the path. Gain 2 stars!",
      kind: "gain",
      amount: 2,
    },
    {
      id: "snack-boost",
      title: "Snack Time",
      text: "A tasty snack gives you energy. Gain 1 star!",
      kind: "gain",
      amount: 1,
    },
    {
      id: "mud-splash",
      title: "Mud Splash",
      text: "Splash! You slip in the mud. Lose 1 star.",
      kind: "lose",
      amount: 1,
    },
    {
      id: "wind-whoosh",
      title: "Big Whoosh",
      text: "A gust of wind spins you around. Lose 1 star.",
      kind: "lose",
      amount: 1,
    },
    {
      id: "secret-scroll",
      title: "Secret Scroll",
      text: "A magic scroll floats over. Gain a random skill if any are left!",
      kind: "skill",
    },
    {
      id: "double-cheer",
      title: "Team Cheer",
      text: "Everyone cheers for you! Gain 3 stars!",
      kind: "gain",
      amount: 3,
    },
    {
      id: "castle-pass",
      title: "Castle Pass",
      text: "Spend 2 stars to zoom straight to the castle!",
      kind: "castle",
      amount: 2,
    },
    {
      id: "castle-express",
      title: "Castle Express",
      text: "Spend 2 stars to race straight to the castle gate!",
      kind: "castle",
      amount: 2,
    },
  ];

  // Corner friends (except Start) grant a pet with a built-in battle skill.
  const PET_DEFS = [
    { animalId: "duck", skillId: "heal" },
    { animalId: "cat", skillId: "smash" },
    { animalId: "dog", skillId: "shield" },
    { animalId: "turtle", skillId: "stun" },
    { animalId: "bird", skillId: "frenzy" },
    { animalId: "monkey", skillId: "heal" },
    { animalId: "sheep", skillId: "shield" },
    { animalId: "deer", skillId: "smash" },
  ];

  const SYM = (name) => `../../assets/symbols/${name}.png`;

  const SPACES = [
    { id: "start", label: "Start", type: "start", icon: "🏁", symbol: SYM("flag") },
    { id: "boost1", label: "Power Up", type: "boost", icon: "⭐", symbol: SYM("star") },
    { id: "skill1", label: "Skill", type: "skill", icon: "📜", symbol: SYM("potion") },
    { id: "rest1", label: "Rest", type: "rest", icon: "💤", symbol: SYM("moon") },
    { id: "chance1", label: "Chance", type: "chance", icon: "?" },
    { id: "boost2", label: "Power Up", type: "boost", icon: "⭐", symbol: SYM("star") },
    { id: "friendBR", label: "Friend", type: "friend", icon: "💛", symbol: SYM("paw") },
    { id: "oops1", label: "Oops", type: "oops", icon: "💨", symbol: SYM("lightning") },
    { id: "skill2", label: "Skill", type: "skill", icon: "✨", symbol: SYM("key") },
    { id: "rest2", label: "Rest", type: "rest", icon: "💤", symbol: SYM("cloud") },
    { id: "chance2", label: "Chance", type: "chance", icon: "?" },
    { id: "boost3", label: "Power Up", type: "boost", icon: "⭐", symbol: SYM("coin") },
    { id: "friendTR", label: "Friend", type: "friend", icon: "🧡", symbol: SYM("paw") },
    { id: "skill3", label: "Skill", type: "skill", icon: "📜", symbol: SYM("potion") },
    { id: "oops2", label: "Oops", type: "oops", icon: "🌪️", symbol: SYM("claw") },
    { id: "rest3", label: "Rest", type: "rest", icon: "🌙", symbol: SYM("moon") },
    { id: "chance3", label: "Chance", type: "chance", icon: "?" },
    { id: "boost4", label: "Power Up", type: "boost", icon: "⭐", symbol: SYM("star") },
    { id: "friendTL", label: "Friend", type: "friend", icon: "💛", symbol: SYM("heart") },
    { id: "skill4", label: "Skill", type: "skill", icon: "✨", symbol: SYM("map") },
    { id: "oops3", label: "Oops", type: "oops", icon: "💨", symbol: SYM("skull") },
    { id: "chance4", label: "Chance", type: "chance", icon: "?" },
    { id: "skill5", label: "Skill", type: "skill", icon: "📜", symbol: SYM("shield") },
    {
      id: "finish",
      label: "Castle",
      type: "finish",
      need: CASTLE_NEED,
      icon: "🏰",
      symbol: SYM("castle"),
    },
  ];

  const countScreen = document.getElementById("countScreen");
  const pickScreen = document.getElementById("pickScreen");
  const playScreen = document.getElementById("playScreen");
  const battleScreen = document.getElementById("battleScreen");
  const resultsScreen = document.getElementById("resultsScreen");
  const countRow = document.getElementById("countRow");
  const pickTitle = document.getElementById("pickTitle");
  const heroGrid = document.getElementById("heroGrid");
  const pickedRow = document.getElementById("pickedRow");
  const rosterRow = document.getElementById("rosterRow");
  const boardWrap = document.getElementById("boardWrap");
  const board = document.getElementById("board");
  const eventText = document.getElementById("eventText");
  const diceCube = document.getElementById("diceCube");
  const rollBtn = document.getElementById("rollBtn");
  const statsBar = document.getElementById("statsBar");
  const turnLabel = document.getElementById("turnLabel");
  const strengthValue = document.getElementById("strengthValue");
  const monsterImage = document.getElementById("monsterImage");
  const monsterName = document.getElementById("monsterName");
  const monsterHpFill = document.getElementById("monsterHpFill");
  const monsterHpText = document.getElementById("monsterHpText");
  const battleParty = document.getElementById("battleParty");
  const battleEvent = document.getElementById("battleEvent");
  const battleActions = document.getElementById("battleActions");
  const skillPicker = document.getElementById("skillPicker");
  const skillPickerTitle = document.getElementById("skillPickerTitle");
  const skillPickerGrid = document.getElementById("skillPickerGrid");
  const petPicker = document.getElementById("petPicker");
  const petPickerTitle = document.getElementById("petPickerTitle");
  const petPickerGrid = document.getElementById("petPickerGrid");
  const tileCard = document.getElementById("tileCard");
  const tileCardIcon = document.getElementById("tileCardIcon");
  const tileCardTitle = document.getElementById("tileCardTitle");
  const tileCardBlurb = document.getElementById("tileCardBlurb");
  const tileCardOutcome = document.getElementById("tileCardOutcome");
  const tileCardOk = document.getElementById("tileCardOk");
  const chanceOverlay = document.getElementById("chanceOverlay");
  const chanceCardInner = document.getElementById("chanceCardInner");
  const chanceTitle = document.getElementById("chanceTitle");
  const chanceText = document.getElementById("chanceText");
  const chanceResult = document.getElementById("chanceResult");
  const chanceScoreRow = document.getElementById("chanceScoreRow");
  const chanceScores = document.getElementById("chanceScores");
  const chanceChoiceRow = document.getElementById("chanceChoiceRow");
  const chanceYesBtn = document.getElementById("chanceYesBtn");
  const chanceNoBtn = document.getElementById("chanceNoBtn");
  const chanceOk = document.getElementById("chanceOk");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const changeHeroBtn = document.getElementById("changeHeroBtn");
  const resultsTitle = document.getElementById("resultsTitle");
  const resultHero = document.getElementById("resultHero");
  const resultHeroes = document.getElementById("resultHeroes");
  const finalScore = document.getElementById("finalScore");
  const finalMessage = document.getElementById("finalMessage");

  const DICE_FACE_TRANSFORMS = {
    1: "rotateX(-20deg) rotateY(20deg)",
    2: "rotateX(-20deg) rotateY(-70deg)",
    3: "rotateX(-20deg) rotateY(-160deg)",
    4: "rotateX(-20deg) rotateY(110deg)",
    5: "rotateX(-110deg) rotateY(20deg)",
    6: "rotateX(70deg) rotateY(20deg)",
  };

  const animals = CATEGORIES.animals.items;
  const heroes = HERO_IDS.map((id) => animals.find((item) => item.id === id)).filter(
    Boolean
  );
  const MONSTERS = [
    {
      id: "dragon",
      name: "Dragon",
      image: "../../assets/monsters/dragon.png",
    },
    {
      id: "yeti",
      name: "Yeti",
      image: "../../assets/monsters/yeti.png",
    },
    {
      id: "kraken",
      name: "Kraken",
      image: "../../assets/monsters/kraken.png",
    },
    {
      id: "golem",
      name: "Golem",
      image: "../../assets/monsters/golem.png",
    },
    {
      id: "slime",
      name: "Slime",
      image: "../../assets/monsters/slime.png",
    },
    {
      id: "lich",
      name: "Lich",
      image: "../../assets/monsters/lich.png",
    },
  ];

  function randomMonster() {
    return MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
  }
  const PETS = PET_DEFS.map((def) => {
    const animal = animals.find((item) => item.id === def.animalId);
    if (!animal) {
      return null;
    }
    return {
      id: animal.id,
      name: animal.name,
      image: animal.image,
      skillId: def.skillId,
    };
  }).filter(Boolean);

  function remainingPets() {
    return PETS.filter((pet) => !claimedPets.has(pet.id));
  }

  function claimPet(player, petId) {
    const pet = PETS.find((entry) => entry.id === petId);
    if (!pet || claimedPets.has(pet.id)) {
      return null;
    }
    if (player.pet) {
      claimedPets.delete(player.pet.id);
    }
    claimedPets.add(pet.id);
    player.pet = {
      id: pet.id,
      name: pet.name,
      image: pet.image,
      skillId: pet.skillId,
    };
    return player.pet;
  }

  function petSkillLabel(pet) {
    if (!pet) {
      return "";
    }
    const skill = SKILLS[pet.skillId];
    return skill ? `${skill.icon} ${skill.name}` : "";
  }

  function choosePet(player) {
    return new Promise((resolve) => {
      // If this player already has a pet, treat it as available to re-show? No —
      // other players can't take it, but this player can swap by releasing it on claim.
      // Show all unclaimed pets; if swapping, current pet stays claimed until new pick.
      const pool = remainingPets();
      petPickerTitle.textContent = `${player.label} — pick a pet friend`;
      petPickerGrid.innerHTML = "";

      if (!pool.length) {
        petPicker.hidden = true;
        showPopup("No pets left!", "info", player.position);
        setEvent("Every pet friend has already been chosen!");
        resolve("continue");
        return;
      }

      pool.forEach((pet) => {
        const skill = SKILLS[pet.skillId];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "skill-pick-btn pet-pick-btn";
        button.innerHTML = `
          <img src="${pet.image}" alt="" width="72" height="72" />
          <strong>${pet.name}</strong>
          <span class="pet-skill-tag">${skill.icon} ${skill.name}</span>
          <span>${skill.desc}</span>
        `;
        button.addEventListener("click", () => {
          const claimed = claimPet(player, pet.id);
          petPicker.hidden = true;
          if (claimed) {
            updateHud();
            showPopup(`${claimed.name}! ${skill.icon}`, "skill", player.position);
            setEvent(
              `${player.label} chose ${claimed.name}! Battle skill: ${skill.icon} ${skill.name}.`
            );
          }
          resolve("continue");
        });
        petPickerGrid.appendChild(button);
      });

      petPicker.hidden = false;
      setEvent(`${player.label} met some animal friends — choose a pet!`);
    });
  }

  let playerCount = 1;
  let players = [];
  let pickingIndex = 0;
  let currentIndex = 0;
  let busy = false;
  let spaceEls = [];
  let tokenEls = [];
  let openerIndex = 0;
  let claimedSkills = new Set();
  let claimedPets = new Set();
  let chanceDeck = [];
  let battle = null;
  let activeMonster = null;
  let audioCtx = null;

  function ensureAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return null;
    }
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playBoing(step = 0) {
    const ctx = ensureAudio();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    const startFreq = 520 + (step % 3) * 40;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  function showScreen(screen) {
    countScreen.hidden = screen !== countScreen;
    pickScreen.hidden = screen !== pickScreen;
    playScreen.hidden = screen !== playScreen;
    battleScreen.hidden = screen !== battleScreen;
    resultsScreen.hidden = screen !== resultsScreen;
  }

  function currentPlayer() {
    return players[currentIndex];
  }

  function remainingSkillIds() {
    return SKILL_IDS.filter((id) => !claimedSkills.has(id));
  }

  function claimSkill(player, skillId) {
    if (!skillId || claimedSkills.has(skillId)) {
      return null;
    }
    if (player.skills.length >= MAX_SKILLS) {
      return null;
    }
    claimedSkills.add(skillId);
    player.skills.push(skillId);
    return SKILLS[skillId];
  }

  function grantRandomRemainingSkill(player) {
    if (player.skills.length >= MAX_SKILLS) {
      return null;
    }
    const remaining = remainingSkillIds();
    if (!remaining.length) {
      return null;
    }
    const id = remaining[Math.floor(Math.random() * remaining.length)];
    return claimSkill(player, id);
  }

  function chooseSkill(player) {
    return new Promise((resolve) => {
      const remaining = remainingSkillIds();
      skillPickerTitle.textContent = `${player.label} — pick a skill`;
      skillPickerGrid.innerHTML = "";
      remaining.forEach((skillId) => {
        const skill = SKILLS[skillId];
        const button = document.createElement("button");
        button.type = "button";
        button.className = "skill-pick-btn";
        button.innerHTML = `
          <span class="skill-pick-icon">${skill.icon}</span>
          <strong>${skill.name}</strong>
          <span>${skill.desc}</span>
        `;
        button.addEventListener("click", () => {
          const claimed = claimSkill(player, skillId);
          skillPicker.hidden = true;
          if (claimed) {
            updateHud();
            showPopup(`${claimed.icon} ${claimed.name}!`, "skill", player.position);
            setEvent(
              `${player.label} chose ${claimed.icon} ${claimed.name}! (${claimed.desc})`
            );
          }
          resolve("continue");
        });
        skillPickerGrid.appendChild(button);
      });
      skillPicker.hidden = false;
      setEvent(`${player.label} found a skill chest — choose one!`);
    });
  }

  function skillSummary(player) {
    if (!player.skills.length) {
      return "no skills";
    }
    return player.skills.map((id) => SKILLS[id].icon).join(" ");
  }

  function bossMaxHp(count) {
    return 10 + count * 6;
  }

  // 7×7 grid perimeter (24 cells), clockwise from bottom-left.
  const SPACE_GRID = [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
    [7, 7],
    [6, 7],
    [5, 7],
    [4, 7],
    [3, 7],
    [2, 7],
    [1, 7],
    [1, 6],
    [1, 5],
    [1, 4],
    [1, 3],
    [1, 2],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
  ];

  function stackClass(count) {
    return count <= 1 ? "stack-1" : count === 2 ? "stack-2" : count === 3 ? "stack-3" : "stack-4";
  }

  function setEvent(message) {
    eventText.textContent = message;
  }

  function bumpStat() {
    statsBar.classList.remove("bump");
    void statsBar.offsetWidth;
    statsBar.classList.add("bump");
  }

  function showPopup(text, kind = "good", spaceIndex = null) {
    if (!boardWrap) {
      return;
    }
    const popup = document.createElement("div");
    popup.className = `board-popup board-popup-${kind}`;
    popup.textContent = text;

    let left = boardWrap.clientWidth / 2;
    let top = boardWrap.clientHeight * 0.42;
    if (spaceIndex != null && spaceEls[spaceIndex]) {
      const wrapRect = boardWrap.getBoundingClientRect();
      const spaceRect = spaceEls[spaceIndex].getBoundingClientRect();
      left = spaceRect.left + spaceRect.width / 2 - wrapRect.left;
      top = spaceRect.top + spaceRect.height / 2 - wrapRect.top;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    boardWrap.appendChild(popup);
    popup.addEventListener("animationend", () => {
      popup.remove();
    });
  }

  function updateHud() {
    const player = currentPlayer();
    if (!player) {
      return;
    }
    turnLabel.textContent = player.label;
    turnLabel.style.color = player.color;
    strengthValue.textContent = String(player.strength);
    renderRoster();
    tokenEls.forEach((el, index) => {
      el.classList.toggle("is-active", index === currentIndex);
    });
  }

  let openRosterIndex = -1;

  function closeRosterPopover() {
    openRosterIndex = -1;
    document.querySelectorAll(".roster-popover.is-open").forEach((el) => {
      el.classList.remove("is-open");
    });
    document.querySelectorAll(".roster-face[aria-expanded='true']").forEach((el) => {
      el.setAttribute("aria-expanded", "false");
    });
  }

  function renderRoster() {
    if (!rosterRow) {
      return;
    }
    rosterRow.innerHTML = "";
    players.forEach((player, index) => {
      const card = document.createElement("div");
      card.className = `roster-card${index === currentIndex ? " is-turn" : ""}`;
      card.style.setProperty("--player-color", player.color);

      const starSlots = Array.from({ length: MAX_STAR_SLOTS }, (_, i) => {
        const filled = i < player.strength;
        return `<span class="stat-slot stat-star${filled ? " is-filled" : ""}"><img src="${SYM("star")}" alt="" /></span>`;
      }).join("");

      const skillSlots = Array.from({ length: MAX_SKILLS }, (_, i) => {
        const skillId = player.skills[i];
        if (!skillId) {
          return `<span class="stat-slot stat-skill"></span>`;
        }
        const skill = SKILLS[skillId];
        return `<span class="stat-slot stat-skill is-filled" title="${skill.name}">${skill.icon}</span>`;
      }).join("");

      const petSlots = Array.from({ length: MAX_PET_SLOTS }, (_, i) => {
        if (i === 0 && player.pet) {
          return `<span class="stat-slot stat-pet is-filled" title="${player.pet.name}: ${petSkillLabel(player.pet)}"><img src="${player.pet.image}" alt="${player.pet.name}" /></span>`;
        }
        return `<span class="stat-slot stat-pet"></span>`;
      }).join("");

      const isOpen = openRosterIndex === index;
      card.innerHTML = `
        <button
          type="button"
          class="roster-face"
          aria-expanded="${isOpen ? "true" : "false"}"
          aria-label="${player.label} ${player.hero.name} stats"
        >
          <img src="${player.hero.image}" alt="" width="64" height="64" />
          <span class="roster-face-tag">${player.label}</span>
          <span class="roster-face-stars">${player.strength}★</span>
        </button>
        <div class="roster-popover${isOpen ? " is-open" : ""}" role="dialog" aria-label="${player.label} stats">
          <div class="stat-body">
            <span class="stat-ribbon">${player.label}</span>
            <strong class="stat-name">${player.hero.name}</strong>
            <div class="stat-row stat-row-stars">
              <div class="stat-slots">${starSlots}</div>
            </div>
            <div class="stat-row">
              <div class="stat-row-label">
                <img src="${SYM("potion")}" alt="" />
                <span>Skills</span>
              </div>
              <div class="stat-slots">${skillSlots}</div>
            </div>
            <div class="stat-row">
              <div class="stat-row-label">
                <img src="${SYM("paw")}" alt="" />
                <span>Pets</span>
              </div>
              <div class="stat-slots">${petSlots}</div>
            </div>
          </div>
        </div>
      `;

      const faceBtn = card.querySelector(".roster-face");
      faceBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        if (openRosterIndex === index) {
          closeRosterPopover();
          return;
        }
        openRosterIndex = index;
        renderRoster();
      });

      card.querySelector(".roster-popover").addEventListener("click", (event) => {
        event.stopPropagation();
      });

      rosterRow.appendChild(card);
    });
  }

  function placeTokens(animateIndex = -1) {
    spaceEls.forEach((spaceEl) => {
      const slot = spaceEl.querySelector(".space-tokens");
      if (slot) {
        slot.className = "space-tokens";
      }
    });

    const byPosition = {};
    players.forEach((player, index) => {
      if (!byPosition[player.position]) {
        byPosition[player.position] = [];
      }
      byPosition[player.position].push(index);
    });

    Object.keys(byPosition).forEach((positionKey) => {
      const indices = byPosition[positionKey];
      const spaceEl = spaceEls[Number(positionKey)];
      const slot = spaceEl.querySelector(".space-tokens");
      slot.className = `space-tokens ${stackClass(indices.length)}`;
      indices.forEach((playerIndex) => {
        const el = tokenEls[playerIndex];
        slot.appendChild(el);
        if (animateIndex === playerIndex) {
          el.classList.remove("hop");
          void el.offsetWidth;
          el.classList.add("hop");
        }
      });
    });
  }

  function buildTokens() {
    tokenEls = players.map((player) => {
      const el = document.createElement("div");
      el.className = "token";
      el.style.setProperty("--player-color", player.color);
      el.innerHTML = `
        <span class="token-label">${player.label}</span>
        <img src="${player.hero.image}" alt="${player.hero.name}" width="64" height="64" />
        <span class="token-name">${player.hero.name}</span>
      `;
      return el;
    });
  }

  function buildBoard() {
    board.innerHTML = "";
    spaceEls = [];

    const center = document.createElement("div");
    center.className = "board-center";
    center.innerHTML = `
      <img
        class="board-center-art"
        src="../../assets/board-background-2.png"
        alt=""
        aria-hidden="true"
      />
      <img
        class="scene-sun"
        src="${SYM("sun")}"
        alt=""
        aria-hidden="true"
      />
      <img
        class="board-title"
        src="../../assets/board-title.png"
        alt="Castle Quest"
      />
    `;
    if (rollBtn) {
      center.appendChild(rollBtn);
    }
    board.appendChild(center);

    SPACES.forEach((space, index) => {
      const [row, col] = SPACE_GRID[index];
      const el = document.createElement("button");
      el.type = "button";
      el.className = `space space-${space.type}`;
      el.style.gridRow = String(row);
      el.style.gridColumn = String(col);
      const needHint =
        space.type === "finish"
          ? `<span class="space-need">${space.need}★</span>`
          : "";
      const iconHtml = space.symbol
        ? `<img class="space-symbol" src="${space.symbol}" alt="" />`
        : `<span class="space-icon">${space.icon}</span>`;
      el.innerHTML = `
        ${iconHtml}
        ${needHint}
        <span class="space-tokens"></span>
      `;
      el.setAttribute(
        "aria-label",
        space.need ? `${space.label}, needs ${space.need} stars` : space.label
      );
      el.disabled = true;
      board.appendChild(el);
      spaceEls.push(el);
    });
  }

  function highlightPositions() {
    const occupied = new Set(players.map((player) => player.position));
    spaceEls.forEach((el, index) => {
      el.classList.toggle("is-current", occupied.has(index));
    });
  }

  const TILE_BLURBS = {
    start: "Your adventure begins here!",
    boost: "Power up! Gain 1 star to grow stronger.",
    friend: "Meet a pet friend with a special battle skill.",
    skill: "Choose one unique skill for the boss fight.",
    rest: "Take a cozy rest. Nothing changes.",
    oops: "A windy whoosh! Lose 1 star (you keep at least 1).",
    chance: "Draw a Chance card — surprises, dares, and stars await!",
    finish: "Need enough stars to open the castle and battle the monster!",
  };

  function showTileCard(space, outcomeText) {
    return new Promise((resolve) => {
      if (space.symbol) {
        tileCardIcon.innerHTML = `<img src="${space.symbol}" alt="" width="72" height="72" />`;
      } else {
        tileCardIcon.textContent = space.icon;
      }
      tileCardTitle.textContent = space.label;
      let blurb = TILE_BLURBS[space.type] || "";
      if (space.need) {
        blurb += ` Needs ${space.need}★.`;
      }
      tileCardBlurb.textContent = blurb;
      tileCardOutcome.textContent = outcomeText || "";
      tileCard.hidden = false;

      const onOk = () => {
        tileCardOk.removeEventListener("click", onOk);
        tileCard.hidden = true;
        resolve();
      };
      tileCardOk.addEventListener("click", onOk);
    });
  }

  function bounceFromCastle(player) {
    player.position = Math.max(0, player.position - 1);
    placeTokens(players.indexOf(player));
    highlightPositions();
  }

  function resolveSpace(player) {
    const space = SPACES[player.position];
    const at = player.position;

    if (space.type === "boost") {
      player.strength += 1;
      updateHud();
      bumpStat();
      showPopup("Stars +1!", "good", at);
      const outcome = `Stars +1! Now ${player.strength}★`;
      setEvent(`Power up! ${player.label} gains a star. Now ${player.strength}!`);
      return { next: "continue", outcome };
    }

    if (space.type === "friend") {
      if (!remainingPets().length) {
        showPopup("No pets left!", "info", at);
        setEvent("Every pet friend has already been chosen!");
        return { next: "continue", outcome: "No pets left to choose." };
      }
      return {
        next: "choose-pet",
        outcome: "Time to pick a pet friend!",
      };
    }

    if (space.type === "skill") {
      if (player.skills.length >= MAX_SKILLS) {
        showPopup("Skills full!", "info", at);
        setEvent(`${player.label}'s skill bag is full (max ${MAX_SKILLS}).`);
        return {
          next: "continue",
          outcome: `Skill bag full (max ${MAX_SKILLS}).`,
        };
      }
      if (!remainingSkillIds().length) {
        showPopup("No skills left!", "info", at);
        setEvent("Every skill has already been claimed!");
        return { next: "continue", outcome: "No skills left to choose." };
      }
      return {
        next: "choose-skill",
        outcome: "Time to pick a unique skill!",
      };
    }

    if (space.type === "rest") {
      showPopup("Rest…", "info", at);
      setEvent(`${player.label}'s ${player.hero.name} takes a cozy rest.`);
      return { next: "continue", outcome: "A cozy rest. Ready for the next roll!" };
    }

    if (space.type === "oops") {
      if (player.strength > 1) {
        player.strength -= 1;
        updateHud();
        bumpStat();
        showPopup("Stars −1!", "bad", at);
        setEvent(`Oops! ${player.label} loses 1 star. Now ${player.strength}.`);
        return { next: "continue", outcome: `Stars −1! Now ${player.strength}★` };
      }
      showPopup("Safe!", "info", at);
      setEvent(`A whoosh! But ${player.label} keeps their last star.`);
      return { next: "continue", outcome: "Safe! You keep your last star." };
    }

    if (space.type === "chance") {
      return {
        next: "chance",
        outcome: "Draw a Chance card!",
      };
    }

    if (space.type === "finish") {
      if (player.strength >= space.need) {
        openerIndex = players.indexOf(player);
        showPopup("Castle open!", "good", at);
        setEvent(`${player.label} opened the castle!`);
        return {
          next: "battle",
          outcome: "Castle open! Boss battle begins!",
        };
      }
      bounceFromCastle(player);
      showPopup(`Need ${space.need}★`, "bad", at);
      setEvent(
        `The castle gate needs ${space.need} stars! ${player.label} has ${player.strength}. Grow stronger!`
      );
      return {
        next: "continue",
        outcome: `Gate locked — need ${space.need}★ (have ${player.strength}★).`,
      };
    }

    if (space.type === "start") {
      return { next: "continue", outcome: "Back at the start!" };
    }

    setEvent(`${player.label}'s turn continues!`);
    return { next: "continue", outcome: "" };
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function livingFighters() {
    return battle.fighters.filter((fighter) => fighter.hp > 0);
  }

  function beginFinalBattle() {
    busy = true;
    rollBtn.disabled = true;
    statsBar.hidden = true;

    activeMonster = randomMonster();
    const maxHp = bossMaxHp(players.length);
    battle = {
      bossHp: maxHp,
      bossMaxHp: maxHp,
      bossStunned: false,
      turn: 0,
      waiting: false,
      fighters: players.map((player, index) => ({
        index,
        label: player.label,
        color: player.color,
        hero: player.hero,
        strength: player.strength,
        skills: [...player.skills],
        pet: player.pet
          ? {
              id: player.pet.id,
              name: player.pet.name,
              image: player.pet.image,
              skillId: player.pet.skillId,
            }
          : null,
        petReady: Boolean(player.pet),
        maxHp: player.strength + 3,
        hp: player.strength + 3,
        shielded: false,
      })),
    };

    monsterImage.src = activeMonster.image;
    monsterImage.alt = activeMonster.name;
    monsterName.textContent = `${activeMonster.name} the Guardian`;
    battleEvent.textContent = `${activeMonster.name} appears! Take turns — Attack or use a skill!`;
    renderBattle();
    showScreen(battleScreen);
    promptPlayerTurn();
  }

  function renderBattle() {
    const pct = Math.max(0, (battle.bossHp / battle.bossMaxHp) * 100);
    monsterHpFill.style.width = `${pct}%`;
    monsterHpText.textContent = `HP ${Math.max(0, battle.bossHp)} / ${battle.bossMaxHp}`;

    battleParty.innerHTML = "";
    battle.fighters.forEach((fighter, index) => {
      const card = document.createElement("div");
      const isTurn = index === battle.turn && fighter.hp > 0 && !battle.waiting;
      card.className = `battle-hero${isTurn ? " is-turn" : ""}${
        fighter.hp <= 0 ? " is-down" : ""
      }`;
      card.style.setProperty("--player-color", fighter.color);
      const skills = fighter.skills.length
        ? fighter.skills.map((id) => SKILLS[id].icon).join(" ")
        : "—";
      const shield = fighter.shielded ? " 🛡️" : "";
      const petIcon = fighter.pet
        ? `<img class="battle-pet" src="${fighter.pet.image}" alt="${fighter.pet.name}" width="28" height="28" />`
        : "";
      card.innerHTML = `
        <div class="battle-hero-art">
          <img src="${fighter.hero.image}" alt="" width="64" height="64" />
          ${petIcon}
        </div>
        <strong>${fighter.label}${shield}</strong>
        <span>${fighter.hero.name}${fighter.pet ? ` + ${fighter.pet.name}` : ""}</span>
        <div class="hp-bar tiny"><div class="hp-fill" style="width:${
          (fighter.hp / fighter.maxHp) * 100
        }%"></div></div>
        <span class="battle-stars">❤️ ${fighter.hp}/${fighter.maxHp} · ⭐ ${fighter.strength}</span>
        <span class="battle-skills">${skills}</span>
      `;
      battleParty.appendChild(card);
    });
  }

  function applySkillEffect(fighter, skillId, actorName) {
    const who = actorName || fighter.label;
    const skill = SKILLS[skillId];
    if (skillId === "smash") {
      const dmg = fighter.strength + 2;
      dealBossDamage(dmg);
      return `${who} uses Smash for ${dmg} damage!`;
    }
    if (skillId === "heal") {
      const before = fighter.hp;
      fighter.hp = Math.min(fighter.maxHp, fighter.hp + 2);
      return `${who} heals ${fighter.hp - before} HP!`;
    }
    if (skillId === "shield") {
      fighter.shielded = true;
      return `${who} raises a Shield!`;
    }
    if (skillId === "frenzy") {
      const dmg = fighter.strength * 2;
      dealBossDamage(dmg);
      return `${who} Frenzies for ${dmg} damage!`;
    }
    if (skillId === "stun") {
      battle.bossStunned = true;
      dealBossDamage(1);
      return `${who} Stuns the boss! (+1 damage)`;
    }
    return `${who} used ${skill.name}!`;
  }

  function setBattleActions(enabled) {
    battleActions.innerHTML = "";
    if (!enabled) {
      return;
    }
    const fighter = battle.fighters[battle.turn];
    if (!fighter || fighter.hp <= 0) {
      return;
    }

    const attackBtn = document.createElement("button");
    attackBtn.type = "button";
    attackBtn.className = "btn btn-primary battle-btn";
    attackBtn.textContent = `Attack (${fighter.strength})`;
    attackBtn.addEventListener("click", () => playerAttack());
    battleActions.appendChild(attackBtn);

    fighter.skills.forEach((skillId, skillIndex) => {
      const skill = SKILLS[skillId];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-skill";
      btn.textContent = `${skill.icon} ${skill.name}`;
      btn.title = skill.desc;
      btn.addEventListener("click", () => playerUseSkill(skillIndex));
      battleActions.appendChild(btn);
    });

    if (fighter.pet && fighter.petReady) {
      const skill = SKILLS[fighter.pet.skillId];
      const petBtn = document.createElement("button");
      petBtn.type = "button";
      petBtn.className = "btn btn-pet";
      petBtn.textContent = `🐾 ${fighter.pet.name}: ${skill.icon} ${skill.name}`;
      petBtn.title = `${fighter.pet.name}'s skill — ${skill.desc}`;
      petBtn.addEventListener("click", () => playerUsePetSkill());
      battleActions.appendChild(petBtn);
    }
  }

  function promptPlayerTurn() {
    const living = livingFighters();
    if (!living.length) {
      loseBattle();
      return;
    }
    if (battle.bossHp <= 0) {
      showVictory();
      return;
    }

    while (
      battle.turn < battle.fighters.length &&
      battle.fighters[battle.turn].hp <= 0
    ) {
      battle.turn += 1;
    }

    if (battle.turn >= battle.fighters.length) {
      bossTurn();
      return;
    }

    const fighter = battle.fighters[battle.turn];
    battle.waiting = false;
    battleEvent.textContent = `${fighter.label}'s turn — Attack or use a skill!`;
    renderBattle();
    setBattleActions(true);
  }

  function dealBossDamage(amount) {
    battle.bossHp = Math.max(0, battle.bossHp - amount);
  }

  async function playerAttack() {
    if (battle.waiting) {
      return;
    }
    battle.waiting = true;
    setBattleActions(false);
    const fighter = battle.fighters[battle.turn];
    dealBossDamage(fighter.strength);
    battleEvent.textContent = `${fighter.label} hits for ${fighter.strength}!`;
    renderBattle();
    await sleep(700);
    endPlayerTurn();
  }

  async function playerUseSkill(skillIndex) {
    if (battle.waiting) {
      return;
    }
    const fighter = battle.fighters[battle.turn];
    const skillId = fighter.skills[skillIndex];
    if (!skillId) {
      return;
    }

    battle.waiting = true;
    setBattleActions(false);
    fighter.skills.splice(skillIndex, 1);
    battleEvent.textContent = applySkillEffect(fighter, skillId);
    renderBattle();
    await sleep(800);
    endPlayerTurn();
  }

  async function playerUsePetSkill() {
    if (battle.waiting) {
      return;
    }
    const fighter = battle.fighters[battle.turn];
    if (!fighter.pet || !fighter.petReady) {
      return;
    }

    battle.waiting = true;
    setBattleActions(false);
    fighter.petReady = false;
    battleEvent.textContent = applySkillEffect(
      fighter,
      fighter.pet.skillId,
      `${fighter.pet.name}`
    );
    renderBattle();
    await sleep(800);
    endPlayerTurn();
  }

  function endPlayerTurn() {
    if (battle.bossHp <= 0) {
      showVictory();
      return;
    }
    battle.turn += 1;
    promptPlayerTurn();
  }

  async function bossTurn() {
    battle.waiting = true;
    setBattleActions(false);
    renderBattle();

    if (battle.bossStunned) {
      battle.bossStunned = false;
      battleEvent.textContent = `${activeMonster.name} is stunned and skips a turn!`;
      await sleep(900);
      battle.turn = 0;
      promptPlayerTurn();
      return;
    }

    const living = livingFighters();
    if (!living.length) {
      loseBattle();
      return;
    }

    const target = living[Math.floor(Math.random() * living.length)];
    const hit = 2;
    if (target.shielded) {
      target.shielded = false;
      battleEvent.textContent = `${activeMonster.name} swings at ${target.label} — Shield blocks it!`;
    } else {
      target.hp = Math.max(0, target.hp - hit);
      battleEvent.textContent = `${activeMonster.name} hits ${target.label} for ${hit}!`;
    }

    renderBattle();
    await sleep(900);

    if (!livingFighters().length) {
      loseBattle();
      return;
    }

    battle.turn = 0;
    promptPlayerTurn();
  }

  function loseBattle() {
    battle = null;
    const opener = players[openerIndex];
    bounceFromCastle(opener);
    statsBar.hidden = false;
    currentIndex = openerIndex;
    updateHud();
    setEvent(
      `The ${activeMonster.name} won this fight! ${opener.label} bounces back. Gather more skills and stars!`
    );
    showScreen(playScreen);
    busy = false;
    rollBtn.disabled = false;
  }

  function showVictory() {
    battle = null;
    busy = true;
    resultsTitle.textContent = "Monster defeated!";
    resultHero.hidden = true;
    resultHeroes.innerHTML = "";
    players.forEach((player) => {
      const img = document.createElement("img");
      img.src = player.hero.image;
      img.alt = player.hero.name;
      img.width = 88;
      img.height = 88;
      resultHeroes.appendChild(img);
    });
    finalScore.textContent = "Team victory!";
    finalMessage.textContent = `You beat ${activeMonster.name} the Guardian with stars, skills, and teamwork!`;
    showScreen(resultsScreen);
  }

  function showDiceFace(value) {
    diceCube.classList.remove("is-rolling");
    diceCube.style.transform = DICE_FACE_TRANSFORMS[value];
  }

  async function animateDiceRoll(value) {
    diceCube.classList.remove("is-rolling");
    void diceCube.offsetWidth;
    diceCube.classList.add("is-rolling");
    await sleep(950);
    diceCube.classList.remove("is-rolling");
    showDiceFace(value);
    await sleep(280);
  }

  function shuffleChanceDeck() {
    chanceDeck = [...CHANCE_CARDS];
    for (let i = chanceDeck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = chanceDeck[i];
      chanceDeck[i] = chanceDeck[j];
      chanceDeck[j] = temp;
    }
  }

  function takeChanceCard() {
    if (!chanceDeck.length) {
      shuffleChanceDeck();
    }
    return chanceDeck.pop();
  }

  function waitForChanceOk() {
    return new Promise((resolve) => {
      chanceOk.hidden = false;
      const onOk = () => {
        chanceOk.removeEventListener("click", onOk);
        chanceOverlay.hidden = true;
        chanceCardInner.classList.remove("is-flipped");
        resolve();
      };
      chanceOk.addEventListener("click", onOk);
    });
  }

  function applyStarDelta(player, amount) {
    if (amount > 0) {
      player.strength += amount;
    } else if (amount < 0 && player.strength > 1) {
      player.strength = Math.max(1, player.strength + amount);
    }
    updateHud();
    bumpStat();
  }

  function scoreChancePrompt(player, card) {
    return new Promise((resolve) => {
      chanceScoreRow.hidden = false;
      chanceScores.innerHTML = "";
      for (let score = 1; score <= 5; score += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chance-score-btn";
        button.textContent = String(score);
        button.addEventListener("click", () => {
          applyStarDelta(player, score);
          showPopup(`Stars +${score}!`, "good", player.position);
          chanceScoreRow.hidden = true;
          chanceResult.hidden = false;
          chanceResult.textContent = `Scored ${score}/5 — ${player.label} gains ${score}★!`;
          setEvent(`${player.label} scored ${score}/5 on “${card.title}” and gained ${score} stars!`);
          resolve();
        });
        chanceScores.appendChild(button);
      }
    });
  }

  function finishSpaceIndex() {
    return SPACES.findIndex((space) => space.type === "finish");
  }

  function offerCastlePass(player, card) {
    return new Promise((resolve) => {
      if (player.strength < card.amount) {
        chanceResult.hidden = false;
        chanceResult.textContent = `Need ${card.amount}★ to use this pass (have ${player.strength}★).`;
        setEvent(`${player.label} can't afford the Castle Pass.`);
        resolve(false);
        return;
      }

      chanceChoiceRow.hidden = false;
      chanceYesBtn.textContent = `Spend ${card.amount}★`;

      const cleanup = () => {
        chanceYesBtn.removeEventListener("click", onYes);
        chanceNoBtn.removeEventListener("click", onNo);
        chanceChoiceRow.hidden = true;
      };

      const onYes = () => {
        cleanup();
        player.strength -= card.amount;
        updateHud();
        bumpStat();
        const castleIndex = finishSpaceIndex();
        player.position = castleIndex;
        placeTokens(players.indexOf(player));
        highlightPositions();
        showPopup(`−${card.amount}★ → 🏰`, "good", castleIndex);
        chanceResult.hidden = false;
        chanceResult.textContent = `${player.label} zooms to the castle!`;
        setEvent(`${player.label} spent ${card.amount} stars and went to the castle!`);
        resolve(true);
      };

      const onNo = () => {
        cleanup();
        chanceResult.hidden = false;
        chanceResult.textContent = `${player.label} stays put.`;
        setEvent(`${player.label} skipped the Castle Pass.`);
        resolve(false);
      };

      chanceYesBtn.addEventListener("click", onYes);
      chanceNoBtn.addEventListener("click", onNo);
    });
  }

  async function playChanceCard(player) {
    const card = takeChanceCard();
    chanceOverlay.hidden = false;
    chanceCardInner.classList.remove("is-flipped");
    chanceResult.hidden = true;
    chanceResult.textContent = "";
    chanceScoreRow.hidden = true;
    chanceChoiceRow.hidden = true;
    chanceOk.hidden = true;
    chanceTitle.textContent = card.title;
    chanceText.textContent = card.text;
    setEvent(`${player.label} draws a Chance card…`);

    await sleep(280);
    chanceCardInner.classList.add("is-flipped");
    await sleep(700);

    if (card.kind === "score") {
      await scoreChancePrompt(player, card);
      await waitForChanceOk();
      return null;
    }

    if (card.kind === "gain") {
      applyStarDelta(player, card.amount);
      showPopup(`Stars +${card.amount}!`, "good", player.position);
      chanceResult.hidden = false;
      chanceResult.textContent = `${player.label} gains ${card.amount}★!`;
      setEvent(`${player.label} drew “${card.title}” and gained ${card.amount} stars!`);
      await waitForChanceOk();
      return null;
    }

    if (card.kind === "lose") {
      const before = player.strength;
      applyStarDelta(player, -card.amount);
      const lost = before - player.strength;
      showPopup(lost ? `Stars −${lost}!` : "Safe!", lost ? "bad" : "info", player.position);
      chanceResult.hidden = false;
      chanceResult.textContent = lost
        ? `${player.label} loses ${lost}★.`
        : `${player.label} keeps their last star.`;
      setEvent(`${player.label} drew “${card.title}”.`);
      await waitForChanceOk();
      return null;
    }

    if (card.kind === "skill") {
      const skill = grantRandomRemainingSkill(player);
      chanceResult.hidden = false;
      if (skill) {
        showPopup(`${skill.icon} ${skill.name}!`, "skill", player.position);
        chanceResult.textContent = `${player.label} gets ${skill.icon} ${skill.name}!`;
        setEvent(`${player.label} found ${skill.icon} ${skill.name} from Chance!`);
      } else {
        showPopup("No skills left!", "info", player.position);
        chanceResult.textContent = "No skills left — keep the stars you have!";
        setEvent("Chance scroll found, but no skills were left.");
      }
      await waitForChanceOk();
      return null;
    }

    if (card.kind === "castle") {
      const used = await offerCastlePass(player, card);
      await waitForChanceOk();
      return used ? "castle" : null;
    }

    await waitForChanceOk();
    return null;
  }

  function advanceTurn() {
    currentIndex = (currentIndex + 1) % players.length;
    updateHud();
    const player = currentPlayer();
    setEvent(`${player.label}'s turn — ${player.hero.name}. Tap the dice!`);
    rollBtn.disabled = false;
    busy = false;
  }

  async function afterResolve(result) {
    if (result.next === "chance") {
      await showTileCard(SPACES[currentPlayer().position], result.outcome);
      const chanceFollowUp = await playChanceCard(currentPlayer());
      if (chanceFollowUp === "castle") {
        const castleResult = resolveSpace(currentPlayer());
        await afterResolve(castleResult);
        return;
      }
      advanceTurn();
      return;
    }

    let infoSpace = SPACES[currentPlayer().position];
    if (result.outcome && result.outcome.includes("Gate locked")) {
      infoSpace = SPACES.find((entry) => entry.type === "finish") || infoSpace;
    }

    await showTileCard(infoSpace, result.outcome);

    if (result.next === "battle") {
      beginFinalBattle();
      return;
    }
    if (result.next === "choose-skill") {
      await chooseSkill(currentPlayer());
      await sleep(400);
      advanceTurn();
      return;
    }
    if (result.next === "choose-pet") {
      await choosePet(currentPlayer());
      await sleep(400);
      advanceTurn();
      return;
    }
    advanceTurn();
  }

  async function rollAndMove() {
    const player = currentPlayer();
    if (busy || !player) {
      return;
    }

    busy = true;
    rollBtn.disabled = true;
    const roll = 1 + Math.floor(Math.random() * 3);
    setEvent(`${player.label} (${player.hero.name}) is rolling…`);
    await animateDiceRoll(roll);
    setEvent(`${player.label} rolled a ${roll}!`);
    await sleep(250);

    for (let step = 0; step < roll; step += 1) {
      if (player.position >= SPACES.length - 1) {
        break;
      }
      player.position += 1;
      placeTokens(currentIndex);
      highlightPositions();
      playBoing(step);
      await sleep(320);
      if (SPACES[player.position].type === "finish") {
        const result = resolveSpace(player);
        await afterResolve(result);
        return;
      }
    }

    const result = resolveSpace(player);
    await afterResolve(result);
  }

  function startAdventure() {
    currentIndex = 0;
    busy = false;
    openerIndex = 0;
    openRosterIndex = -1;
    battle = null;
    claimedSkills = new Set();
    claimedPets = new Set();
    shuffleChanceDeck();
    skillPicker.hidden = true;
    petPicker.hidden = true;
    tileCard.hidden = true;
    chanceOverlay.hidden = true;
    players.forEach((player) => {
      player.position = 0;
      player.strength = START_STRENGTH;
      player.skills = [];
      player.pet = null;
    });
    statsBar.hidden = false;
    rollBtn.disabled = false;
    showDiceFace(1);
    buildBoard();
    buildTokens();
    placeTokens();
    highlightPositions();
    updateHud();
    const player = currentPlayer();
    setEvent(`${player.label}'s turn — ${player.hero.name}. Tap the dice!`);
    showScreen(playScreen);
  }

  function renderPicked() {
    pickedRow.innerHTML = "";
    players.forEach((player) => {
      const chip = document.createElement("div");
      chip.className = "picked-chip";
      chip.style.setProperty("--player-color", player.color);
      chip.innerHTML = `
        <img src="${player.hero.image}" alt="" width="36" height="36" />
        <span>${player.label}: ${player.hero.name}</span>
      `;
      pickedRow.appendChild(chip);
    });
  }

  function renderHeroes() {
    const taken = new Set(players.map((player) => player.hero.id));
    pickTitle.textContent = `Player ${pickingIndex + 1} — pick a hero`;
    heroGrid.innerHTML = "";
    heroes.forEach((animal) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "hero-card";
      button.disabled = taken.has(animal.id);
      button.innerHTML = `
        <img src="${animal.image}" alt="" width="88" height="88" />
        <span>${animal.name}</span>
      `;
      button.addEventListener("click", () => {
        players.push({
          label: `P${pickingIndex + 1}`,
          color: PLAYER_COLORS[pickingIndex],
          hero: animal,
          position: 0,
          strength: START_STRENGTH,
          skills: [],
          pet: null,
        });
        pickingIndex += 1;
        renderPicked();
        if (pickingIndex >= playerCount) {
          startAdventure();
        } else {
          renderHeroes();
        }
      });
      heroGrid.appendChild(button);
    });
    renderPicked();
  }

  function beginHeroPick(count) {
    playerCount = count;
    players = [];
    pickingIndex = 0;
    showScreen(pickScreen);
    renderHeroes();
  }

  function showCountSelect() {
    statsBar.hidden = true;
    showScreen(countScreen);
  }

  function renderCountButtons() {
    countRow.innerHTML = "";
    for (let count = 1; count <= MAX_PLAYERS; count += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "count-btn";
      button.textContent = String(count);
      button.addEventListener("click", () => beginHeroPick(count));
      countRow.appendChild(button);
    }
  }

  renderCountButtons();
  showCountSelect();

  document.addEventListener("click", () => {
    if (openRosterIndex !== -1) {
      closeRosterPopover();
      renderRoster();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && openRosterIndex !== -1) {
      closeRosterPopover();
      renderRoster();
    }
  });

  rollBtn.addEventListener("click", () => {
    ensureAudio();
    rollAndMove();
  });
  playAgainBtn.addEventListener("click", () => {
    if (players.length) {
      startAdventure();
    }
  });
  changeHeroBtn.addEventListener("click", showCountSelect);
})();
