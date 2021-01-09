//PARA CONECTAR CON LA API
//apikey
var apiKey = "kd1ZkVGKJXj35VmlryZ4lIKkCzo5yHCZ";

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

//busqueda usuario
//valor ingresado por el usuario
//let searchUser = document.getElementById('search').value;
//input de barra de busqueda
let busqueda = document.getElementById('search');

let arraySugerencias = [];

//BUTTONS
let btnSearch = document.getElementById('btn-search');
//buttons autocomplete
let autocompleteUno = document.getElementById('autocomplete1');
let autocompleteDos = document.getElementById('autocomplete2');
let autocompleteTres = document.getElementById('autocomplete3');
//elegir theme
let desplegableTheme = document.getElementById('btn-theme');
let desplegableThemeDos = document.getElementById('btn-theme2');

//CONTENEDORES
//desplegable theme
let theme = document.getElementById('theme');
//autocomplete
let contAutocomplete = document.getElementById('cont-autocompletes');
//sugerencias
let sectionSugerencias = document.getElementById('section-sugerencias');
//tendencias
let sectionTendencias = document.getElementById('section-tendencias');
//botones terminos relacionados con la busqueda
let terminosRelacionados = document.getElementById('cont-terminos-relacionados');


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

//FUNCIONES AL CARGAR LA PAGINA
window.onload = () => {

    /* ---- theme---- */
    themeLocalStorage();

    /* ----sugerencias---- */
    for (let index = 0; index < 4; index++) {
        // HTML
        let sectionSugerencias = document.getElementById('sugerencias');

        sugerenciasFetch().then((response) => {
            if (response.images.downsized_large.url){
                // sugerencia container
                let divSugerencia = document.createElement('div');
                divSugerencia.classList.add('sugerencia');
                divSugerencia.id = 'sugerencia' + index;

                // info container
                let divInfo = document.createElement('div');
                divInfo.classList.add('info');

                // img container
                let divImg = document.createElement('div');
                divImg.classList.add('img');

                // hashtag
                let hashtag = document.createElement('h3');
                hashtag.innerHTML = '#' + response.title;

                //button
                let buttonExit = document.createElement('button');
                buttonExit.id = 'button-exit' + index;
                //var nombreFuncion = 'exit' + index;
                buttonExit.setAttribute('onclick', 'exit' + '(' + index + ')');
                let exit = new Image();
                exit.src = 'img/button3.svg';

                // img
                let img = new Image();
                img.src = response.images.downsized_large.url;

                //button
                var verMas = document.createElement('a');
                verMas.setAttribute('value', response.title);
                let value = response.title;
                verMas.setAttribute('onclick', 'btnVerMas' + '(' + '"' + value + '"' + ')');
                verMas.classList.add('ver-mas' + index);
                verMas.id = 'ver-mas' + index;
                verMas.innerHTML = 'Ver más...';

                // PARENTS
                sectionSugerencias.appendChild(divSugerencia);
                divSugerencia.appendChild(divInfo);
                divSugerencia.appendChild(divImg);
                //info
                divInfo.appendChild(hashtag);
                divInfo.appendChild(buttonExit);
                buttonExit.appendChild(exit);
                //img
                divImg.appendChild(img);
                divImg.appendChild(verMas);
            }
        })
    }


    /* ----trending---- */
    trendingFetch().then((response) => {
        let arrayTrending = response;

        // HTML
        let sectionTrending = document.getElementById('trending');

        arrayTrending.forEach((result) => {
            //Trending container
            let divTrending = document.createElement('div');
            divTrending.classList.add('sugerencia');
            divTrending.classList.add('tendencia');

            //img container
            let divImg = document.createElement('div');
            divImg.classList.add('img');

            //img
            let img = new Image();
            img.src = result.images.downsized_large.url;
            if (img.width > (img.height)+(img.height*40/100)) {
                divTrending.classList.add('busqueda2');
            } else {
                divTrending.classList.add('busqueda1');
            }

            //hashtag
            let hashtag = document.createElement('div');
            hashtag.classList.add('hashtag');

            //hashtag info
            let title = document.createElement('p');
            title.innerHTML = '#' + result.title;

            //PARENTS
            sectionTrending.appendChild(divTrending);
            divTrending.appendChild(divImg);
            divImg.appendChild(img);
            divImg.appendChild(hashtag);
            hashtag.appendChild(title);
        })
    })
}

