// FETCH FUNCTIONS
async function fetchData(type) {
    const r = await fetch("http://localhost:5678/api/" + type);
    const data = await r.json();
    return data;
}
async function fetchWorks() { return await fetchData('works'); }
async function fetchCategories() { return await fetchData('categories'); }


// GALLERY
// build gallery at window's loading 
window.addEventListener("DOMContentLoaded", () => buildGallery(fetchWorks()));

// build gallery with a works array for argument
async function buildGallery(array) {
    let works = await array;
    //remove old gallery
    const oldGallery = document.querySelector('.gallery');
    oldGallery.remove();
    // build new gallery
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');
    // build a work for every works array element
    for(work of works) {
        const figure = document.createElement("figure");
        figure.classList.add('work');

        const img = document.createElement("img");
        img.setAttribute("src", work.imageUrl);
        img.setAttribute("alt", work.title);

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }

    const galleryContainer = document.querySelector(".gallery-container");
    galleryContainer.appendChild(gallery);
}

//FILTERS 
// build filters buttons at window's loading
window.addEventListener("DOMContentLoaded", buildFilters());

// build filters buttons for the gallery from API categories
async function buildFilters() {
    const categories = await fetchCategories();
    for(categorie of categories) {
        const filters = document.querySelector(".filters");
        const filter = document.createElement("button");
        filter.classList.add(categorie.id);
        filter.innerText = categorie.name;
        filter.addEventListener("click", applyFilter);
        filters.appendChild(filter);
    }
}

// function to manage filter mehod in async function
async function filterAsync (array, filterFunction) {
    const boolArray = await Promise.all(array.map(filterFunction));
    const arrayFiltered = array.filter((value, index) => boolArray[index]);
    return arrayFiltered;
}

// use filter method on works array from API and then rebuild gallery with new array
async function applyFilter(e) {
    const filterId = await e.target.getAttribute('class');
    let works = await fetchWorks();
    const filterWorks = async (work) => {return work.categoryId == filterId}; 
    worksFiltered = await filterAsync(works, filterWorks);
    buildGallery(worksFiltered);
}

// re-build the full gallery buy clicking on the showAllBtn
const showAllBtn = document.querySelector('.show-all-btn');
showAllBtn.addEventListener('click', () => buildGallery(fetchWorks()));


console.log(localStorage.getItem('token'));








