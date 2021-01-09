//FETCH DATA
var apiKey = "kd1ZkVGKJXj35VmlryZ4lIKkCzo5yHCZ";
user = "florencia-angelina";

var urlGif;

//Css Style
var styles = document.getElementById('styles-color');

//CONTENEDORES
let sectionCrearGif = document.getElementById('crear');

//BUTTONS
let exitUpload = document.getElementById('exit-upload');

//VIDEO
var miCamara;
//video tag
var video = document.getElementById('video');
//video tag 2 - preview
var videoPreview = document.getElementById('video-preview');
//img tag GIF
var videoGif = document.getElementById('video-gif');

//titulo grabacion
let tituloGrabacion = document.getElementById('upload-h3');

//img gif creado
var imgGif = document.getElementById('mi-nuevo-gif');

//capturar
var recorder;
//carpturar gif
var gifRecorder;

//video configuration
var config = {
    type: 'video' // audio or video or gif or canvas
}

//gif configuration
var configGif = {
    type: 'gif'
}

//blob guarda grabacion gif
var blob;
//blob guarda grabacion video
var videoBlob;

//BUTTONS
//capturar
let btnCapturar = document.getElementById('capturar');
//repetir captura
let btnRepetirCaptura = document.getElementById('repetir');
//listo
let btnDetener = document.getElementById('detener');
//play
let btnPlay = document.getElementById('play');
//subir
let btnSubir = document.getElementById('subir');
//copiar
let btnCopiarGifOs = document.getElementById('copiar');
//descargar
let btnDescargarGifOs = document.getElementById('descargar');
//listo
let btnListo = document.getElementById('listo');
//cancelar subida de gif
let btnCancelar = document.getElementById('cancelar2');
//exit gif
let exitGif = document.getElementById('exit-gif');



//timer duracion
let duracion = document.getElementById('duracion');

function themeLocalStorage(){
    if(localStorage.getItem('themeElegido')){
        styles.href = localStorage.getItem('themeElegido');
    } else {
        styles.href = './css/style-day.css';
    }

    if(localStorage.getItem('brandElegida')){
        brand.src = localStorage.getItem('brandElegida');
    } else {
        brand.src = './img/gifof_logo.png';
    }
}


//CAPTURAR
window.onload = () => {
    themeLocalStorage();
    getStreamAndRecord();
}

function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: {max: 432},
            width: {max: 832}
        }
    }).then(async function(stream) {
        miCamara = stream;
        video.srcObject = stream;
        video.play()
    })
}

//comenzar
btnCapturar.addEventListener('click', () => {
    //cambio titulo
    tituloGrabacion.innerHTML = 'Capturando Tu Guifo';
    //grabo video
    recorder = new RecordRTCPromisesHandler(miCamara, config);
    //grabo gif
    gifRecorder = new RecordRTCPromisesHandler(miCamara, configGif);

    //comienzo a grabar video
    recorder.startRecording();
    //comienzo a grabar gif
    gifRecorder.startRecording();

    //desaparece boton grabar y aparece botón para detener
    document.getElementById('inst1').classList.add('hidden');
    document.getElementById('inst2').classList.remove('hidden');
});

//stop
btnDetener.addEventListener('click', terminarGrabacion);

async function terminarGrabacion() {
    //cambio titulo
    tituloGrabacion.innerHTML = 'Vista Previa';

    //terminar grabacion video
    await recorder.stopRecording();
    //terminar grabacion gif
    await gifRecorder.stopRecording();

    //guardar grabacion video
    videoBlob = await recorder.getBlob();
    //guardar grabacion gif
    blob = await gifRecorder.getBlob();
    //console.log(blob);

    console.log(blob);

    //oculto y muestro botones
    document.getElementById('inst2').classList.add('hidden');
    document.getElementById('inst3').classList.remove('hidden');

    //timer
    duracion.innerHTML = calcularDuracion(0);

    //oculto video tag de grabacion y muestro preview
    video.classList.add('hidden');
    videoPreview.classList.remove('hidden');
    //videoPreview.srcObject = null;
    videoPreview.src = URL.createObjectURL(videoBlob);
    console.log(URL.createObjectURL(blob));
}

//play video
btnPlay.addEventListener('click', () => {
    videoPreview.play();
    //timer
    videoPreview.ontimeupdate = () => {
        console.log(videoPreview.currentTime, videoPreview.duration);
        duracion.innerHTML = calcularDuracion(videoPreview.currentTime);
    }
})

//calcular duracion video para timer
function calcularDuracion(segundos) {
    var hr = Math.floor(segundos / 3600);
    var min = Math.floor((segundos - (hr * 3600)) / 60);
    var seg = Math.floor(segundos - (hr * 3600) - (min * 60));
    min = (min < 10)? "0" + min : min;
    seg = (seg < 10)? "0" + seg : seg;
    if (hr <= 0) {
        return min + ':' + seg;
    }
    return hr + ':' + min + ':' + seg;
}


