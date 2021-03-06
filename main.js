let initState = JSON.parse(localStorage.getItem("state")) || {
  counter: 0,
  autoClickers: 0,
  worth: 0
};

const clickerInterval = 5000;
let clickerCost = 100 + 100 * (Math.floor(initState.autoClickers / 5) * 0.2);

const counterEl = document.querySelector("#count");
const theButton = document.querySelector("#theButton");
const netWorth = document.querySelector("#net-worth");

const autoEl = document.querySelector("#clickerCount");
const autoClickerBtn = document.querySelector("#autoClicker");
const clickerCostEl = document.querySelector("#clickerCost");

// REDUCERS ======================

function counter(state = initState.counter, action) {
  switch (action.type) {
    case "INC":
      return state + action.value;
    case "DEC":
      return state - action.value;
    case "ADD_CLICKER":
      return state - clickerCost;
    default:
      return state;
  }
}

function worth(
  state = initState.worth || calculateNetWorth(initState),
  action
) {
  switch (action.type) {
    case "INC":
      return state + action.value;
    default:
      return state;
  }
}

function autoClickers(state = initState.autoClickers, action) {
  switch (action.type) {
    case "ADD_CLICKER":
      if ((state + 1) % 5 === 0) clickerCost += Math.round(clickerCost * 0.2);
      return state + 1;
    default:
      return state;
  }
}

// STORE =========================

const store = Redux.createStore(
  Redux.combineReducers({ counter, autoClickers, worth })
);

let autoTimer;
function render() {
  const state = store.getState();
  const { counter, autoClickers, worth } = state;

  counterEl.innerHTML = counter;
  autoEl.innerHTML = autoClickers;
  clickerCostEl.innerHTML = clickerCost;
  autoClickerBtn.disabled = counter < clickerCost;
  if (autoTimer) clearInterval(autoTimer);
  if (autoClickers)
    autoTimer = setInterval(() => {
      store.dispatch({ type: "INC", value: 1 });
    }, clickerInterval / autoClickers);

  localStorage.setItem("state", JSON.stringify(state));

  netWorth.innerHTML = worth;
}

render();
store.subscribe(render);

// LISTENERS =====================

theButton.addEventListener("click", () =>
  store.dispatch({ type: "INC", value: 1 })
);

autoClickerBtn.addEventListener("click", () => {
  store.dispatch({ type: "ADD_CLICKER" });
});

// HELPER FUNCTIONS

function calculateNetWorth(state) {
  const { counter, autoClickers } = state;
  if (!counter || !autoClickers) return 0;
  let clicks = counter;
  for (let i = 1; i <= autoClickers; i++) {
    clicks += 100 + 100 * (Math.floor(i / 5) * 0.2);
  }
  return clicks;
}
