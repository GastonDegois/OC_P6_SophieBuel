// IMPORTS
import {apiGetWorks, apiGetCategories, apiDeleteImage, apiPostImage} from './fetch.js';
import {buildGallery} from './index.js';


const modal = document.querySelector('.modal');
const modalGallery = document.querySelector('.modal-gallery-mode');
const modalForm = document.querySelector('.modal-formular-mode');

// toogle the display-none class of two elements
const toogleDisplayNone = (firstElement, secondElement) => {
    firstElement.classList.toggle('display-none');
    secondElement.classList.toggle('display-none');
}

// switch from gallery mode to formular mode or inverse 
const switchModalContent = () => {toogleDisplayNone(modalGallery, modalForm)}

//open modal
const  modalOpenBtn = document.querySelector('.modal__open-btn');
modalOpenBtn.addEventListener('click', () => modal.classList.remove('display-none'));

// close modal
const modalCloseBtn = document.querySelector('.modal__close-btn');
const closeModalListener = (toListen) => {
    toListen.addEventListener('click', () => {
        modal.classList.add("display-none");
        // if the formular mode is set when the modal gets closed then switch to gallery mode
        if (modalGallery.classList.contains('display-none')) {switchModalContent()};
    });}
closeModalListener(modalCloseBtn);
closeModalListener(modal);
const modalWrapper = document.querySelector('.modal__wrapper');
modalWrapper.addEventListener('click', (e) => {e.stopPropagation()});

// form link 
const addFormLink = document.querySelector('.modal__formular-mode-btn');
addFormLink.addEventListener('click', () => {switchModalContent()});

// gallery link
const galleryLink = document.querySelector('.modal__gallery-mode-btn');
galleryLink.addEventListener('click', () => {switchModalContent()});


// GALLERY MODE
// build modal gallery
const buildModalGallery = async () => {
    const modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML = "";
    const works = await apiGetWorks();
    for (const work of works) {
        // item
        const item = document.createElement('div');
        item.classList.add('modal-gallery__item');
        item.setAttribute('id', 'thumbnail-' + work.id);
        modalGallery.appendChild(item);
        // btn container
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('modal-gallery__btn-container');
        item.appendChild(btnContainer);
        // btn open item
        const btnOpenItem = document.createElement('button');
        btnOpenItem.classList.add('btn--small-black');
        btnOpenItem.classList.add('modal-gallery__open-item-btn');
        btnContainer.appendChild(btnOpenItem);
        const btnOpenItemIcon = document.createElement('i');
        btnOpenItemIcon.classList.add('fa-solid');
        btnOpenItemIcon.classList.add('fa-arrows-up-down-left-right');
        btnOpenItem.appendChild(btnOpenItemIcon);
        // btn remove item
        const btnRemoveItem = document.createElement('button');
        btnRemoveItem.classList.add('btn--small-black');
        btnRemoveItem.classList.add('modal-gallery__btn--remove-item');
        btnRemoveItem.setAttribute('id', work.id);
        btnRemoveItem.addEventListener('click', async () => {await deleteImage(work.id);});
        btnContainer.appendChild(btnRemoveItem);
        const btnRemoveItemIcon = document.createElement('i');
        btnRemoveItemIcon.classList.add('fa-solid');
        btnRemoveItemIcon.classList.add('fa-trash-can');
        btnRemoveItem.appendChild(btnRemoveItemIcon);
        // picture
        const img = document.createElement("img");
        img.classList.add('modal-gallery__img');
        img.setAttribute("src", work.imageUrl);
        img.setAttribute("alt", work.title);
        item.appendChild(img)
        // edit item
        const editItem = document.createElement('p');
        editItem.classList.add('modal-gallery__edit-item');
        editItem.innerText = "éditer";
        item.appendChild(editItem);
    }
}
buildModalGallery();

//delete image
const deleteImage = async (itemId) => {
    const r = await apiDeleteImage(itemId);
    // if the delete request was successful then remove the image from the galleries
    if (r.ok === true) {
        const itemToRemove = document.querySelector('#thumbnail-' + itemId);
        itemToRemove.remove();
        const workToRemove = document.querySelector('#work-' + itemId);
        workToRemove.remove();        
    }
}