//subir
btnSubir.addEventListener('click', () => {
    //cambio titulo
    tituloGrabacion.innerHTML = 'Subiendo Guifo';

    //resetear el elemento que graba
    gifRecorder.destroy();
    gifRecorder = null;
    recorder.destroy();
    recorder = null;

    //Libero la camara
    miCamara.getTracks().forEach(function(track) {
        track.stop();
    });

    //oculto y muestro botones correspondientes
    document.getElementById('inst3').classList.add('hidden');
    videoPreview.classList.add('hidden');
    document.getElementById('inst4').classList.remove('hidden');
    console.log('Comienza a incluir nuestra grabación al form');

    //capturo promesa
    uploadGif()
    .then((datos) => {
        let id = datos.data.id;
        if (id) {
            guandarGifEnLocalStorage(id); //Lo guardo en localstorage
            document.getElementById('crear-gif').classList.add('hidden');
            document.getElementById('inst5').classList.remove('hidden');  
            //mostrarGif();
        }
    })
    .catch(error => {
        console.log(error);
        return error;
    });
})


function uploadGif () {
    console.log('comienza a enviar el gif');
    
    //Objeto form data para enviar lo grabado
    data = new FormData();
    data.append('file', blob, 'miGif.gif');

    //post gif
    const dataUpload = fetch('https://upload.giphy.com/v1/gifs?' + 'api_key=' + apiKey + '&username=' + user, {
        method: 'POST',
        body: data
    })
    .then(response => {
        return response.json();
    }).then(datos => {
        return datos;
    })
    .catch(error => {
        console.log(error);
        return error;
    });
    return dataUpload;
}

function guandarGifEnLocalStorage(id){
    fetch('https://api.giphy.com/v1/gifs/' + id + '?' + '&api_key=' + apiKey)
    .then(response => {
        return response.json();
    }).then(datos => {
        //url gif
        let gifUrl = datos.data.images.downsized.url;
        //defino src de mi img para que se previsualice el gif
        imgGif.src = gifUrl;
        btnCopiarGifOs.nodeValue = gifUrl;
        let gifCreados = [];
        //Verifico si existen ya gif en localStorage
        if (localStorage.getItem('misgifs')) 
        {
            gifCreados = JSON.parse(localStorage.getItem('misgifs'));
        }
        //agrego url al array de url de gifs creados
        gifCreados.push(gifUrl);
        //guardo en local storage
        localStorage.setItem('misgifs', JSON.stringify(gifCreados));      
        //mostrarGif();
    })
    .catch(error => {
        console.log(error);
        return error;
    })
}
    
function mostrarGif(){
    var gifsLocalStorage = localStorage.getItem('misgifs');
    var getGifLocalStorage = JSON.parse(gifsLocalStorage);
    //recorro array con url de gif
    getGifLocalStorage.forEach(element => {

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

// Copiar al portapapeles
btnCopiarGifOs.addEventListener('click', function(event) {
    let text = imgGif.getAttribute('src');
    navigator.clipboard.writeText(text).then(function() {
        /* clipboard successfully set */
        console.log("copiado con éxito");
    });
});

// Descargar Gif
btnDescargarGifOs.addEventListener("click", descargarGif);
function descargarGif() {
    invokeSaveAsDialog(blob, 'migif.gif');
}

// Listo
btnListo.addEventListener("click", () => {
    window.location = "mis-guifos.html";
})

//salir gif creado
exitGif.addEventListener("click", () => {
    window.location = "mis-guifos.html";
})

//repetir captura
btnRepetirCaptura.addEventListener("click", () => {
    //resetear el elemento que graba
    gifRecorder.destroy();
    gifRecorder = null;
    recorder.destroy();
    recorder = null;

    //Libero la camara
    miCamara.getTracks().forEach(function(track) {
        track.stop();
    });
    document.getElementById('inst3').classList.add('hidden');
    document.getElementById('inst1').classList.remove('hidden');
    tituloGrabacion.innerHTML = 'Un Chequeo Antes de Empezar';

    video.classList.remove('hidden');
    videoPreview.classList.add('hidden');

    getStreamAndRecord();
})

//BUTTON EXIT
exitUpload.addEventListener('click', () => {
    if(gifRecorder && recorder) {
        //resetear el elemento que graba
        gifRecorder.destroy();
        gifRecorder = null;
        recorder.destroy();
        recorder = null;
        
        //Libero la camara
        miCamara.getTracks().forEach(function(track) {
            track.stop();
        });

        window.location = "crear-gifos.html";
    } else {
        window.location = "crear-gifos.html";
    }
})

btnCancelar.addEventListener('click', () => {
    if(gifRecorder && recorder) {
        //resetear el elemento que graba
        gifRecorder.destroy();
        gifRecorder = null;
        recorder.destroy();
        recorder = null;
        
        //Libero la camara
        miCamara.getTracks().forEach(function(track) {
            track.stop();
        });

        window.location = "crear-gifos.html";
    } else {
        window.location = "crear-gifos.html";
    }
})