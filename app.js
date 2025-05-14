import { heroes } from './heroes.js';
import { gearList } from './gear.js';

let hero = {};
let heroName = "Outlaw Joe";
let inventory = [...gearList];
let equipped = {};

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
  const slots = ["Head", "Torso", "Feet"];
  slots.forEach(slot => {
    const div = document.createElement('div');
    const item = equipped[slot];
    div.innerHTML = `<strong>${slot}:</strong> ${item ? item.name : 'Empty'}`;
    if (item) {
      const unequip = document.createElement('button');
      unequip.textContent = "Unequip";
      unequip.onclick = ((slotName) => () => {
        inventory.push(equipped[slotName]);
        delete equipped[slotName];
        applyGearEffects();
        updateUI();
      })(slot);
      div.appendChild(unequip);
    }
    tab.appendChild(div);
  });

  tab.innerHTML += '<h3>Inventory</h3>';
  inventory.forEach((item, index) => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${item.name}</strong> (${item.slot})`;
    const btn = document.createElement('button');
    btn.textContent = "Equip";
    btn.onclick = () => {
      if (equipped[item.slot]) inventory.push(equipped[item.slot]);
      equipped[item.slot] = item;
      inventory.splice(index, 1);
      applyGearEffects();
    };
    div.appendChild(btn);
    tab.appendChild(div);
  });
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
