let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Palo"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'Palo', power: 5 },
  { name: 'Daga', power: 30 },
  { name: 'Martillo de hierro', power: 50 },
  { name: 'Espada', power: 100 }
];
const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15
  },
  {
    name: "Bestia con colmillos",
    level: 8,
    health: 60
  },
  {
    name: "Dragon",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "Plaza del pueblo",
    "button text": ["Ir a la tienda", "Ir a la cueva", "Luchar contra el Dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Estas en la plaza del pueblo. Ves un letrero que dice \"Tienda\"."
  },
  {
    name: "Tienda",
    "button text": ["Comprar 10 de vida (10 oro)", "Comprar arma (30 oro)", "Ir a la plaza del pueblo"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Entraste a la tienda."
  },
  {
    name: "Cueva",
    "button text": ["Luchar con el slime", "Luchar contra la bestia con colmillos", "Ir a la plaza del pueblo"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Entraste a la cueva. Ves algunos monstruos."
  },
  {
    name: "Luchar",
    "button text": ["Atacar", "Esquivar", "Correr"],
    "button functions": [attack, dodge, goTown],
    text: "Estas luchando contra un monstruo."
  },
  {
    name: "Matar Monstruo",
    "button text": ["Ir a la plaza del pueblo", "Ir a la plaza del pueblo", "Ir a la plaza del pueblo"],
    "button functions": [goTown, goTown, goTown],
    text: 'El monstruo grita "¡Arg!" mientras muere. Obtienes puntos de experiencia y encuentras oro.'
  },
  {
    name: "Perdiste",
    "button text": ["Repetir?", "Repetir?", "Repetir?"],
    "button functions": [restart, restart, restart],
    text: "Moriste. &#x2620;"
  },
  { 
    name: "Ganaste", 
    "button text": ["Repetir?", "Repetir?", "Repetir?"], 
    "button functions": [restart, restart, restart], 
    text: "¡Derrotaste al dragón! ¡GANAS EL JUEGO! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Ir a la plaza del pueblo?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Encontraste un juego secreto. Elije un número arriba. Se elegirán aleatoriamente diez números entre 0 y 10. Si el número que elijas coincide con uno de los números aleatorios, ¡ganarás!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "No tienes suficiente oro para comprar salud.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Ahora tienes un " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " En tu inventario tienes: " + inventory;
    } else {
      text.innerText = "No tienes suficiente oro para comprar un arma.";
    }
  } else {
    text.innerText = "¡Ya tienes el arma más poderosa!";
    button2.innerText = "Vender arma por 15 de oro.";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Vendiste un " + currentWeapon + ".";
    text.innerText += " En tu inventario tienes: " + inventory;
  } else {
    text.innerText = "No vendas tú unica arma!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "El " + monsters[fighting].name + " Ataca.";
  text.innerText += " Lo atacas con tu " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Perdiste.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Tu " + inventory.pop() + " se rompió.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Esquivas el ataque del " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Palo"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Elegiste " + guess + ". Aquí están los números aleatorios.:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "¡Bien! ¡Ganas 20 de oro!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "¡Equivocado! Pierdes 10 de salud!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
