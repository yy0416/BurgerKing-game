

let burgers = [];
fetch('burgers.json')
    .then(response => response.json())
    .then(data => {
        burgers = data;
        console.log('Burgers data loaded:', burgers);

        // 启用按钮
        document.querySelectorAll('#menu button').forEach(btn => {
            btn.disabled = false;
        });
    })
    .catch(error => {
        console.error('Error loading burgers data:', error);
    });


const ingredientImages = {
    "bun 4": "assets/icons/bun_4.svg",
    "ketchup": "assets/icons/ketchup.svg",
    "moutarde": "assets/icons/moutarde.svg",
    "cornichon": "assets/icons/cornichon.svg",
    "fromage": "assets/icons/fromage.svg",
    "patty hamburger": "assets/icons/patty hamburger.svg",
    "bun 4 down": "assets/icons/bun_4 down.svg",
    "tomate": "assets/icons/tomate.svg",
    "laitue": "assets/icons/laitue.svg",
    "onionx2": "assets/icons/onionx2.svg",
    "bacon": "assets/icons/bacon.svg",
    "patty master": "assets/icons/patty master.svg",
    "baconx2": "assets/icons/baconx2.svg",
    "cornichonx2": "assets/icons/cornichonx2.svg",
    "bun hamburger": "assets/icons/bun hamburger.svg",
    "bun hamburger down": "assets/icons/bun hamburger down.svg",
    "sauce cajun": "assets/icons/sauce cajun.svg",
    "patty fish": "assets/icons/patty fish.svg",
    "sauce king": "assets/icons/sauce king.svg",
    "onionx3": "assets/icons/onionx3.svg",
    "tortilla": "assets/icons/tortilla.svg",
    "crousty chevresx4": "assets/icons/crousty chevresx4.svg",
    "onions frits": "assets/icons/onions frits.svg",
    "tomatex2": "assets/icons/tomatex2.svg",
    "fromagex2": "assets/icons/fromagex2.svg",
    "patty chrispy chicken": "assets/icons/patty chrispy chicken.svg",
    "sauce_bbq": "assets/icons/sauce_bbq.svg",
    "mayonnaise": "assets/icons/mayonnaise.svg",
    "patty whopper": "assets/icons/patty whopper.svg",
    "cornichonx4": "assets/icons/cornichonx4.svg",
    "onion ringsx3": "assets/icons/onion ringsx3.svg",
    "onions caramelises": "assets/icons/onions caramelises.svg",
    "bun 5": "assets/icons/bun 5.svg",
    "bun 5 down": "assets/icons/bun 5 down.svg",
    "bun 4.5": "assets/icons/bun 4.5.svg",
    "bun 4.5 down": "assets/icons/bun 4.5 down.svg",
    "baconx3": "assets/icons/baconx3.svg",
    "patty chicken premium": "assets/icons/patty chicken premium.svg",
    "sauce moutancienne": "assets/icons/sauce moutancienne.svg",
    "roquette": "assets/icons/roquette.svg",
    "raclettes fumeesx2": "assets/icons/raclettes fumeesx2.svg",
    "bun shiny": "assets/icons/bun shiny.svg",
    "bun shiny down": "assets/icons/bun shiny down.svg",
    "cantalx2": "assets/icons/cantalx2.svg",
    "bun shiny couronne": "assets/icons/bun shiny couronne.svg",
    "bun shiny couronne down": "assets/icons/bun shiny couronne down.svg",
    "cornichonX4": "assets/icons/cornichonx4.svg",
    "rosti": "assets/icons/rosti.svg",
    "echalote": "assets/icons/echalote.svg"


};



/********************************
 * Game State
 ********************************/

let gameMode = null;            // "category" | "progression"
let selectedCategory = "all";   // beef / chicken / fish / veggie/ all
let level = 1;

let currentBurger = null;
let stepIndex = 0;

let startTime = 0;
let timerInterval = null;

/********************************
 * Menu
 ********************************/

function startCategoryMode() {
    gameMode = "category";
    document.getElementById("menu").style.display = "none";
    document.getElementById("category-select").style.display = "block";
}

function selectCategory(cat) {
    selectedCategory = cat;
    document.getElementById("category-select").style.display = "none";
    document.getElementById("game").style.display = "block";
    startNewGame();
}


function startProgressionMode() {
    gameMode = "progression";
    level = 1;
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";
    startNewGame();
}



