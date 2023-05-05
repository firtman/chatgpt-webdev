import Router from './Router.js';
import { Cooking } from './Cooking.js';

window.app = {}
app.router = Router;
app.cooking = Cooking;
app.recipes = [];

window.addEventListener("DOMContentLoaded", () => {
    app.router.init();
    app.cooking.init(document.querySelector("#cooking"));
    loadRecipes();    
});

app.recipeAI = async () => {
    const ingredients = document.getElementById("ingredients");
    const value = ingredients.value;
    ingredients.disabled = true;
    ingredients.value = "🤖 Our AI Chef is working...";
    const response = await fetch("http://localhost:3000/api/recipe", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"ingredients": value })
    })
    const jsonResponse = await response.json(); 
    const recipe = JSON.parse(jsonResponse.content);
    console.log(recipe);
    if (recipe!=false) {
        app.recipes.push(recipe);
        const responseImg = await fetch("http://localhost:3000/api/image", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"prompt": `A high-quality photograph of the meal ${recipe.name}: ${recipe.description}` })
        })
        const jsonImage = await responseImg.json(); 
        recipe.image = jsonImage.url;
        const div = document.createElement("div");
        document.getElementById("ai-recipe").appendChild(div);
        renderRecipe(div, recipe, "large");
    } else {
        alert("Ingredients aren't valid")
    }
    ingredients.value = "";
    ingredients.disabled = false;
}

export async function alertTimerFinished(timer) {
    console.log(`Timer finished: ${timer.name}`);

}
async function loadRecipes() {
    const response = await fetch("/data/recipes.json");
    app.recipes = await response.json();
    renderRecipes();
}

function renderRecipes() {
    renderRecipe(document.querySelector("#recipe-week"), app.recipes[0], "large");
    renderRecipe(document.querySelector("#recipe-most"), app.recipes[1], "large");
    const theRest = app.recipes.slice(2);
    document.querySelector("#all ul").innerHTML = "";
    theRest.forEach(r => {
        const li = document.createElement("li");
        document.querySelector("#all ul").appendChild(li);
        renderRecipe(li, r, "small");
    })
}

function renderRecipe(element, recipe, className) {
    element.innerHTML = `
        <a href="javascript:app.router.go('/recipe/${recipe.slug}')" class="${className} recipe">
            <img src="${recipe.image}">
            <h4>${recipe.name}</h4>
            <p class="metadata">${recipe.type} | ${Object.keys(recipe.ingredients).length} ingredients | ${recipe.duration} min</p>
        </a>
    `
}

export async function renderRecipeDetails(id) {
    if (app.recipes.length==0) {
        await loadRecipes();
    }    
    const recipe = app.recipes.filter(r=>r.slug==id)[0];
    document.querySelector("#recipe h2").textContent = recipe.name;
    document.querySelector("#recipe img").src = recipe.image;
    document.querySelector("#recipe .metadata").textContent = 
        `${Object.keys(recipe.ingredients).length} ingredients |
         ${recipe.duration} minutes | ${recipe.type}`;
    document.querySelector("#recipe .description").textContent = recipe.description;
    
    const list = document.querySelector("#recipe dl");
    list.innerHTML = "";
    for (let ingredient in recipe.ingredients) {
        list.innerHTML += `
            <dt>${ingredient}</dt><dd>${recipe.ingredients[ingredient]}</dd>
        `
    }
    document.querySelector("#recipe button").onclick = () => {
        app.cooking.start(recipe);
    }

}