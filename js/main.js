let datosIntercambio = {
    evento: { nombre: "Intercambio UAA 2026", tipo: "", fecha: "", presupuesto: 0 },
    organizador: { nombre: "", participa: false },
    participantes: [],
    resultados: []
};

// Esto les da los id's
let ultimoIdAsignado = 0; 

let htmlIzquierdaOriginal = "";
let htmlDerechaOriginal = "";

// Esta funcion es para lo del local storage si quieres lo puedes pasar al storage.js hermano y mandarlo a llamar aqui
function sincronizarDatos() {
    console.log("Datos actualizados:", datosIntercambio);
}

// Funcion para los botones de la parte del organizador
function activarEventosOrganizador() {
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnCerrar = document.getElementById('btn-cerrar');

    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            const Libro = document.getElementById('el-libro');
            const modalLibreta = document.getElementById('modal-libreta');
            Libro.classList.remove('is-open');
            modalLibreta.classList.add('opacity-0');
            setTimeout(() => {
                modalLibreta.classList.remove('flex');
                modalLibreta.classList.add('hidden');
            }, 1000);
        });
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', () => {
            const inputNombre = document.getElementById('nombre-organizador');
            const participa = document.getElementById('participa-organizador').checked;
            if (inputNombre.value.trim() === '') {
                Swal.fire({
                    title: '¡Falta el nombre!',
                    text: 'Por favor, ingresa el nombre del organizador.',
                    icon: 'warning',
                    background: '#f4ebd0',
                    color: '#000',
                    customClass: {
                        popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] font-mono',
                        confirmButton: 'bg-[#facc15] text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all'
                    },
                    buttonsStyling: false
                });
                inputNombre.focus();
                return;
            }
            datosIntercambio.organizador.nombre = inputNombre.value.trim();
            datosIntercambio.organizador.participa = participa;
            sincronizarDatos();
            cargarPaginaParticipantes(datosIntercambio.organizador.nombre, participa);
        });
    }
}

// DOM XD (Ethernal)
document.addEventListener('DOMContentLoaded', () => {
    const mesaTrigger = document.getElementById('mesa-trigger');
    const modalLibreta = document.getElementById('modal-libreta');
    const Libro = document.getElementById('el-libro');
    const triggerAbrir = document.getElementById('trigger-abrir');

    // Guardamos el HTML inicial de las páginas
    htmlIzquierdaOriginal = document.getElementById('pagina-izquierda').innerHTML;
    htmlDerechaOriginal = document.getElementById('pagina-derecha').innerHTML;

    mesaTrigger.addEventListener('click', () => {
        modalLibreta.classList.remove('hidden');
        modalLibreta.classList.add('flex');
        Libro.classList.add('animate-jump-pixel', 'cursor-pointer');
        Libro.classList.remove('is-open');
        Libro.style.transform = ""; 
        document.getElementById('vaso-externo').classList.add('hidden', 'opacity-0');
        setTimeout(() => modalLibreta.classList.remove('opacity-0'), 50);
    });

    triggerAbrir.addEventListener('click', () => {
        triggerAbrir.classList.add('hidden');
        Libro.classList.remove('animate-jump-pixel', 'cursor-pointer');
        Libro.classList.add('is-open');
    });

    // Hacemos que los botones funcionen
    activarEventosOrganizador();

    // Eventos calendario
    document.getElementById('cal-prev').addEventListener('click', () => { fechaActual.setMonth(fechaActual.getMonth() - 1); renderizarCalendario(); });
    document.getElementById('cal-next').addEventListener('click', () => { fechaActual.setMonth(fechaActual.getMonth() + 1); renderizarCalendario(); });
    document.getElementById('btn-cerrar-calendario').addEventListener('click', cerrarCalendario);
});