import {
  addBookmark,
  getSearchResultPage,
  loadRecipe,
  loadSearchResults,
  removeBookmark,
  state,
  updateServings,
} from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable'; // for polyfilling browsers that don't support ES6 features
import 'regenerator-runtime/runtime'; // for polyfilling browsers that don't support Async features
// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark selected
    resultsView.update(getSearchResultPage());

    // 1)Add bookmark to bookmarks view
    bookmarksView.update(state.bookmarks);

    //2)Loading the recipe
    await loadRecipe(id);
    const { recipe } = state;

    // 3)Rendring the recipe
    recipeView.render(recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1)Get Search Query
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    console.log(query);
    //2)Loading Search Results
    await loadSearchResults(query);

    //3)Rendering Results
    resultsView.render(getSearchResultPage(1));

    //4)Rendering Pagination
    paginationView.render(state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  //3)Rendering new Results
  resultsView.render(getSearchResultPage(goToPage));

  //4)Rendering new Pagination
  paginationView.render(state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  updateServings(newServings);

  //update the recipe view
  // recipeView.render(state.recipe);
  recipeView.update(state.recipe);
};

const controlAddBookmark = function () {
  //1) Add or Remove the bookmark
  if (!state.recipe.bookmarked) {
    addBookmark(state.recipe);
  } else {
    removeBookmark(state.recipe.id);
  }

  //2) Update the bookmark in the recipe view
  recipeView.update(state.recipe);

  //3) Render bookmarks
  bookmarksView.render(state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(state.bookmarks);
};

const init = function () {
  recipeView.addRenderHandler(controlRecipes);
  recipeView.addUpdateServingsHandler(controlServings);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addClickhandler(controlPagination);
  recipeView.addBookmarkHandler(controlAddBookmark);
  bookmarksView.addRenderHandler(controlBookmarks);
};
init();
