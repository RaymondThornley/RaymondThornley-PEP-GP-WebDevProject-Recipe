/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const addIngredientSubmitInput = document.getElementById("add-ingredient-submit-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const deleteIngredientSubmitInput = document.getElementById("delete-ingredient-submit-input");
const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientSubmitInput.addEventListener("click", addIngredient);
deleteIngredientSubmitInput.addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();


/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
        const name = addIngredientNameInput.value;

        if (name.length == 0) {
            alert("Name field is blank.");
            return;
        }

        const requestBody = { name }

        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        }

    try {
        await fetch(`${BASE_URL}/ingredients`, requestOptions).then(async (response) => {
            if (response.ok) {
                addIngredientNameInput.value = "";

                await getIngredients();
            } else {
                throw new Error("Unknown Error");
            }
        });

    } catch (error) {
        console.error(error);
        alert(error);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    }

    try {
    await fetch(`${BASE_URL}/ingredients`, requestOptions).then(async (response) => {
        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            throw new Error("Unknown Error");
        }
    });

    } catch (error) {
        console.error(error);
        alert(error);
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    const name = deleteIngredientNameInput.value;

    if (name.length == 0) {
        alert("Name field is blank.");
        return;
    }

    let ingredientId = null;
    for (let i=0; i<ingredients.length; i++) {
        if (ingredients[i].name == name) {
            ingredientId = ingredients[i].id;
            break;
        }
    }

    if (ingredientId === null) {
        alert("Unable to find ingredient.");
        return;
    }

    const requestOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    }

    try {
    await fetch(`${BASE_URL}/ingredients/${ingredientId}`, requestOptions).then(async (response) => {
        if (response.ok) {
            deleteIngredientNameInput.value = "";

            await getIngredients();
        } else {
            throw new Error("Unknown Error");
        }
    });

    } catch (error) {
        console.error(error);
        alert(error);
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    while (ingredientListContainer.firstChild) {
        ingredientListContainer.removeChild(ingredientListContainer.lastChild);
    }

    for (let i=0; i<ingredients.length; i++) {
        const newListItem = document.createElement("li");
        newListItem.innerHTML = ingredients[i].name + ": " + ingredients[i].instructions;
        ingredientListContainer.appendChild(newListItem);
    }
}
