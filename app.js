import { heroes } from './heroes.js';
import { gearList } from './gear.js';

let hero = {};
let heroName = "Outlaw Joe";
let inventory = [...gearList];
let equipped = {};
let allSlots = ["Head", "Torso", "Feet"];

function showTab(id) {
  document.querySelectorAll('.tabContent').forEach(tab => tab.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
}

function renderStatsTab() {
  const tab = document.getElementById('statsTab');
  const s = hero.stats;
  tab.innerHTML = `<h2>${hero.customName}</h2>`;
  for (let stat in s) {
    tab.innerHTML += `<label>${stat}: <input type="number" value="${s[stat]}" onchange="updateStat('${stat}', this.value)" /></label><br/>`;
  }
}

function renderGearTab() {
  const tab = document.getElementById('gearTab');
  tab.innerHTML = '<h3>Equipment</h3>';

  const slotContainer = document.createElement("div");
  slotContainer.id = "slotContainer";

  allSlots.forEach(slot => {
    slotContainer.appendChild(createGearSlotElement(slot));
  });

  tab.appendChild(slotContainer);

  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Add Extra Slot";
  addBtn.onclick = () => {
    const newSlot = prompt("Enter name for extra slot:", "Extra Slot");
    if (newSlot) {
      allSlots.push(newSlot);
      const container = document.getElementById("slotContainer");
      container.appendChild(createGearSlotElement(newSlot));
    }
  };
  tab.appendChild(addBtn);
}

function createGearSlotElement(slot) {
  const div = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = slot + ": ";
  const selector = document.createElement("select");
  selector.innerHTML = `<option value="">None</option>`;
  gearList.filter(item => item.slot === slot).forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.name;
    if (equipped[slot]?.id === item.id) opt.selected = true;
    selector.appendChild(opt);
  });
  selector.addEventListener("change", () => {
    if (selector.value === "") {
      delete equipped[slot];
    } else {
      const selectedItem = gearList.find(g => g.id === selector.value);
      equipped[slot] = selectedItem;
    }
    applyGearEffects();
  });
  div.appendChild(label);
  div.appendChild(selector);
  return div;
}

function applyGearEffects() {
  hero.stats = { ...hero.baseStats };
  Object.values(equipped).forEach(item => {
    for (const [stat, value] of Object.entries(item.effects)) {
      if (hero.stats[stat] !== undefined) {
        hero.stats[stat] += value;
      }
    }
  });
  updateUI();
}

window.updateStat = function(stat, value) {
  hero.stats[stat] = parseInt(value);
  updateUI();
};

window.initHero = function(className) {
  const data = heroes[className];
  hero = {
    name: className,
    customName: heroName,
    stats: { ...data.stats },
    baseStats: { ...data.stats }
  };
  updateUI();
};

window.updateHeroName = function(value) {
  heroName = value;
  hero.customName = value;
  updateUI();
};

function updateUI() {
  renderStatsTab();
  renderGearTab();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });
  document.getElementById("heroSelect").addEventListener("change", e => initHero(e.target.value));
  document.getElementById("heroName").addEventListener("change", e => updateHeroName(e.target.value));
  initHero("Bandido");
  showTab("statsTab");
});
