// Intentamos cargar datos previos del localStorage, si no hay, inicializamos la estructura vacía
let datosIntercambio = cargarDeStorage() || {
    evento: { nombre: "Intercambio UAA 2026", tipo: "", fecha: "", presupuesto: 0 },
    organizador: { nombre: "", participa: false },
    participantes: [],
    resultados: []
};

// Esto les da los id's (Buscamos el ID más alto guardado para no repetir, o empezamos en 0)
let ultimoIdAsignado = datosIntercambio.participantes.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0); 

let htmlIzquierdaOriginal = "";
let htmlDerechaOriginal = "";

// Esta función se llama cada vez que modificamos algo (agregamos participante, exclusión, etc.)
function sincronizarDatos() {
    guardarEnStorage(datosIntercambio);
    console.log("Datos guardados en localStorage exitosamente.");
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
    
    // Referencias del exterior de la cabaña y transición
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const capasParallax = document.querySelectorAll('.capa-parallax');
    const btnCabana = document.getElementById('btn-cabana');
    const fadeOverlay = document.getElementById('fade-overlay');
    const escenaCabana = document.getElementById('escena-cabana');
    let parallaxActivo = true;

    // Lógica de audio exterior
    const audioExterior = new Audio('assets/ambientacionExterior.mp3');
    audioExterior.loop = true; // Que se repita infinitamente
    audioExterior.volume = 0.5; // Volumen al 50% para que no asuste
    let audioIniciado = false;

    // Audio para el interior de la cabaña
    const audioInterior = new Audio("../assets/interior1.mp3");
    audioInterior.loop = true;
    audioInterior.volume = 0; // Para hacer fade-in

    // Función para intentar iniciar el audio con la primera interacción
    const iniciarAudio = () => {
        if (!audioIniciado) {
            audioExterior.play().then(() => {
                audioIniciado = true;
                // Si ya inició, quitamos los eventos para no sobrecargar
                document.removeEventListener('click', iniciarAudio);
                document.removeEventListener('mousemove', iniciarAudio);
            }).catch(() => {
                // El navegador bloqueó el autoplay, esperamos al siguiente intento
            });
        }
    };

    // Escuchamos el primer clic o movimiento del mouse para brincarnos el bloqueo del navegador
    document.addEventListener('click', iniciarAudio);
    document.addEventListener('mousemove', iniciarAudio);

    // Efecto Parallax
    pantallaInicio.addEventListener('mousemove', (e) => {
        if (!parallaxActivo) return; 
        const x = window.innerWidth / 2 - e.pageX;
        const y = window.innerHeight / 2 - e.pageY;

        capasParallax.forEach(capa => {
            const speed = parseFloat(capa.getAttribute('data-speed'));
            capa.style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0)`;
        });
    });

    // Transición de entrada
    btnCabana.addEventListener('click', () => {
        parallaxActivo = false;
        pantallaInicio.style.pointerEvents = 'none';
        pantallaInicio.style.transformOrigin = '46% 73%';
        pantallaInicio.style.transition = 'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
        pantallaInicio.style.transform = 'scale(6)'; 

        // SECUENCIA DE AUDIOS: Fade Out Exterior -> Silencio -> Fade In Interior
        let volExterior = audioExterior.volume;
        const volInteriorMax = 0.3; // Volumen final del interior

        // Temporizador para bajar el bosque
        const fadeOutExterior = setInterval(() => {
            if (volExterior > 0.05) {
                volExterior -= 0.05;
                audioExterior.volume = Math.max(0, volExterior);
            } else {
                // Cuando el bosque se apaga, detenemos este temporizador
                audioExterior.pause();
                clearInterval(fadeOutExterior);

                // Ponemos play al interior en silencio y empezamos a subirlo
                audioInterior.volume = 0;
                audioInterior.play().catch(() => {});
                
                let volInterior = 0;
                const fadeInInterior = setInterval(() => {
                    if (volInterior < volInteriorMax) {
                        volInterior += 0.02; // Sube gradualmente
                        audioInterior.volume = Math.min(volInteriorMax, volInterior);
                    } else {
                        // Cuando llega a su volumen ideal, detenemos este temporizador
                        clearInterval(fadeInInterior);
                    }
                }, 150); // Velocidad del fade in
            }
        }, 150); // Velocidad del fade out

        // Animaciones visuales
        setTimeout(() => {
            fadeOverlay.classList.remove('opacity-0');
            fadeOverlay.classList.add('opacity-100');
        }, 350);

        setTimeout(() => {
            pantallaInicio.classList.add('hidden');
            escenaCabana.classList.remove('hidden'); 
            void escenaCabana.offsetWidth; 
            fadeOverlay.classList.remove('opacity-100');
            fadeOverlay.classList.add('opacity-0');
        }, 1800);
    });

    const mesaTrigger = document.getElementById('mesa-trigger');
    const modalLibreta = document.getElementById('modal-libreta');
    const sobresTrigger = document.getElementById('sobres-trigger')
    const Libro = document.getElementById('el-libro');
    const triggerAbrir = document.getElementById('trigger-abrir');

    // Lógica del estado de la mesa central
    const sorteoCompletado = datosIntercambio.resultados && datosIntercambio.resultados.length > 0;

    if (sorteoCompletado) {
        sobresTrigger.classList.remove('hidden'); // Aparecen los sobres si hay un sorteo completado
    }

    // Click en los sobres
    sobresTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic traspase a la mesa, ya que los sobres estan arriba de ella
        
        cargarPantallaSobres();
    });

    // Guardamos el HTML inicial de las páginas
    htmlIzquierdaOriginal = document.getElementById('pagina-izquierda').innerHTML;
    htmlDerechaOriginal = document.getElementById('pagina-derecha').innerHTML;

    // Clic en la mesa central
    mesaTrigger.addEventListener('click', () => {
        // Volvemos a checar el estado por si el sorteo se acaba de hacer en esta sesión
        if (datosIntercambio.resultados && datosIntercambio.resultados.length > 0) {
            // AQUÍ SE ABRIRÁ LA PANTALLA DE RESULTADOS
            console.log("Abriendo pantalla de resultados...");
            if (typeof cargarPantallaSobres === 'function') {
                cargarPantallaSobres();
            }
        } else {
            // Si no hay sorteo, abrimos la libreta de registro normalmente
            modalLibreta.classList.remove('hidden');
            modalLibreta.classList.add('flex');
            Libro.classList.add('animate-jump-pixel', 'cursor-pointer');
            Libro.classList.remove('is-open');
            Libro.style.transform = ""; 
            document.getElementById('vaso-externo').classList.add('hidden', 'opacity-0');
            setTimeout(() => modalLibreta.classList.remove('opacity-0'), 50);
        }
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