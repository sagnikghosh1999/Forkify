import { loadRecipe, state } from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable'; // for polyfilling browsers that don't support ES6 features
import 'regenerator-runtime/runtime'; // for polyfilling browsers that don't support Async features

// const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //1)Loading the recipe
    await loadRecipe(id);
    const { recipe } = state;

    // 2)Rendring the recipe
    recipeView.render(recipe);
  } catch (error) {
    alert(error);
  }
};

controlRecipes();

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipes);
// 5ed6604591c37cdc054bc886
['load', 'hashchange'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
