
import { gearList } from './gear.js';

let inventory = [...gearList];
let equipped = {};

function renderGearTab() {
  const tab = document.getElementById('gearTab');
  tab.innerHTML = '<h3>Equipment Slots</h3>';
  const slots = ["Head", "Torso", "Hands", "Feet", "Face", "Shoulders", "Coat", "Pants", "Gloves"];
  slots.forEach(slot => {
    const div = document.createElement('div');
    const item = equipped[slot];
    div.innerHTML = `<strong>${slot}:</strong> ${item ? item.name : 'Empty'}`;
    if (item) {
      const unequip = document.createElement('button');
      unequip.textContent = "Unequip";
      unequip.onclick = () => {
        inventory.push(item);
        delete equipped[slot];
        applyGearEffects();
      };
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