/********************************
 * 游戏核心逻辑
 ********************************/






function startNewGame() {
    hideSolutionOverlay();
    // 🔍 根据模式筛选可用汉堡
    let availableBurgers = burgers;

    if (gameMode === "category" && selectedCategory !== "all") {
        availableBurgers = burgers.filter(
            b => b.category === selectedCategory
        );
    }

    if (gameMode === "progression") {
        availableBurgers = burgers.filter(
            b => b.difficulty <= level
        );
    }

    if (availableBurgers.length === 0) {
        document.getElementById("burger-name").innerText =
            "❌ Aucun burger dans cette catégorie";

        document.getElementById("result").innerHTML =
            "<div class='wrong'>Cette catégorie n'est pas encore disponible</div>";

        return; // ⛔ 非常重要：直接停止
    }

    // 🎲 随机抽一个
    currentBurger = availableBurgers[
        Math.floor(Math.random() * availableBurgers.length)
    ];




    // 🔄 重置状态
    stepIndex = 0;
    startTime = Date.now();

    // 🖥️ 更新界面
    document.getElementById("burger-name").innerText =
        `🍔 ${currentBurger.name}`;

    document.getElementById("burger").innerHTML = "";
    document.getElementById("result").innerHTML = "";

    // ⏱️ 启动计时器
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);
}


function choose(item) {
    const resultDiv = document.getElementById("result");

    // ✅ 选对了
    if (item === currentBurger.steps[stepIndex]) {

        stepIndex++;

        const burgerDiv = document.getElementById("burger");
        const img = document.createElement("img");
        img.src = ingredientImages[item];
        img.alt = item;
        img.width = 30;


        burgerDiv.appendChild(img);

        resultDiv.innerHTML = "";

        if (stepIndex === currentBurger.steps.length) {
            finishGame();
        }

    } else {
        // ❌ 选错
        resultDiv.innerHTML =
            "<div class='wrong'>❌ Mauvais ingrédient</div>";
    }
}

let nextGameTimeout = null;
function finishGame() {
    clearInterval(timerInterval);

    const time = ((Date.now() - startTime) / 1000).toFixed(1);
    const stars = time <= 15 ? "⭐⭐⭐" : "⭐";

    if (gameMode === "progression") {
        level++;
    }

    document.getElementById("result").innerHTML =
        `<div class='correct'>
        Burger terminé ! Temps : ${time}s ${stars}<br>
        ${gameMode === "progression" ? `Niveau ${level}` : ""}
      </div>`;

    nextGameTimeout = setTimeout(startNewGame, 3000);
}


function goBackToMenu() {
    // 停止计时
    clearInterval(timerInterval);
    clearTimeout(nextGameTimeout);

    hideSolutionOverlay();
    // 重置游戏状态
    currentBurger = null;
    stepIndex = 0;
    gameMode = null;
    selectedCategory = "all";
    level = 1;

    // 清空界面
    document.getElementById("burger").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("burger-name").innerText = "";
    document.getElementById("timer").innerText = "⏱️ 0 s";

    // 显示 / 隐藏页面
    document.getElementById("game").style.display = "none";
    document.getElementById("category-select").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

function showAnswer() {
    if (!currentBurger) return;

    // 停止计时
    clearInterval(timerInterval);

    const burgerDiv = document.getElementById("burger");
    burgerDiv.innerHTML = "";

    // 正确顺序：从下到上append
    currentBurger.steps.forEach(step => {
        const img = document.createElement("img");
        img.src = ingredientImages[step];
        img.alt = step;
        img.width = 30;
        burgerDiv.appendChild(img);
    });

    document.getElementById("solution-overlay").style.display = "flex";

    // 禁止继续选（可选）
    stepIndex = currentBurger.steps.length;
}



/********************************
*  工具函数
********************************/

// 更新计时器显示
function updateTimer() {
    const t = ((Date.now() - startTime) / 1000).toFixed(1);
    document.getElementById("timer").innerText = "⏱️ " + t + " s";
}

// 暂停计时
function pauseTimer() {
    clearInterval(timerInterval);
}

// 重新开始游戏
function restartGame() {
    hideSolutionOverlay();
    startNewGame();
}
// 隐藏解答覆盖层
function hideSolutionOverlay() {
    const overlay = document.getElementById("solution-overlay");
    if (overlay) overlay.style.display = "none";
}


