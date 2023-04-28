// FETCH FUNCTIONS
async function fetchData(type) {
    const r = await fetch("http://localhost:5678/api/" + type);
    const data = await r.json();
    return data;
}
async function fetchWorks() { return await fetchData('works'); }

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








