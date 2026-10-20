/*
  BIGGER IDEA
  Recipe Mixer is one interaction from a larger [cooking app / cooking game]
  where players [what the whole thing does, 1-2 sentences].

  MY SCOPE
  This prototype only covers [dragging ingredients into the pot and the
  recipe changing]. I'm not building [accounts, recipe database, multiple pages].

  HOW IT FITS
  In the full project, this would be [the main screen / the first step / the
  core mechanic] that [what happens before and after it].
*/
// ---------- ELEMENTS ----------
const pot = document.querySelector("#pot");
const soup = document.querySelector("#soup");
const dishName = document.querySelector("#dish-name");
const potList = document.querySelector("#pot-list");
const cookButton = document.querySelector("#cook");
const clearButton = document.querySelector("#clear");
const ingredients = document.querySelectorAll(".ingredient");

// ---------- DATA ----------
const colours = {
  cheddar: "#f6c344", mozzarella: "#f5efe0", parmesan: "#f0dca0", feta: "#f2f2ec",
  milk: "#fbfbf7", cream: "#f6ecd2", butter: "#f7dc6f", egg: "#f5d76e",
  tomato: "#e4572e", carrot: "#f08a24", mushroom: "#a88b73", onion: "#e8d3a5",
  potato: "#d9b982", corn: "#f4cf3e",
  apple: "#c9d860", banana: "#f3e27a", lemon: "#f7e24a", strawberry: "#e8506b",
  chicken: "#e2b98a", beef: "#a5523f", bacon: "#c46a4a", salmon: "#f0866b",
  chilli: "#c8281e", garlic: "#efe6cc", basil: "#5f9a3e", salt: "#e8e8e8",
  flour: "#f3ead3"
};

const recipes = [
  { name: "Fresh pasta dough", needs: ["flour", "egg"] },
  { name: "Tomato soup", needs: ["tomato", "onion", "garlic"] },
  { name: "Omelette", needs: ["egg", "cheddar"] }
];

const counts = {};
let total = 0;
let copy = null;
let dragged = null;

// ---------- HELPERS ----------
function isOverPot(event) {
  const box = pot.getBoundingClientRect();
  return event.clientX >= box.left && event.clientX <= box.right &&
         event.clientY >= box.top && event.clientY <= box.bottom;
}

function updatePot() {
  soup.style.height = Math.min(total * 12, 100) + "%";

  let main = null;
  for (const name in counts) {
    // BLANK A: if main is null OR counts[name] > counts[main], then main = name
  }

  soup.style.background = colours[main];
  dishName.textContent = "Ready to cook?";
}

// ---------- PICK UP ----------
ingredients.forEach(function (item) {
  item.addEventListener("pointerdown", function (event) {
    dragged = item.dataset.name;

    copy = item.cloneNode(true);
    copy.classList.add("dragging");
    document.body.appendChild(copy);

    copy.style.left = event.clientX + "px";
    copy.style.top = event.clientY + "px";
  });
});

// ---------- DRAG ----------
document.addEventListener("pointermove", function (event) {
  if (!copy) return;

  copy.style.left = event.clientX + "px";
  copy.style.top = event.clientY + "px";

  pot.classList.toggle("over-pot", isOverPot(event));
});

// ---------- DROP ----------
document.addEventListener("pointerup", function (event) {
  if (!copy) return;

  if (isOverPot(event)) {
    counts[dragged] = (counts[dragged] || 0) + 1;
    total = total + 1;

    const li = document.createElement("li");
    li.textContent = copy.textContent;
    potList.appendChild(li);

    updatePot();
  }

  copy.remove();
  copy = null;
  pot.classList.remove("over-pot");
});

// ---------- COOK ----------
cookButton.addEventListener("click", function () {
  if (total === 0) {
    dishName.textContent = "Add something first";
    return;
  }

  let result = "Mystery stew";

  recipes.forEach(function (recipe) {
    // BLANK B: if every name in recipe.needs is in counts, set result = recipe.name
    // hint: recipe.needs.every(function (n) { return counts[n]; })
  });

  dishName.textContent = result;
});

// ---------- EMPTY THE POT ----------
clearButton.addEventListener("click", function () {
  // BLANK C: delete everything from counts (for...in loop with delete counts[name]),
  //          then total = 0, potList.innerHTML = "", soup.style.height = "0%"
  // BLANK D: dishName.textContent = "Empty pot"
});

