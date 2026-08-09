/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const addRecipeSubmitInput = document.getElementById("add-recipe-submit-input");
    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const updateRecipeSubmitInput = document.getElementById("update-recipe-submit-input");
    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const deleteRecipeSubmitInput = document.getElementById("delete-recipe-submit-input");
    const recipeListContainer = document.getElementById("recipe-list");
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.removeAttribute("hidden");
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") == "true") {
        adminLink.removeAttribute("hidden");
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitInput.addEventListener("click", addRecipe);
    updateRecipeSubmitInput.addEventListener("click", updateRecipe);
    deleteRecipeSubmitInput.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const name = searchInput.value;

        if (name.length == 0) {
            alert("Name field is blank.");
            return;
        }

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
        await fetch(`${BASE_URL}/recipes?name=${name}`, requestOptions).then(async (response) => {
            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
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
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addRecipeNameInput.value;
        const instructions = addRecipeInstructionsInput.value;

        if (name.length == 0) {
            alert("Name field is blank.");
            return;
        }
        if (instructions.length == 0) {
            alert("Instructions field is blank.");
            return;
        }

        const requestBody = { name, instructions }

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
        await fetch(`${BASE_URL}/recipes`, requestOptions).then(async (response) => {
            if (response.ok) {
                addRecipeNameInput.value = "";
                addRecipeInstructionsInput.value = "";

                await getRecipes();
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
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateRecipeNameInput.value;
        const instructions = updateRecipeInstructionsInput.value;

        if (name.length == 0) {
            alert("Name field is blank.");
            return;
        }
        if (instructions.length == 0) {
            alert("Instructions field is blank.");
            return;
        }

        let recipeId = null;
        for (let i=0; i<recipes.length; i++) {
            if (recipes[i].name == name) {
                recipeId = recipes[i].id;
                break;
            }
        }

        if (recipeId === null) {
            alert("Unable to find recipe.");
            return;
        }

        const requestBody = { name, instructions }

        const requestOptions = {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        }

    try {
        await fetch(`${BASE_URL}/recipes/${recipeId}`, requestOptions).then(async (response) => {
            if (response.ok) {
                updateRecipeNameInput.value = "";
                updateRecipeInstructionsInput.value = "";

                await getRecipes();
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
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteRecipeNameInput.value;

        if (name.length == 0) {
            alert("Name field is blank.");
            return;
        }

        let recipeId = null;
        for (let i=0; i<recipes.length; i++) {
            if (recipes[i].name == name) {
                recipeId = recipes[i].id;
                break;
            }
        }

        if (recipeId === null) {
            alert("Unable to find recipe.");
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
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        }

    try {
        await fetch(`${BASE_URL}/recipes/${recipeId}`, requestOptions).then(async (response) => {
            if (response.ok) {
                deleteRecipeNameInput.value = "";

                await getRecipes();
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
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
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
            await fetch(`${BASE_URL}/recipes`, requestOptions).then(async (response) => {
                if (response.ok) {
                    recipes = await response.json();
                    refreshRecipeList();
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
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        while (recipeListContainer.firstChild) {
            recipeListContainer.removeChild(recipeListContainer.lastChild);
        }

        for (let i=0; i<recipes.length; i++) {
            const newListItem = document.createElement("li");
            newListItem.innerHTML = recipes[i].name + ": " + recipes[i].instructions;
            recipeListContainer.appendChild(newListItem);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
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
            referrerPolicy: "no-referrer"
        }

        try {
            await fetch(`${BASE_URL}/logout`, requestOptions).then((response) => {
                if (response.ok) {
                    sessionStorage.removeItem("auth-token");
                    sessionStorage.removeItem("is-admin");
                    window.location.href = "../login/login-page.html";
                } else {
                    throw new Error("Unknown Error");
                }
            });

        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

});
