// Llave con la que se guardan/recuperan los resultados
const llaveLocalStorage = 'intercambio_uaa_2026';


// Guarda el objeto completo de datos en el localStorage

function guardarEnStorage(datos) {
    try {
        const datosString = JSON.stringify(datos);
        localStorage.setItem(llaveLocalStorage, datosString);
    } catch (error) {
        console.error("Error al guardar en localStorage:", error);
    }
}


// Recupera y parsea los datos del localStorage

function cargarDeStorage() {
    try {
        const datosGuardados = localStorage.getItem(llaveLocalStorage);
        if (datosGuardados) {
            return JSON.parse(datosGuardados);
        }
    } catch (error) {
        console.error("Error al leer de localStorage:", error);
    }
    return null;
}


// Limpia los datos del intercambio (Esto si se quiere hacer un nuevo sorteo)

function limpiarStorage() {
    localStorage.removeItem(llaveLocalStorage);
}