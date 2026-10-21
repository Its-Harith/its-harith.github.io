/*
  BIGGER IDEA
  The bigger project is a cookbook app/website where you can browse recipes.
  I built one feature of it: you choose your ingredients, and depending on
  what you have, this small built-in game shows which recipe you can make.
  A lot of people get confused about what to cook with the ingredients they
  have, so this helps them. I left out browsing recipes, user accounts and
  saving favourites, because the brief asks for one focused interaction. In
  the full app this would be a "what can I cook?" tool.
*/

/*
  STYLE AND CONTEXT
  The fridge is on the right, with boxes that act as drawers, so the
  ingredients are sorted into sections and easy to find, like a
  well-organised fridge. On the left is a stove with a pot on top. I kept
  the design simple because everyone has a fridge and a stove at home, so it
  feels familiar and works straight away. I chose warm, playful colours to
  make cooking feel friendly. A short instruction line tells first-time
  users what to do. Feedback is built in: the pot glows when you drag over
  it, the soup rises as you add ingredients, and the Cook button shows a result.
*/

// ---------- ELEMENTS ----------
const pot = document.querySelector("#pot");
const soup = document.querySelector("#soup");
const dishName = document.querySelector("#dish-name");
const potList = document.querySelector("#pot-list");
const cookButton = document.querySelector("#cook");
const clearButton = document.querySelector("#clear");
const ingredients = document.querySelectorAll(".ingredient");

/*
  DATA
  Each ingredient has a colour, and the soup takes the colour of whichever
  ingredient there is most of, so the player can see what they are making.
  The recipes list is the "recipe book": a recipe matches when the pot has
  everything it needs, and extra ingredients are allowed. More recipes can be
  added by adding one line, which makes it easy to grow in a bigger project.
*/
const colours = {
  halloumi: "#f4ecd0", brie: "#f3eacb", yoghurt: "#fdfdf8",
  broccoli: "#4f8f3a", capsicum: "#d93a2b", cucumber: "#8fbf6a",
  lettuce: "#a7d17a", eggplant: "#5b3a6e", pumpkin: "#e8892b",
  orange: "#f59a23", grapes: "#7a4a9a", blueberry: "#4a5fa8",
  pineapple: "#f2cf4a", avocado: "#8fb04a",
  shrimp: "#f4a58a", sausage: "#b5654a", lamb: "#9c4a3a",
  rice: "#f5f0e1", bread: "#d9a860", pasta: "#f1d98a",
  honey: "#e7a82a", peanut: "#c99a62",
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
  { name: "Fried rice", needs: ["rice", "egg"] },
  { name: "Shrimp pasta", needs: ["shrimp", "pasta"] },
  { name: "Greek salad", needs: ["cucumber", "feta", "tomato"] },
  { name: "Cheese toastie", needs: ["bread", "cheddar"] },
  { name: "Honey yoghurt bowl", needs: ["yoghurt", "honey", "blueberry"] },
  { name: "Fresh pasta dough", needs: ["flour", "egg"] },
  { name: "Omelette", needs: ["egg", "cheddar"] },
  { name: "Tomato soup", needs: ["tomato", "onion", "garlic"] },
  { name: "Pancakes", needs: ["flour", "egg", "milk"] },
  { name: "Chicken soup", needs: ["chicken", "carrot", "onion"] },
  { name: "Mashed potato", needs: ["potato", "butter", "milk"] },
  { name: "Caprese", needs: ["tomato", "mozzarella", "basil"] }
];

const counts = {};
let total = 0;
let copy = null;
let dragged = null;

// ---------- HELPERS ----------
/*
  This checks whether the pointer is inside the pot's box on the screen. It
  is used both for the glow while dragging and for deciding whether a drop
  counts, so the feedback always matches what will really happen.
*/
function isOverPot(event) {
  const box = pot.getBoundingClientRect();
  return event.clientX >= box.left && event.clientX <= box.right &&
         event.clientY >= box.top && event.clientY <= box.bottom;
}

