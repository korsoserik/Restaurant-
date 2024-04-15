import Backend from "./backend.js";
import Login from "./login.js";
import Menu from "./menu.js";
import Orders from "./orders.js";
import Home from "./home.js";
const BASE_URL = '/12aBM/project/';
const rootDiv = document.querySelector('#root');
const navs = document.querySelectorAll('a[data-href]');
let logout = document.querySelector('#logout');
let BACKEND = new Backend();
//route-ok
const routes = {
    '/': { html: './pages/home.html', code: Home },
    '/menu': { html: './pages/menu.html', code: Menu },
    '/orders': { html: './pages/orders.html', code: Orders },
    '/login': { html: './pages/login.html', code: Login },
    '/404': { html: './pages/404.html', code: null }
};
// oldalak betöltése
const loadPage = async (page) => {
    const response = await fetch(page.html);
    const resHTML = response.text(); // szöveggé konvertálás
    return resHTML;
};
// dinamikus osztály példányosítás
const dynamicClass = (page) => {
    if (page.code != null) {
        const dynamicClassName = eval(page.code);
        new dynamicClassName();
    }
};
// function onNavClick(){
// }
const onNavClick = async (event) => {
    event.preventDefault(); // megakadályozza az oldal újratöltését
    // console.log(event.target.dataset.href);
    const pathName = event.target.dataset.href;
    const data = await loadPage(routes[pathName]);
    rootDiv.innerHTML = data;
    window.history.pushState({}, '', window.location.origin + BASE_URL + pathName);
    //console.log(window.location);
    dynamicClass(routes[pathName]);
};
// windows.history alapján frissítés
window.addEventListener('popstate', async () => {
    // console.log(window.location.pathname);
    const routePath = window.location.pathname.slice(BASE_URL.length, window.location.pathname.length);
    // console.log(routePath);
    let data;
    if (routePath in routes) {
        data = await loadPage(routes[routePath]);
    }
    else {
        // nem létező oldal
        data = await loadPage(routes['/404']);
    }
    rootDiv.innerHTML = data;
    dynamicClass(routes[routePath]);
});
// F5 frissítés
window.addEventListener('load', async () => {
    const routePath = window.location.pathname.slice(BASE_URL.length, window.location.pathname.length);
    let data;
    if (routePath in routes) {
        data = await loadPage(routes[routePath]);
    }
    else {
        // nem létező oldal
        data = await loadPage(routes['/404']);
    }
    rootDiv.innerHTML = data;
    dynamicClass(routes[routePath]);
});
// eseménykezelés
navs.forEach(nav => {
    nav.addEventListener('click', onNavClick);
});
logout.addEventListener('click', () => {
    if (confirm(`Are you sure you want to logout: | ${localStorage.getItem('UserName')} | ?`)) {
        window.localStorage.setItem('LoggedIn', 'false');
        window.localStorage.setItem('UserName', '');
        BACKEND.checkLogin();
    }
});
