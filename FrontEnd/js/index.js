// IMPORTS AND EXPORTS
import {apiGetWorks, apiGetCategories} from './fetch.js';
const token = localStorage.getItem('token');
// GALLERY
// build gallery from a works array
export const buildGallery = async (array) => {
    const works = await array;

    //clear gallery
    const gallery = document.querySelector('.portfolio__gallery');
    gallery.innerHTML= "";

    // build a work for each element in the array
    for(const work of works) {

        const figure = document.createElement("figure");
        figure.classList.add('work');
        figure.setAttribute('id', 'work-' + work.id);

        const img = document.createElement("img");
        img.setAttribute("src", work.imageUrl);
        img.setAttribute("alt", work.title);

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

// build gallery from API works
buildGallery(apiGetWorks());

//FILTERS
const filters = document.querySelector('.portfolio__filters');

// build filters buttons from API categories
const buildFilters = async () => {
    const categories = await apiGetCategories();

    for(const category of categories) {
        const filter = document.createElement("button");
        filter.setAttribute('id', category.id);
        filter.classList.add('btn');
        filter.classList.add('btn--unfilled'); 
        filter.classList.add('btn--animated');      
        filter.innerText = category.name;
        filter.addEventListener("click", applyFilter);
        filters.appendChild(filter);
    }
}
buildFilters();

// use filter method on works array from API and then rebuild gallery with new array
const applyFilter = async (e) => {
    const filterId = await e.target.getAttribute('id');
    let works = await apiGetWorks();
    const filterWorks = async (work) => {return work.categoryId == filterId};    
    const boolArray = await Promise.all(works.map(filterWorks));
    const arrayFiltered = works.filter((value, index) => boolArray[index]);
    buildGallery(arrayFiltered);
    console.log(boolArray);
    console.log(arrayFiltered);    
}

// re-build the full gallery buy clicking on the showAllBtn
const showAllBtn = document.querySelector('.btn--show-all');
showAllBtn.addEventListener('click', () => buildGallery(apiGetWorks()));

// EDIT MODE 

// if the token is set in the localStorage, show the edit mode
const editBanner = document.querySelector('.edit-mode__banner');

if (token != null) {
    editBanner.classList.remove('display-none');
    
    const login = document.querySelector('.login-link');
    login.classList.add('display-none');
    const logout = document.querySelector('.logout-link');
    logout.classList.remove('display-none');
    const body = document.querySelector('body');
    body.setAttribute('style', 'margin-top:100px;');


}

const editModeBtn = document.querySelector('.edit-mode__btn');
editModeBtn.addEventListener('click', () => {
    document.querySelectorAll('.edit-mode').forEach((element) => {
        element.classList.toggle('display-none');
    })
    filters.classList.toggle('display-none');
})

// LOGOUT
const logout = document.querySelector('.logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    window.localStorage.removeItem('token');
    location.href="./index.html";
})