/* SUGERENCIAS */
function sugerenciasFetch () {
    const datosSugerencias = fetch('https://api.giphy.com/v1/gifs/random?api_key=' + apiKey)
            .then((response) =>{
                return response.json()
            }).then(response => {
                return response.data
            })
            .catch((error) => {
                return error
            })
        return datosSugerencias;
}

/* TRENDING */
function trendingFetch () {
    const datosTrending = fetch('https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey)
            .then((response) =>{
                return response.json()
            }).then(response => {
                return response.data
            })
            .catch((error) => {
                return error
            })
        return datosTrending;
}

//Autocomplete
busqueda.onkeypress = (key) => {
    //Capturo el valor del input de busqueda
    let terminoBuscado = busqueda.value;
    
    if (key.keyCode === 13) { //Evito que me envien el formulario con un enter*/
        event.preventDefault();
        if (terminoBuscado.length > 0) {
            contAutocomplete.classList.add('hidden');
            buscar(terminoBuscado);
            busquedasRelacionadas(terminoBuscado);
            return false;
        }
    }
        
    btnSearch.disabled = false;
    if (terminoBuscado.length > 0) { //Si hay por lo menos 1 letra busco
        btnSearch.disabled = false;
        //capturo promesa
        autocompleteSearch(terminoBuscado)
        .then((response) => {
        let searchSuggestions = response.data;
            //respuestas
            if(response.meta.status == 200){
                let sugerencia1 = searchSuggestions[0].name;
                console.log(sugerencia1);
                let sugerencia2 = searchSuggestions[1].name;
                console.log(sugerencia2);
                let sugerencia3 = searchSuggestions[2].name;
                console.log(sugerencia3);

                //mostrar el contenedor de las sugerencias
                contAutocomplete.classList.remove('hidden');

                //en cada boton se muestra una sugerencia de palabra
                autocompleteUno.innerHTML = sugerencia1;
                autocompleteDos.innerHTML = sugerencia2;
                autocompleteTres.innerHTML = sugerencia3;
            } else {
                console.log('no hay sugerencias para esta palabra');
            }
        })
        .catch((error) => {
            console.log(error);
            return error;
        })
    } else {
        //Oculto el auto complete
        btnSearch.disabled = true;
        contAutocomplete.classList.add('hidden');
    }
}

autocompleteUno.addEventListener('click', () => {
    let terminoSugerido = autocompleteUno.innerHTML;
    console.log(terminoSugerido);
    busqueda.value = terminoSugerido;
    btnSearch.disabled = false;
    buscarSugerencia(terminoSugerido);
    contAutocomplete.classList.add('hidden');
    //botones con busquedas relacionadas
    busquedasRelacionadas(terminoSugerido);
})

autocompleteDos.addEventListener('click', () => {
    let terminoSugerido = autocompleteDos.innerHTML;
    console.log(terminoSugerido);
    busqueda.value = terminoSugerido;
    btnSearch.disabled = false;
    buscarSugerencia(terminoSugerido);
    contAutocomplete.classList.add('hidden');
    //botones con busquedas relacionadas
    busquedasRelacionadas(terminoSugerido);
})

autocompleteTres.addEventListener('click', () => {
    let terminoSugerido = autocompleteTres.innerHTML;
    console.log(terminoSugerido);
    busqueda.value = terminoSugerido;
    btnSearch.disabled = false;
    buscarSugerencia(terminoSugerido);
    contAutocomplete.classList.add('hidden');
    //botones con busquedas relacionadas
    busquedasRelacionadas(terminoSugerido);
})

async function autocompleteSearch(terminoIngresado){
    const autocomplete = await fetch('https://api.giphy.com/v1/tags/related/' + terminoIngresado + '?' + '&api_key=' + apiKey)
        .then((response) => {
            return response.json()
        }).then((response) => {
            return response
        })
        .catch((error) => {
            return error
        })
    return autocomplete;
}


/* search */
btnSearch.addEventListener('click', () => {
    let searchUser = document.getElementById('search').value;
    if(searchUser !== '') {
        btnSearch.disabled = false;
        buscar(searchUser);
        contAutocomplete.classList.add('hidden');
        busquedasRelacionadas(searchUser);
    } else {
        btnSearch.disabled = true;
    }
})

function buscar(palabraIngresada) {
    getSearchResults(palabraIngresada)
    .then((response) => {
        document.getElementById('busquedas').classList.remove('hidden');
        let arrayResultsSearch = response;
        console.log(arrayResultsSearch);
        document.getElementById('resultados').innerHTML = palabraIngresada + " " + "(resultados)";

        let containerSearchs = document.getElementById('contenido-busquedas');
        containerSearchs.innerHTML = ' ';
        arrayResultsSearch.forEach((result) => {
            let img = result.images.original.url;
            let clase = '';
            if (img.width > (img.height)+(img.height*40/100)) {
                clase = 'busqueda2';
            } else {
                clase = 'busqueda1';
            }

            let contenido = document.createElement('div');
            contenido.classList.add('sugerencia');
            contenido.innerHTML = `<div class="img">
                    <img src="${img}" alt="" class="gif-busqueda ${clase}">
                </div>`;

            containerSearchs.appendChild(contenido);
        });        
    });
}

function getSearchResults (searchUser){
    const datos = fetch('https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=' + searchUser)
        .then((response) =>{
            return response.json()
        }).then(response => {
            return response.data
        })
        .catch((error) => {
            return error
        })
    return datos;
}

//GIFS RELACIONADOS con la busqueda - botones
function busquedasRelacionadas(terminoIngresado){
    console.log(terminoIngresado);
    autocompleteSearch(terminoIngresado).then((response) => {
        let searchSuggestions = response.data;

        //foreach al array de respuestas
        if(response.meta.status == 200){
            terminosRelacionados.classList.remove('hidden');

            let sugerencia1 = searchSuggestions[0].name;
            console.log(sugerencia1);
            let sugerencia2 = searchSuggestions[1].name;
            console.log(sugerencia2);
            let sugerencia3 = searchSuggestions[2].name;
            console.log(sugerencia3);

            //en cada boton se muestra una sugerencia de palabra
            document.getElementById('termino-uno').innerHTML = '#' + sugerencia1;
            document.getElementById('termino-uno').setAttribute('value', sugerencia1)
            document.getElementById('termino-dos').innerHTML = '#' + sugerencia2;
            document.getElementById('termino-dos').setAttribute('value', sugerencia2)
            document.getElementById('termino-tres').innerHTML = '#' + sugerencia3;
            document.getElementById('termino-tres').setAttribute('value', sugerencia3)
        } else {
            console.log('no hay sugerencias para esta palabra');
        }
    })
    .catch((error) => {
        console.log(error);
        return error;
    })
}

//buscar sugerencia de palabra del autocomplete
async function buscarSugerencia(terminoSugerido) {
        document.getElementById('busquedas').classList.remove('hidden');

        getSearchResultsSugerencia(terminoSugerido)
        .then((response) => {
            let arrayResultsSearch = response;
            console.log(arrayResultsSearch);
            document.getElementById('resultados').innerHTML = terminoSugerido + " " + "(resultados)";
            let containerSearchs = document.getElementById('contenido-busquedas');
            containerSearchs.innerHTML = ' ';
            for (let index = 0; index < 24; index++) {
                let img = arrayResultsSearch[index].images.downsized_large.url;
                let clase = '';
                if (img.width > (img.height)+(img.height*40/100)) {
                    clase = 'busqueda2';
                } else {
                    clase = 'busqueda1';
                }
    
                let contenido = document.createElement('div');
                contenido.classList.add('sugerencia');
                contenido.innerHTML = `<div class="img">
                        <img src="${img}" alt="" class="gif-busqueda ${clase}">
                    </div>`;
    
                containerSearchs.appendChild(contenido);
            };   
            
        });
}

function getSearchResultsSugerencia (terminoSugerido){
    const datos = fetch('https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=' + terminoSugerido)
        .then((response) =>{
            return response.json()
        }).then(response => {
            return response.data
        })
        .catch((error) => {
            return error
        })
        console.log(datos);
    return datos;
}


//BUSQUEDA boton ver mas
function btnVerMas(value){
    if(value !== ''){
        buscarSugerencia(value);

        busqueda.value = value;
        sectionSugerencias.classList.add('hidden');
        sectionTendencias.classList.add('hidden');
    }
}

//eliminar sugerencia BOTON EXIT y agregar una nueva
let contador = 4;
function exit(index){
    let contenedorEliminado = document.getElementById('sugerencia' + index);
    contenedorEliminado.classList.add('hidden');
    
    //buscar nueva sugerencia
    for (let index = 0; index < 1; index++) {
        //sumo al contador
        contador = contador + 1;

        // HTML
        let sectionSugerencias = document.getElementById('sugerencias');

        nuevaSugerencia().then((response) => {
            // sugerencia container
            let divSugerencia = document.createElement('div');
            divSugerencia.classList.add('sugerencia');
            divSugerencia.id = 'sugerencia' + contador;

            // info container
            let divInfo = document.createElement('div');
            divInfo.classList.add('info');

            // img container
            let divImg = document.createElement('div');
            divImg.classList.add('img');

            // hashtag
            let hashtag = document.createElement('h3');
            hashtag.innerHTML = '#' + response.title;

            //button
            let buttonExit = document.createElement('button');
            buttonExit.id = 'button-exit' + contador;
            //var nombreFuncion = 'exit' + index;
            buttonExit.setAttribute('onclick', 'exit' + '(' + contador + ')');
            let exit = new Image();
            exit.src = 'img/button3.svg';

            // img
            let img = new Image();
            img.src = response.images.downsized_large.url;

            //button
            var verMas = document.createElement('a');
            verMas.setAttribute('value', response.title);
            let value = response.title;
            verMas.setAttribute('onclick', 'btnVerMas' + '(' + '"' + value + '"' + ')');
            verMas.classList.add('ver-mas' + contador);
            verMas.id = 'ver-mas' + contador;
            verMas.innerHTML = 'Ver más...';

            // PARENTS
            sectionSugerencias.appendChild(divSugerencia);
            divSugerencia.appendChild(divInfo);
            divSugerencia.appendChild(divImg);
            //info
            divInfo.appendChild(hashtag);
            divInfo.appendChild(buttonExit);
            buttonExit.appendChild(exit);
            //img
            divImg.appendChild(img);
            divImg.appendChild(verMas);
        })
    } 
}

//nueva sugerencia cuando elimino una
function nuevaSugerencia () {
    const datosSugerencias = fetch('https://api.giphy.com/v1/gifs/random?api_key=' + apiKey)
            .then((response) =>{
                return response.json()
            }).then(response => {
                return response.data
            })
            .catch((error) => {
                return error
            })
        return datosSugerencias;
}

document.getElementById('termino-uno').addEventListener('click', () =>{
    let terminoBusqueda = document.getElementById('termino-uno').value;
    console.log(terminoBusqueda);
    busqueda.value = terminoBusqueda;
    buscar(terminoBusqueda);
    //botones con busquedas relacionadas
    busquedasRelacionadas();
})

document.getElementById('termino-dos').addEventListener('click', () =>{
    let terminoBusqueda = document.getElementById('termino-dos').value;
    console.log(terminoBusqueda);
    busqueda.value = terminoBusqueda;
    buscar(terminoBusqueda);
    //botones con busquedas relacionadas
    busquedasRelacionadas();
})

document.getElementById('termino-tres').addEventListener('click', () =>{
    let terminoBusqueda = document.getElementById('termino-tres').value;
    console.log(terminoBusqueda);
    busqueda.value = terminoBusqueda;
    buscar(terminoBusqueda);
    //botones con busquedas relacionadas
    busquedasRelacionadas();
})