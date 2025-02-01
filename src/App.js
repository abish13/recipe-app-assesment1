import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes, toggleFavorite } from "./redux/actions";
import "./App.css";
// State variables for search, diet type, category, pagination, and UI settings
const App = () => {
  const [search, setSearch] = useState("vegetarian");
 
  const [diet, setDiet] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes); //List of recipes from the store
  const favorites = useSelector((state) => state.favorites);// List of favorite recipes
  const loading = useSelector((state) => state.loading);// Loading state
  const error = useSelector((state) => state.error);


 // Fetch recipes whenever search filter
  useEffect(() => {
   
    const query = `${search}+${diet}+${category}`;// Combine search parameters into a query string
    dispatch(fetchRecipes(query, page));
  }, [dispatch, search, diet, category, page]);

    // Load more recipes when clicking the "Load More" button
  const loadMoreRecipes = () => {
    const nextPage = page + 1;//Increment page number
    setPage(nextPage);
    dispatch(fetchRecipes(search, nextPage, true));// Fetch next set of recipes
  };


// Opens the recipe details in a modal when clicked
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };// Closes the recipe modal
  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🍽️ Recipe App</h1>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="search-container">
          <input type="text" placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        
          <select value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="all">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="vegan">Vegan</option>
            <option value="keto">Keto</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
          <button onClick={() => dispatch(fetchRecipes(search, 0))}>🔍 Search</button>
        </div>
      </header>

      {loading && <p>Loading recipes...</p>}
      {error && <p className="error">{error}</p>}

      <h2>Recipes</h2>
      <div className="recipes">
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <img src={recipe.image} alt={recipe.label} className="recipe-img" />
              <h3>{recipe.label}</h3>
              <p>Category: {recipe.category}</p>
              <button onClick={() => handleRecipeClick(recipe)}>👀 View Recipe</button>
              <button className={`favorite-btn ${favorites.some((fav) => fav.label === recipe.label) ? "favorited" : ""}`} onClick={() => dispatch(toggleFavorite(recipe))}>
                {favorites.some((fav) => fav.label === recipe.label) ? "❤️ Remove" : "🤍 Add to Favorites"}
              </button>
            </div>
          ))
        ) : (
          
          <p>No recipes found. Try a different search! ❌</p>
        )}
      </div>

     
      <button className="load-more" onClick={loadMoreRecipes}>⬇️ Load More Recipes</button>
      {selectedRecipe && (
        <div className="recipe-modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>×</button>
            <h2>{selectedRecipe.label}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.label} className="recipe-img-large" />
            <p><strong>Category:</strong> {selectedRecipe.category}</p>
            <p><strong>Ingredients:</strong></p>
            <ul>
              {selectedRecipe.ingredientLines.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <footer className="footer">
        <h3>Vegetables You Should Try</h3>
        <div className="footer-content">
          <div className="vegetable-image">
            <img src="https://images.healthshots.com/healthshots/en/uploads/2024/05/15135824/vegetables-for-breakfast-1-1.jpg" alt="Vegetables" />
          </div>
          <div className="vegetables-list">
            <ul>
              <li>1. Carrot</li>
              <li>2. Broccoli</li>
              <li>3. Spinach</li>
              <li>4. Kale</li>
              <li>5. Peas</li>
              <li>6. Sweet Potato</li>
              <li>7. Cauliflower</li>
            </ul>
          </div>
        </div>
        <div className="footer-text">
          <p>Food is an essential part of life, providing both energy and joy. A balanced diet can enhance health and wellbeing. Explore our delicious recipes with vegetables, fruits, and non-veg items!</p>
        </div>
        <div className="footer-content">
          <div className="food-section">
            <h4>Vegetables</h4>
            <div className="food-item">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaVSaCcQy85soS7b-9Jhm9tRMf5B_U79SduQ&s" alt="Vegetables" />
              <button>Explore Vegetables</button>
            </div>
          </div>
          <div className="food-section">
            <h4>Fruits</h4>
            <div className="food-item">
              <img src="https://static.wixstatic.com/media/94982f_73eec411af7e4741878203285170b353~mv2.jpg/v1/fill/w_280,h_280,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/94982f_73eec411af7e4741878203285170b353~mv2.jpg" alt="Fruits" />
              <button>Explore Fruits</button>
            </div>
          </div>
          <div className="food-section">
            <h4>Non-Veg</h4>
            <div className="food-item">
              <img src="https://www.foodnetwork.com/content/dam/images/food/fullset/2011/11/23/0/FN_perfect-chicken-014_s4x3.jpg" alt="Non-Veg" />
              <button>Explore Non-Veg</button>
            </div>
          </div>
        </div>
       
         <br></br>
         <footer>
         <div className="company-logos">
          <h3>You are in good company</h3>
          <div className="logos-wrapper">
            <div className="logos">
           
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/amazon.png"class="q1" alt="Company 1" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/barilla.png"class="q1" alt="Company 2" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/microsoft.png"class="q1" alt="Company 3" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/food.png"class="q1" alt="Company 4" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/nestle.png" class="q1"alt="Company 5" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/nestle.png"class="q1" alt="Company 5" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/spoon.png" class="q1"alt="Company 6" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/core.png"class="q1" alt="Company 7" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/suggestic.png"class="q1" alt="Company 9" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/suggestic.png" class="q1"alt="Company 10" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/dailymeal.png"class="q1" alt="Company 11" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/virta.png"class="q1" alt="Company 12" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/nestle.png"class="q1" alt="Company 13" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/kitchen.png" class="q1"alt="Company 14" />
              <img src="https://www.edamam.com/assets/img/v.2.0/partners/nyt.png"class="q1" alt="Company 15" />
            </div>
          </div>
          </div>
          </footer>
      </footer>
      <div>
        <br></br>
      <footer class="foter">
        <div className="f1">
         
          <div className="ff1">
            <h4>Recipe Search</h4>
            <h4>Nutrition Wizard</h4>
          </div>

      
          <div className="ff1">
            <h4>APIs</h4>
            <ul>
              <li>Nutrition Analysis API</li>
              <li>Food Database API</li>
              <li>Recipe Search API</li>
            </ul>
          </div>

         
          <div className="ff1">
            <h4>FAQ</h4>
            <h4>Try Products</h4>
            <h4>Nutrition Wizard</h4>
            <h4>Recipe Search</h4>
            <h4>Food Search</h4>
          </div>

       
          <div className="ff1">
            <h4>Follow us</h4>
            <div className="social-icons">
              <a href="#" className="social-icon">Facebook</a>
              <a href="#" className="social-icon">Twitter</a>
              <a href="#" className="social-icon">LinkedIn</a>
              <a href="#" className="social-icon">Pinterest</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Your Company Name. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
    </div>
    
  );
};

export default App;
