(() => {
  const categoryScreen = document.getElementById("categoryScreen");
  const playScreen = document.getElementById("playScreen");
  const resultsScreen = document.getElementById("resultsScreen");
  const categoryList = document.getElementById("categoryList");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const changeCategoryBtn = document.getElementById("changeCategoryBtn");
  const rightBtn = document.getElementById("rightBtn");
  const wrongBtn = document.getElementById("wrongBtn");
  const itemImage = document.getElementById("itemImage");
  const guessName = document.getElementById("guessName");
  const feedback = document.getElementById("feedback");
  const progressText = document.getElementById("progressText");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const scoreValue = document.getElementById("scoreValue");
  const scoreTotal = document.getElementById("scoreTotal");
  const finalScore = document.getElementById("finalScore");
  const finalMessage = document.getElementById("finalMessage");

  let selectedCategoryId = null;
  let deck = [];
  let index = 0;
  let correctCount = 0;
  let currentQuestion = null;
  let locked = false;

  function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function showScreen(screen) {
    categoryScreen.hidden = screen !== categoryScreen;
    playScreen.hidden = screen !== playScreen;
    resultsScreen.hidden = screen !== resultsScreen;
  }

  function updateScore() {
    scoreValue.textContent = String(correctCount);
    scoreTotal.textContent = String(deck.length);
  }

  function bumpScore() {
    scoreDisplay.classList.remove("bump");
    void scoreDisplay.offsetWidth;
    scoreDisplay.classList.add("bump");
  }

  function buildQuestion(item, allItems) {
    const isMatch = Math.random() < 0.5;
    let labelName = item.name;

    if (!isMatch) {
      const others = allItems.filter((entry) => entry.id !== item.id);
      labelName = others[Math.floor(Math.random() * others.length)].name;
    }

    return { item, labelName, isMatch };
  }

  function setAnswerButtonsEnabled(enabled) {
    rightBtn.disabled = !enabled;
    wrongBtn.disabled = !enabled;
  }

  function renderQuestion() {
    const allItems = CATEGORIES[selectedCategoryId].items;
    currentQuestion = buildQuestion(deck[index], allItems);
    locked = false;
    setAnswerButtonsEnabled(true);

    feedback.textContent = "";
    feedback.className = "feedback";

    itemImage.classList.remove("refresh");
    void itemImage.offsetWidth;
    itemImage.src = currentQuestion.item.image;
    itemImage.alt = currentQuestion.item.name;
    itemImage.classList.add("refresh");
    requestAnimationFrame(() => {
      itemImage.classList.remove("refresh");
    });

    guessName.textContent = currentQuestion.labelName;
    progressText.textContent = `Question ${index + 1} of ${deck.length}`;
  }

  function startGame() {
    const category = CATEGORIES[selectedCategoryId];
    deck = shuffle(category.items);
    index = 0;
    correctCount = 0;
    scoreDisplay.hidden = false;
    updateScore();
    showScreen(playScreen);
    renderQuestion();
  }

  function endGame() {
    showScreen(resultsScreen);
    finalScore.textContent = `${correctCount} / ${deck.length}`;

    const ratio = correctCount / deck.length;
    if (ratio === 1) {
      finalMessage.textContent = "Perfect — you got them all!";
    } else if (ratio >= 0.75) {
      finalMessage.textContent = "Great job — almost all right!";
    } else if (ratio >= 0.5) {
      finalMessage.textContent = "Nice work. Play again to beat your score!";
    } else {
      finalMessage.textContent = "Keep practicing — you will get better!";
    }
  }

  function answer(playerSaysMatch) {
    if (locked || !currentQuestion) {
      return;
    }

    locked = true;
    setAnswerButtonsEnabled(false);

    const isCorrect = playerSaysMatch === currentQuestion.isMatch;
    if (isCorrect) {
      correctCount += 1;
      feedback.textContent = "Correct!";
      feedback.className = "feedback correct";
      bumpScore();
    } else {
      const truth = currentQuestion.isMatch ? "Right" : "Wrong";
      feedback.textContent = `Oops — that was ${truth}.`;
      feedback.className = "feedback incorrect";
    }

    index += 1;
    updateScore();

    window.setTimeout(() => {
      if (index >= deck.length) {
        endGame();
      } else {
        renderQuestion();
      }
    }, 850);
  }

  function showCategorySelect() {
    scoreDisplay.hidden = true;
    showScreen(categoryScreen);
  }

  function renderCategoryList() {
    categoryList.innerHTML = "";
    getCategoryList().forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-card";
      button.innerHTML = `
        <img src="${category.icon}" alt="" width="72" height="72" />
        <span class="category-card-title">${category.name}</span>
      `;
      button.addEventListener("click", () => {
        selectedCategoryId = category.id;
        startGame();
      });
      categoryList.appendChild(button);
    });
  }

  renderCategoryList();
  showCategorySelect();

  playAgainBtn.addEventListener("click", startGame);
  changeCategoryBtn.addEventListener("click", showCategorySelect);
  rightBtn.addEventListener("click", () => answer(true));
  wrongBtn.addEventListener("click", () => answer(false));
})();
