const clickerInterval = 5000;
let clickerCost = 100;

const counterEl = document.querySelector("#count");
const theButton = document.querySelector("#theButton");

const autoEl = document.querySelector("#clickerCount");
const autoClickerBtn = document.querySelector("#autoClicker");
const clickerCostEl = document.querySelector("#clickerCost");

function counter(state = 0, action) {
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

function autoClickers(state = 0, action) {
  switch (action.type) {
    case "ADD_CLICKER":
      if ((state + 1) % 5 === 0) clickerCost += Math.round(clickerCost * 0.2);
      return state + 1;
    default:
      return state;
  }
}

const store = Redux.createStore(
  Redux.combineReducers({ counter, autoClickers })
);

let autoTimer;
function render() {
  const { counter, autoClickers } = store.getState();
  counterEl.innerHTML = counter;

  autoEl.innerHTML = autoClickers;
  clickerCostEl.innerHTML = clickerCost;
  autoClickerBtn.disabled = counter < clickerCost;
  if (autoTimer) clearInterval(autoTimer);
  if (autoClickers)
    autoTimer = setInterval(() => {
      store.dispatch({ type: "INC", value: 1 });
    }, clickerInterval / autoClickers);
}

render();
store.subscribe(render);

theButton.addEventListener("click", () =>
  store.dispatch({ type: "INC", value: 1 })
);

autoClickerBtn.addEventListener("click", () => {
  store.dispatch({ type: "ADD_CLICKER" });
});
