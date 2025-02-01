import { FETCH_RECIPES, FETCH_MORE_RECIPES, FETCH_RECIPES_ERROR, FETCH_RECIPES_REQUEST, ADD_FAVORITE, REMOVE_FAVORITE } from "./actions";

const initialState = {
  recipes: [],
  favorites: [],
  loading: false,
  error: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RECIPES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_RECIPES:
      return { ...state, recipes: action.payload, loading: false, error: null };

    case FETCH_MORE_RECIPES:
      return { ...state, recipes: [...state.recipes, ...action.payload], loading: false };

    case FETCH_RECIPES_ERROR:
      return { ...state, error: action.payload, loading: false };

    case ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.label !== action.payload.label),
      };

    default:
      return state;
  }
};

export default rootReducer;
