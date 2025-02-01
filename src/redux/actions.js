// Action Types
export const FETCH_RECIPES = "FETCH_RECIPES";
export const FETCH_MORE_RECIPES = "FETCH_MORE_RECIPES";
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";  // Corrected this to be used
export const FETCH_RECIPES_ERROR = "FETCH_RECIPES_ERROR";
export const FETCH_RECIPES_REQUEST = "FETCH_RECIPES_REQUEST"; // New action for loading state
export const ADD_FAVORITE = "ADD_FAVORITE";  // Added ADD_FAVORITE action type
export const REMOVE_FAVORITE = "REMOVE_FAVORITE";  // Added REMOVE_FAVORITE action type

// Replace with your actual Edamam app_id and app_key
const app_id = "5a11feca";
const app_key = "2f5442748ef1c28702dde01ae0d97dd4";

// Retry function with increased delay
const retryRequest = async (url, retries = 50, delay = 2000) => {
  let attempt = 0;
  while (attempt < retries) {
    const response = await fetch(url);
    if (response.status !== 429) {
      return response;
    }
    attempt++;
    console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retry
  }
  throw new Error("Failed to fetch after multiple retries");
};

// Fetch Recipes Action with retry mechanism
export const fetchRecipes = (query, page = 0, loadMore = false) => async (dispatch) => {
  dispatch({ type: FETCH_RECIPES_REQUEST });

  // Ensure page is a valid number and calculate 'from' and 'to' correctly
  const pageNumber = Number.isInteger(page) ? page : 0;
  const from = pageNumber * 20;
  const to = from + 20;

  // Check if  are valid numbers
  if (isNaN(from) || isNaN(to)) {
    dispatch({ type: FETCH_RECIPES_ERROR, payload: "'from' or 'to' is invalid" });
    return;
  }

  const url = `https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}&from=${from}&to=${to}`;

  try {
    const response = await retryRequest(url);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`API Error: ${response.statusText} (${response.status}) - ${errorMessage}`);
    }

    const data = await response.json();

    if (data && data.hits.length > 0) {
      dispatch({
        type: loadMore ? FETCH_MORE_RECIPES : FETCH_RECIPES,
        payload: data.hits.map(hit => hit.recipe),
      });
    } else {
      dispatch({ type: FETCH_RECIPES_ERROR, payload: "No recipes found" });
    }
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    dispatch({ type: FETCH_RECIPES_ERROR, payload: error.message });
  }
};

// Toggle Favorite Action
export const toggleFavorite = (recipe) => {
  return (dispatch, getState) => {
    const { favorites } = getState();
    const isFavorited = favorites.some((fav) => fav.label === recipe.label);

    if (isFavorited) {
      // Remove the recipe from favorites
      dispatch({
        type: REMOVE_FAVORITE,
        payload: recipe,
      });
    } else {
      // Add the recipe to favorites
      dispatch({
        type: ADD_FAVORITE,
        payload: recipe,
      });
    }
  };
};
