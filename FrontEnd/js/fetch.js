
const token = localStorage.getItem('token');

// // FETCH FUNCTIONS

// build the fetch request
const apiFetch = async (type, method, bodyContent) => {
    // build the init object
    const init = {
        method: method,
        headers: {'accept': 'application/json'},
        body: bodyContent
    };
    // if the request needs a Content-Type or a token, put them in the init object
    if (type === 'users/login') {init.headers['Content-Type'] = 'application/json'};
    if (type === 'works' && method === 'POST' || method ==='DELETE') {init.headers['Authorization'] = `Bearer ${token}`};
    // send the request
    const r = await fetch("http://localhost:5678/api/" + type, init);
    // if it is a GET request, return JSON
    if (method === 'GET') {return await r.json()}
    else {return r};
};

export const apiGetWorks = async () => {return await apiFetch('works', 'GET')};
export const apiGetCategories = async () => {return await apiFetch('categories', 'GET')};
export const apiDeleteImage = async (imageId) => {return await apiFetch(`works/${imageId}`, 'DELETE')};
export const apiPostImage = async (formData) => {return await apiFetch('works', 'POST', formData)};
export const apiPostUserLogin = async (userLogin) => {return await apiFetch('users/login','POST', userLogin)};