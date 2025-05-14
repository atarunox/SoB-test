import { heroes } from './heroes.js';

let hero = {};
let heroName = "Outlaw Joe";

let conditions = {
  Mutations: [],
  Injuries: [],
  Madness: []
};

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

function renderConditionsTab() {
  const tab = document.getElementById('conditionsTab');
  tab.innerHTML = '';

  Object.entries(conditions).forEach(([type, list]) => {
    const section = document.createElement('div');
    section.innerHTML = `<h3 style="color: ${type === 'Mutations' ? 'green' : type === 'Injuries' ? 'red' : 'blue'}">${type}</h3>`;

    list.forEach((cond, index) => {
      const entry = document.createElement('div');
      entry.textContent = cond;
      entry.style.marginLeft = "1em";
      const remove = document.createElement('button');
      remove.textContent = "Remove";
      remove.onclick = () => {
        list.splice(index, 1);
        renderConditionsTab();
      };
      entry.appendChild(remove);
      section.appendChild(entry);
    });

    const add = document.createElement('button');
    add.textContent = `+ Add ${type}`;
    add.onclick = () => {
      const result = prompt(`Enter ${type} condition name:`);
      if (result) {
        list.push(result);
        renderConditionsTab();
      }
    };

    section.appendChild(add);
    tab.appendChild(section);
  });
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
  renderConditionsTab();
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
