/* theme */
//boton para desplegar theme
let selectTheme = document.getElementById('btn-theme');
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
    mostrarGif();
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

//mostrar gif
function mostrarGif(){
    var gifsLocalStorage = localStorage.getItem('misgifs');
    var getGifLocalStorage = JSON.parse(gifsLocalStorage);
    //recorro array con url de gif
    getGifLocalStorage.forEach((element) => {
        console.log(element);

        //selecciono div al que van a ir los gif
        let misGifos = document.getElementById('contenido-gifos');

        //creo div contenedor de gif
        let gif = document.createElement('div');
        gif.classList.add('gif');

        //creo div que contiene img de gif
        let divGif = document.createElement('div');
        divGif.classList.add('img');

        //creo img tag del gif
        let imgGif = document.createElement('img');
        //URL GIF
        imgGif.src = element;

        //PARENTS
        misGifos.appendChild(gif);
        gif.appendChild(divGif);
        divGif.appendChild(imgGif);
    });
}

//CAMBIAR THEME
//day
day.addEventListener('click', function() {
    //cambiar src de la hoja de estilos
    styles.href = './css/style-day.css';

    //guardar en local storage
    localStorage.setItem('themeElegido', styles.href);

    //cambiar estilo boton theme seleccionado
    day.classList.add('theme-elegido');
    night.classList.remove('theme-elegido');

    //brand
    brand.src = './img/gifof_logo.png';
    localStorage.setItem('brandElegida', brand.src);
    
    //cierro desplegable
    selectTheme.click();
    });

//night
night.addEventListener('click', function() {
    //cambiar src de la hoja de estilos
    styles.href = './css/style-night.css';

    //guardar en el local storage
    localStorage.setItem('themeElegido', styles.href);

    //cambiar estilo boton theme seleccionado
    night.classList.add('theme-elegido');
    day.classList.remove('theme-elegido');
    
    //brand
    brand.src = './img/gifof_logo_dark.png';
    localStorage.setItem('brandElegida', brand.src);

    //cierro desplegable
    selectTheme.click();
});