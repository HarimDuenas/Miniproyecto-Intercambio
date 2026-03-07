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
    const inputNombreEvento = document.getElementById('nombre-evento');
    const inputNombreOrg = document.getElementById('nombre-organizador');
    const checkboxParticipa = document.getElementById('participa-organizador');
    
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnCerrar = document.getElementById('btn-cerrar');
    const btnReiniciar = document.getElementById('btn-reiniciar-todo');

    // Autocompletamos datos si ya existen en localStorage ---
    if (inputNombreEvento && datosIntercambio.evento.nombre && datosIntercambio.evento.nombre !== "Intercambio Sorpresa" && datosIntercambio.evento.nombre !== "Intercambio UAA 2026") {
        inputNombreEvento.value = datosIntercambio.evento.nombre;
    }
    if (inputNombreOrg && datosIntercambio.organizador.nombre) {
        inputNombreOrg.value = datosIntercambio.organizador.nombre;
    }
    if (checkboxParticipa) {
        checkboxParticipa.checked = datosIntercambio.organizador.participa;
    }

    // Lógica del botón reiniciar
    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', () => {
            Swal.fire({
                title: '¿REINICIAR TODO EL EVENTO?',
                text: 'Se borrarán el organizador, participantes, exclusiones y presupuesto. ¡Empezarás desde cero!',
                icon: 'arning',
                showCancelButton: true,
                confirmButtonText: 'Sí, borrar todo',
                cancelButtonText: 'Cancelar',
                background: '#f4ebd0',
                customClass: {
                    popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_#000] font-mono',
                    confirmButton: 'bg-red-500 text-white border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-none transition-all',
                    cancelButtonText: 'bg-gray-400 text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_#000] ml-2 hover:translate-y-1 hover:shadow-none transition-all'
                },
                buttonsStyling: false
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("intercambio_uaa_2026");
                    location.reload();
                }
            });
        });
    }

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
            if (inputNombreOrg.value.trim() === '') {
                Swal.fire({
                    title: '¡Falta el nombre!',
                    text: 'Por favor, ingresa el nombre del organizador.',
                    icon: 'warning',
                    background: '#f4ebd0',
                    customClass: {
                        popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] font-mono',
                        confirmButton: 'bg-[#facc15] text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all'
                    },
                    buttonsStyling: false
                });
                inputNombreOrg.focus();
                return;
            }

            // Asignar los valores a nuestro objeto
            // Si el usuario deja el nombre del evento en blanco, le ponemos un nombre por defecto
            datosIntercambio.evento.nombre = inputNombreEvento.value.trim() || "Intercambio Sorpresa";
            datosIntercambio.organizador.nombre = inputNombreOrg.value.trim();
            datosIntercambio.organizador.participa = checkboxParticipa.checked;
            
            sincronizarDatos(); 
            cargarPaginaParticipantes(datosIntercambio.organizador.nombre, checkboxParticipa.checked);
        });
    }
}