// FORMULAR MODE
const imgContainer = document.querySelector('.img-container');
const imgPreviewContainer = document.querySelector('.preview-container');
const select = document.querySelector('.modal-form__categories');
const changeContainer = () => {toogleDisplayNone(imgContainer, imgPreviewContainer)};

// build select options from API categories
const buildOptions = async () => {
    const categories = await apiGetCategories();
    for (const category of categories) {
        const option = document.createElement('option');
        option.innerText = category.name;
        option.setAttribute('value', category.id);
        select.appendChild(option);
    }
}
buildOptions();

// ask if postImageBtn is ok to available
const postImageBtn = document.querySelector('.modal-form__submit-btn');
let isValidImg = false;
let isImg = false;
let isTitle = false;
let isCategory = false;

const askPostBtnAvailability = () => {
    if (isValidImg && isImg && isTitle && isCategory) {
        postImageBtn.classList.remove('unavailable');
        postImageBtn.classList.add('btn--animated');
    } else {
        postImageBtn.classList.add('unavailable');
        postImageBtn.classList.remove('btn--animated');
    }
}

// function to ask if there is a value in an input
const isValue = (value, element) => {
    const errorMessage = document.querySelector(`.${element}-error-message`);
    // const input = document.querySelector(`.modal-form__${element}`);
    errorMessage.innerText = "";
    if (value === "") {
        errorMessage.innerText = eval(element + 'ErrorMessage');
        return false;
    }
    else {
        return true;
    }
}

// img error message
const imgInput = document.querySelector('.img-container__input');
const imgErrorMessage = 'Il faut une image à votre projet.';
imgInput.addEventListener("input", (e) => {
    const value = e.target.value;
    if (isValue(value, 'img')) {isImg = true}
    else (isImg = false);
    askPostBtnAvailability();
}
);

// title error message
const titleInput = document.querySelector('.modal-form__title');
const titleErrorMessage = 'Il faut un titre à votre projet.';
titleInput.addEventListener("input", (e) => {
    const value = e.target.value;
    if (isValue(value, 'title')) {isTitle = true}
    else (isTitle = false);
    askPostBtnAvailability();
});

// category error message
const categoryInput = document.querySelector('.modal-form__categories');
const categoryErrorMessage = 'Il faut une catégorie à votre projet.';
categoryInput.addEventListener("change", (e) => {
    const value = e.target.value;
    if (isValue(value, 'category')) {isCategory = true}
    else (isCategory = false);
    askPostBtnAvailability();});

// when user choose an img, test it's size
imgInput.addEventListener('change', (e) => {    
    const file = imgInput.files[0];
    // if its to big, print the error message
    if (file.size > 30000000) {
        imgErrorMessage.innerText = "fichier trop volumineux !";
        askPostBtnAvailability();
        // else, show the image preview
    } else {
        isValidImg = true;
        askPostBtnAvailability();
        const img = document.createElement("img");
        img.classList.add("preview-container__preview");
        img.setAttribute('file', file);
        preview.appendChild(img);
        var reader = new FileReader();
        reader.onload = (function(aImg) {
            return function(e) {
                aImg.src = e.target.result;
            };
        })(img);
    
        reader.readAsDataURL(file);
        changeContainer();
    }
});

// remove preview
const removePreviewBtn = document.querySelector('.preview-container__remove-btn');
removePreviewBtn.addEventListener('click', () => {
    changeContainer();
    const preview = document.querySelector('.preview-container__preview');
    preview.remove();
    isValidImg = false;
    imgInput.value = '';
    isValue('', 'img');
    askPostBtnAvailability();
})

// POST new image to API
postImageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(isValidImg && isImg && isTitle && isCategory) {
        sendImg();                       
    }
})
        
const sendImg = async () => {
    const form = document.querySelector('.modal-form');
    const formData = new FormData(form);
    const r = await apiPostImage(formData);                
    if (r.ok === true) {
        await buildModalGallery();
        await buildGallery(apiGetWorks());
        switchModalContent();
        changeContainer();
        form.reset();

    }
}