function updatePot() {
  soup.style.height = Math.min(total * 12, 100) + "%";

  let main = null;
  for (const name in counts) {
    if (main === null || counts[name] > counts[main]) {
      main = name;
    }
  }

  soup.style.background = colours[main];
  dishName.textContent = "Ready to cook?";
}

/*
  MAKING A NAME
  Only a few recipes are written by hand, but I wanted every mix to give a
  result, so players are never told they were wrong. This builds a name from
  the first two ingredients and a style word, like "Tomato & Cheddar Bake".
  In a bigger project this could be replaced by a much larger recipe database.
*/
const styles = ["Stew", "Bake", "Soup", "Salad", "Fry-up", "Pie", "Curry", "Hash"];

function makeName() {
  const names = Object.keys(counts);
  const pretty = names.map(function (n) {
    return n.charAt(0).toUpperCase() + n.slice(1);
  });
  const style = styles[names.join("").length % styles.length];
  if (pretty.length === 1) return pretty[0] + " " + style;
  return pretty[0] + " & " + pretty[1] + " " + style;
}

/*
  PICK UP
  When you press on an ingredient, a copy is made and follows the pointer.
  The original stays in the fridge, so the drawer never looks empty and the
  player can use the same ingredient again.
*/
ingredients.forEach(function (item) {
  item.addEventListener("pointerdown", function (event) {
    event.preventDefault();
    dragged = item.dataset.name;

    copy = item.cloneNode(true);
    copy.classList.add("dragging");
    document.body.appendChild(copy);

    copy.style.left = event.clientX + "px";
    copy.style.top = event.clientY + "px";
  });
});

/*
  DRAG
  The copy follows the pointer. The pot glows to show the player that an
  interaction is happening and that the item can be dropped there. I used
  pointer events instead of mouse events so it also works on touch screens.
*/
document.addEventListener("pointermove", function (event) {
  if (!copy) return;

  copy.style.left = event.clientX + "px";
  copy.style.top = event.clientY + "px";

  pot.classList.toggle("over-pot", isOverPot(event));
});

/*
  DROP
  If you drop over the pot, the ingredient is added to the pot list, so the
  player can see everything they have put in. If you drop outside the pot,
  nothing happens: the item disappears and you can grab another one.
*/
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

/*
  COOK
  Pressing Cook checks the pot against the recipe list. If a recipe matches,
  its name is shown. If nothing matches, a made-up name is shown instead. An
  empty pot gets a gentle message, and the Empty pot button resets everything
  so the player can start again quickly.
*/
cookButton.addEventListener("click", function () {
  if (total === 0) {
    dishName.textContent = "Add something first";
    return;
  }

  let result = makeName();

  recipes.forEach(function (recipe) {
    const hasAll = recipe.needs.every(function (n) {
      return counts[n];
    });
    if (hasAll) {
      result = recipe.name;
    }
  });

  dishName.textContent = result;
});

clearButton.addEventListener("click", function () {
  for (const name in counts) {
    delete counts[name];
  }
  total = 0;
  potList.innerHTML = "";
  soup.style.height = "0%";
  dishName.textContent = "Empty pot";
});


/*
  LIMITATIONS
  The made-up dish names are not accurate. They are generated from the first
  two ingredients and a random style word, so some results do not make
  culinary sense. Only a few recipes are real. A bigger project would use a
  proper recipe database to give accurate results.
*/

/*
  REFLECTION
  Benefits: in a bigger cookbook app, this would help people who are unsure
  what to cook, and it makes browsing feel like a game. The drag interaction
  is familiar and quick, and the same code could work for any list of recipes.
  Challenges: a real app would have hundreds of ingredients, so the drawers
  would need search or filters. The pot would need to work well on small
  phone screens, and recipes would need to be saved and loaded from a
  database. Suggesting recipes before pressing Cook is a next step.

  SOURCES
  Inspiration: Infinite Craft (neal.fun/infinite-craft), Little Alchemy 2 and
  Trello for dragging and combining. MDN Web Docs for pointer events and
  getBoundingClientRect. The ingredient icons are emoji, which are system
  text, so no image licences are needed. I used AI to help write parts of the code and comments.
*/