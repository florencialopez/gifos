/* theme */
var styles = document.getElementById('styles-color');
//day button
let day = document.getElementById('day');
//night button
let night = document.getElementById('night');
/* logo */
var brand = document.getElementById('brand');
// theme seleccionado
var themeElegido;
var brandElegida;

window.onload = () => {
    themeLocalStorage();
}

//guardar theme elegido y brand en el local storage
function themeLocalStorage(){
    //theme
    if(localStorage.getItem('themeElegido')){
        styles.href = localStorage.getItem('themeElegido');
    } else {
        styles.href = './css/style-day.css';
        day.classList.add('theme-elegido');
        night.classList.remove('theme-elegido');
    }

    //brand
    if(localStorage.getItem('brandElegida')){
        brand.src = localStorage.getItem('brandElegida');
    } else {
        brand.src = './img/gifof_logo.png';
    }
}