// DOM XD (Ethernal)
document.addEventListener('DOMContentLoaded', () => {
    
    // Ambientacicón visual externa
    function iniciarAmbientacionExterior() {
        const contenedor = document.getElementById('pantalla-inicio');

        // Generar Luciérnagas (máximo de 40)
        for(let i = 0; i < 40; i++) {
            const luciernaga = document.createElement('div');
            luciernaga.className = 'absolute w-1 h-1 bg-[#facc15] rounded-full luciernaga z-30 pointer-events-none drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]';
            
            let posX, posY;
            
            // Distribuimos: 50% en el pasto (abajo), 50% en los laterales (más alto)
            if (Math.random() > 0.5) {
                // Zona del pasto (Todo a lo ancho, pero solo abajo)
                posX = Math.random() * 100;
                posY = Math.random() * 35;
            } else {
                // Zona de los laterales de la cabaña (Izquierda o Derecha, flotando más alto)
                posX = Math.random() > 0.5 ? (Math.random() * 25) : (75 + Math.random() * 25);
                posY = Math.random() * 85; // Pueden subir casi hasta arriba
            }
            
            luciernaga.style.bottom = posY + 'vh'; 
            luciernaga.style.left = posX + 'vw';
            
            luciernaga.style.animationDuration = (Math.random() * 4 + 4) + 's'; 
            luciernaga.style.animationDelay = (Math.random() * 5) + 's';
            
            contenedor.appendChild(luciernaga);
        }

        // Generar Estrellas Fugaces
        const dispararEstrella = setInterval(() => {
            if (!parallaxActivo) {
                clearInterval(dispararEstrella);
                return;
            }

            const estrella = document.createElement('div');
            estrella.className = 'absolute w-1 h-1 bg-white rounded-full estrella-animada z-0 pointer-events-none shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]';
            
            estrella.style.top = (Math.random() * 30) + 'vh'; 
            estrella.style.left = (Math.random() * 90 + 10) + 'vw'; 
            
            contenedor.appendChild(estrella);

            setTimeout(() => {
                estrella.remove();
            }, 1200); 

        }, 1200); // Cooldown de estrellas fugaces
    }

    // Llamamos a la función al cargar la página para iniciar ambientación
    iniciarAmbientacionExterior();

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
    audioExterior.volume = 0.3; // Volumen al 50% para que no asuste
    let audioIniciado = false;

    // Sistema de canciones del interior

    // Definimos las 4 canciones
    const listaCanciones = {
        'poster1' : new Audio("assets/interior1.mp3"),
        'poster2' : new Audio("assets/interior2.mp3"),
        'poster3' : new Audio("assets/interior3.mp3"),
        'poster4' : new Audio("assets/interior4.mp3")
    }

    // Configuramos loops y volumenes
    Object.values(listaCanciones).forEach(audio => {
        audio.loop = true;
        audio.volume = 0; // Todos empiezan en silencio para el fade-in
    });

    // Pista que sonará por defecto
    let cancionActualId = 'poster1';
    let audioActual = listaCanciones[cancionActualId];
    const volInteriorMax = 0.03; // Volúmen máximo global
    let intervalCrossfade = null; // Temporizador global para los cambios de canción

    // Función de cambio de música
    function cambiarCancionConCrossfade(nuevoPosterId){
        if (nuevoPosterId === cancionActualId) return; // Si ya está sonando, no hacemos nada

        console.log(`Cambiando música de ${cancionActualId} a ${nuevoPosterId}...`);
        const cancionNueva = listaCanciones[nuevoPosterId];
        
        // Limpiamos cualquier temporizador anterior por si el usuario hace clics rápidos
        if (intervalCrossfade) clearInterval(intervalCrossfade);

        // Preparamos la canción nueva
        cancionNueva.volume = 0;
        cancionNueva.play().catch(() => {});

        let volAnterior = audioActual.volume;
        let volNuevo = 0;

        intervalCrossfade = setInterval(() => {
            // Bajamos el volumen de la canción vieja
            if (volAnterior > 0.05) {
                volAnterior -= 0.05;
                audioActual.volume = Math.max(0, volAnterior);
            } else {
                audioActual.pause(); // Apagamos la vieja cuando ya no se oye
            }

            // Subimos el volumen a la canción nueva
            if (volNuevo < volInteriorMax) {
                volNuevo += 0.03; // Sube un poco más lento para que sea sutil
                cancionNueva.volume = Math.min(volInteriorMax, volNuevo);
            }

            // Detenemos cuando la vieja se apagó Y la nueva llegó al máximo
            if (volAnterior <= 0.05 && volNuevo >= volInteriorMax) {
                clearInterval(intervalCrossfade);
                // Actualizamos las referencias globales
                audioActual = cancionNueva;
                cancionActualId = nuevoPosterId;
                console.log("Cambio de canción completado.");
            }
        }, 150);
    }

    document.querySelectorAll('.poster-musical').forEach(poster => {
        poster.addEventListener('click', () => {
            cambiarCancionConCrossfade(poster.id); // Usamos el ID del poster ('poster1', 'poster2', 'poster3')
        });
    });

    // Audio para le ronroneo del gato
    const audioGato = new Audio('assets/ronroneo.mp3');
    audioGato.loop = true;
    audioGato.volume = 0.05; // Ajusta el volumen a tu gusto

    const gatoInteractivo = document.getElementById('gato-interactivo');
    
    // Reproducir ronroneo cuando el mouse entra al área del gato
    if (gatoInteractivo) {
        gatoInteractivo.addEventListener('mouseenter', () => {
            audioGato.play().catch(() => {}); // El catch evita errores en consola si hay bloqueos del navegador
        });

        // Pausar ronroneo cuando el mouse sale
        gatoInteractivo.addEventListener('mouseleave', () => {
            audioGato.pause();
        });
    }

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

        const logo = document.getElementById('logo-sistema');
        if (logo) {
            logo.style.transition = 'opacity 0.8s ease-out';
            logo.style.opacity = '0';
        }

        // SECUENCIA DE AUDIOS: Fade Out Exterior -> Silencio -> Fade In Interior
        let volExterior = audioExterior.volume;

        // Temporizador para bajar el bosque
        const fadeOutExterior = setInterval(() => {
            if (volExterior > 0.05) {
                volExterior -= 0.05;
                audioExterior.volume = Math.max(0, volExterior);
            } else {
                // Cuando el bosque se apaga, detenemos este temporizador
                audioExterior.pause();
                clearInterval(fadeOutExterior);

                // USAMOS SOLO audioActual
                audioActual.volume = 0;
                audioActual.play().catch(() => {});
                
                let volInterior = 0;
                const fadeInInterior = setInterval(() => {
                    if (volInterior < volInteriorMax) {
                        volInterior += 0.02; // Sube gradualmente
                        // Reemplazamos audioInterior por audioActual
                        audioActual.volume = Math.min(volInteriorMax, volInterior);
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
            pantallaInicio.classList.remove('flex');
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
            document.getElementById('trigger-abrir').classList.remove('hidden');
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