function iniciarCeremoniaSorteo() {
    const Libro = document.getElementById('el-libro');
    const vasoExterno = document.getElementById('vaso-externo');
    const dropzone = document.getElementById('vaso-dropzone');
    const modalLibreta = document.getElementById('modal-libreta');

    // Se cierra el libro
    if (Libro) {
        Libro.style.transition = "all 0.5s ease";
        Libro.style.opacity = "0";
        Libro.style.pointerEvents = "none";
    }

    // Ponemos el vaso
    vasoExterno.classList.remove('hidden', 'right-[5%]', 'md:right-[15%]', 'top-1/2', '-translate-y-1/2');
    
    Object.assign(vasoExterno.style, {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%) scale(1.8)",
        zIndex: "1000",
        opacity: "1",
        display: "flex",
        transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    });

    // Mensaje 
    let mensaje = document.getElementById('mensaje-ritual');
    if (!mensaje) {
        mensaje = document.createElement('div');
        mensaje.id = "mensaje-ritual";
        vasoExterno.appendChild(mensaje);
    }
    
    mensaje.className = "absolute -top-24 left-1/2 -translate-x-1/2 bg-white border-4 border-black px-4 py-2 font-black uppercase text-[10px] shadow-[4px_4px_0_#000] animate-bounce whitespace-nowrap z-[1100]";
    mensaje.innerHTML = '¡Toca el vaso para sortear! 🎲';
    mensaje.style.backgroundColor = "#ffffff";

    // Clic en el vaso
    vasoExterno.onclick = (e) => {
        e.stopPropagation(); 
        
        mensaje.innerHTML = 'Mezclando papelitos... 🌀';
        mensaje.classList.remove('animate-bounce');
        dropzone.classList.add('animate-shake-pixel'); 
        
        // Hace el sorteo
        setTimeout(() => {
            const exito = ejecutarAlgoritmoSorteo();

            if (exito) {
                document.getElementById('sobres-trigger').classList.remove('hidden');
                dropzone.classList.remove('animate-shake-pixel');
                mensaje.innerHTML = '¡ASIGNADOS! ✨';
                mensaje.style.backgroundColor = "#4ade80"; // Verde éxito
                
                setTimeout(() => {
                    vasoExterno.style.opacity = "0";
                    modalLibreta.classList.add('opacity-0');
                    
                    setTimeout(() => {
                        vasoExterno.style.cssText = ""; 
                        vasoExterno.classList.add('hidden', 'right-[5%]', 'md:right-[15%]', 'top-1/2', '-translate-y-1/2');
                        
                        modalLibreta.classList.add('hidden');
                        modalLibreta.classList.remove('flex');
                        
                        // Si si jalo y no hubo pedos
                        Swal.fire({
                            title: '¡Sorteo Terminado!',
                            text: 'Todos tienen a quién regalarle. ¡Es hora de ver los resultados!',
                            icon: 'success',
                            background: '#f4ebd0',
                            customClass: {
                                popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] font-mono',
                                confirmButton: 'bg-[#4ade80] text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,1)]'
                            },
                            buttonsStyling: false
                        }).then(() => {
                            if (typeof cargarPantallaSobres === 'function') {
                                cargarPantallaSobres();
                            }
                        });
                        
                    }, 600);
                }, 1200);
            } else {
                // Si paso algo por exclusiones
                dropzone.classList.remove('animate-shake-pixel');
                mensaje.innerHTML = '❌ REGLAS IMPOSIBLES';
                mensaje.style.backgroundColor = "#f87171"; 
                
                setTimeout(() => {
                    vasoExterno.style.opacity = "0";
                    setTimeout(() => {
                        vasoExterno.style.cssText = "";
                        vasoExterno.classList.add('hidden', 'right-[5%]', 'md:right-[15%]', 'top-1/2', '-translate-y-1/2');
                        
                        if (Libro) {
                            Libro.style.opacity = "1";
                            Libro.style.pointerEvents = ""; 
                        }
                        
                        // Error de exclusiones
                        Swal.fire({
                            title: 'Sorteo Fallido',
                            text: 'No se encontró una combinación posible. Ajusta las reglas e intenta de nuevo.',
                            icon: 'error',
                            background: '#f87171',
                            color: '#fff',
                            customClass: {
                                popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] font-mono',
                                confirmButton: 'bg-white text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,1)]'
                            },
                            buttonsStyling: false
                        });
                        
                        if (typeof cargarPaginaExclusiones === 'function') {
                            cargarPaginaExclusiones();
                        }
                    }, 600);
                }, 1500);
            }
        }, 2000);

        vasoExterno.onclick = null; 
    };
}

// Sorteamos los participantes
function ejecutarAlgoritmoSorteo() {
    let participantes = [...datosIntercambio.participantes];
    let exito = false;
    let intentos = 0;

    while (!exito && intentos < 500) {
        intentos++;
        let receptores = [...participantes];
        
        for (let i = receptores.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [receptores[i], receptores[j]] = [receptores[j], receptores[i]];
        }

        exito = true;
        let pares = [];

        for (let i = 0; i < participantes.length; i++) {
            let dador = participantes[i];
            let receptor = receptores[i];

            if (dador.id === receptor.id || dador.exclusiones.includes(receptor.id)) {
                exito = false;
                break;
            }
            pares.push({ da: dador.id, recibe: receptor.id });
        }
        
        if (exito) {
            datosIntercambio.resultados = pares;
            sincronizarDatos(); 
        }
    }
    return exito;
}

// REVELACIÓN DE SOBRES Y RESUMEN DEL INTERCAMBIO

function cargarPantallaSobres() {
    const ui = document.getElementById('ui-intercambio');
    const escenaCabana = document.getElementById('escena-cabana');
    const btnCabana = document.getElementById('btn-cabana'); // La cabaña de la pantalla de inicio

    // Desenfoque del fondo
    escenaCabana.classList.add('blur-md', 'scale-[1.02]', 'transition-all', 'duration-700');
    if(btnCabana) btnCabana.classList.add('blur-md'); 

    // Construimos la interfaz de sobres
    let html = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm -z-10"></div>
        <div class="relative z-10 w-full max-w-5xl p-6 flex flex-col items-center h-full justify-center font-mono">
            
            <h2 class="text-4xl text-[#ffda75] font-black uppercase tracking-widest mb-2 drop-shadow-[4px_4px_0_#000]">Los Sobres</h2>
            <p class="text-white text-xs sm:text-sm mb-6 bg-black/50 px-4 py-2 border-2 border-white/20 text-center uppercase tracking-wider">
                Selecciona tu nombre. ¡No espíes los sobres de otras personas!
            </p>
            
            <div class="w-full flex-grow overflow-y-auto px-4 pb-4" style="scrollbar-width: thin;">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
    `;

    // Generamos un sobre pixel art para cada participante
    datosIntercambio.participantes.forEach(p => {
        html += `
            <div class="sobre-participante cursor-pointer hover:-translate-y-3 hover:scale-105 transition-all duration-300 group" data-id="${p.id}" data-nombre="${p.nombre}">
                <div class="relative w-32 h-24 sm:w-36 sm:h-28 bg-[#e9c4a6] border-4 border-black shadow-[6px_6px_0_#000] group-hover:shadow-[12px_12px_0_#000] flex flex-col items-center justify-center overflow-hidden transition-all">
                    
                    <div class="absolute top-0 left-0 w-0 h-0 border-l-[64px] sm:border-l-[72px] border-l-transparent border-r-[64px] sm:border-r-[72px] border-r-transparent border-t-[45px] sm:border-t-[50px] border-t-[#cda481] z-10 drop-shadow-[0_2px_0_rgba(0,0,0,0.2)] group-hover:-translate-y-2 transition-transform"></div>
                    
                    <div class="relative z-20 bg-white border-4 border-black px-2 py-1 mt-4 max-w-[90%] flex items-center justify-center">
                        <span class="font-bold text-black text-[10px] uppercase truncate">${p.nombre}</span>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
                </div>
            </div>

            <div class="mt-6 flex flex-wrap justify-center gap-4">
                <button id="btn-cerrar-sobres" class="px-4 py-2 bg-gray-400 text-black border-4 border-black font-bold uppercase text-xs sm:text-sm shadow-[4px_4px_0_#000] hover:bg-gray-500 hover:translate-y-1 hover:shadow-none transition-all">Volver a la cabaña</button>
                <button id="btn-resumen-evento" class="px-4 py-2 bg-[#facc15] text-black border-4 border-black font-bold uppercase text-xs sm:text-sm shadow-[4px_4px_0_#000] hover:bg-[#eab308] hover:translate-y-1 hover:shadow-none transition-all">Ver Resumen</button>
                <button id="btn-borrar-sorteo" class="px-4 py-2 bg-red-500 text-white border-4 border-black font-bold uppercase text-xs sm:text-sm shadow-[4px_4px_0_#000] hover:bg-red-600 hover:translate-y-1 hover:shadow-none transition-all">Borrar Sorteo</button>
            </div>
        </div>
    `;

    ui.innerHTML = html;
    ui.classList.remove('hidden');
    setTimeout(() => ui.classList.remove('opacity-0'), 50);

    // Asignar eventos a los nuevos botones
    document.getElementById('btn-cerrar-sobres').addEventListener('click', cerrarPantallaSobres);
    document.getElementById('btn-borrar-sorteo').addEventListener('click', confirmarBorrarSorteo);
    document.getElementById('btn-resumen-evento').addEventListener('click', mostrarResumenCumpliendoRubrica);

    document.querySelectorAll('.sobre-participante').forEach(sobre => {
        sobre.addEventListener('click', () => {
            abrirSobreIndividual(sobre.dataset.id, sobre.dataset.nombre);
        });
    });
}

function cerrarPantallaSobres() {
    const ui = document.getElementById('ui-intercambio');
    const escenaCabana = document.getElementById('escena-cabana');
    
    ui.classList.add('opacity-0');
    escenaCabana.classList.remove('blur-md', 'scale-[1.02]');
    
    setTimeout(() => {
        ui.classList.add('hidden');
        ui.innerHTML = ''; 
    }, 1000);
}

// Pantalla de Confirmación y Revelación
function abrirSobreIndividual(idDador, nombreDador) {
    Swal.fire({
        title: '¡ESPERA!',
        text: `¿Seguro que eres ${nombreDador}? Si no lo eres, pasa el dispositivo. ¡Tú no deberías ver esto!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, abrir mi sobre',
        cancelButtonText: 'Cancelar',
        background: '#f4ebd0',
        customClass: {
            popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_#000] font-mono',
            confirmButton: 'bg-[#4ade80] text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-none transition-all',
            cancelButtonText: 'bg-red-500 text-white border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_#000] ml-2 hover:translate-y-1 hover:shadow-none transition-all'
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
            revelarDestinatario(idDador, nombreDador);
        }
    });
}

function revelarDestinatario(idDador, nombreDador) {
    const par = datosIntercambio.resultados.find(r => r.da === idDador);
    const receptor = datosIntercambio.participantes.find(p => p.id === par.recibe);
    const evento = datosIntercambio.evento;
    
    const fechaStr = evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Por definir';
    const presuStr = evento.presupuesto > 0 ? `$${evento.presupuesto} MXN` : 'Sorpresa';

    Swal.fire({
        title: 'TOP SECRET',
        html: `
            <div class="text-left font-mono text-sm space-y-4 mt-2 bg-white p-4 border-4 border-black shadow-[inset_4px_4px_0_rgba(0,0,0,0.1)]">
                <p class="text-center font-bold text-lg border-b-4 border-black pb-2 uppercase tracking-widest text-[#f87171]">${nombreDador}</p>
                <p class="text-center pt-2 text-black font-bold">TE TOCÓ REGALARLE A:</p>
                <p class="text-3xl text-center font-black uppercase text-[#4ade80] drop-shadow-[2px_2px_0_#000] py-2 animate-pulse">${receptor.nombre}</p>
                
                <div class="bg-[#f4ebd0] p-3 border-4 border-black text-xs mt-4 leading-relaxed">
                    <p class="border-b-2 border-black/20 pb-1 mb-1"><strong>🎄 Motivo:</strong> ${evento.tipo || 'Intercambio'}</p>
                    <p class="border-b-2 border-black/20 pb-1 mb-1"><strong>📅 Fecha:</strong> ${fechaStr}</p>
                    <p><strong>Presupuesto:</strong> ${presuStr}</p>
                </div>
            </div>
        `,
        background: '#e9c4a6', // Color del sobre
        confirmButtonText: '¡Entendido! Ocultar',
        allowOutsideClick: false, // Evita que se cierre por accidente y lo vea el siguiente
        customClass: {
            popup: 'border-4 border-black rounded-none shadow-[12px_12px_0_#000] font-mono max-w-sm',
            confirmButton: 'bg-[#facc15] text-black border-4 border-black font-bold uppercase px-6 py-2 shadow-[4px_4px_0_#000] mt-4 hover:translate-y-1 hover:shadow-none transition-all'
        },
        buttonsStyling: false
    });
}

// RESUMEN DEL INTERCAMBIO QUE PIDE LA RÚBRICA

function mostrarResumenCumpliendoRubrica() {
    const org = datosIntercambio.organizador;
    const ev = datosIntercambio.evento;
    const parts = datosIntercambio.participantes;
    
    const fechaStr = ev.fecha ? new Date(ev.fecha).toLocaleDateString('es-ES') : 'Sin definir';
    const presuStr = ev.presupuesto > 0 ? `$${ev.presupuesto} MXN` : 'Libre';

    let htmlExclusiones = '';
    parts.forEach(p => {
        if (p.exclusiones && p.exclusiones.length > 0) {
            const excluidosNombres = p.exclusiones.map(idEx => {
                const px = parts.find(x => x.id === idEx);
                return px ? px.nombre : 'Desconocido';
            }).join(', ');
            htmlExclusiones += `<li class="mb-1"><span class="text-red-600">${p.nombre}</span> no le da a: ${excluidosNombres}</li>`;
        }
    });
    if (htmlExclusiones === '') htmlExclusiones = '<li>Ninguna exclusión establecida.</li>';

    Swal.fire({
        title: 'DATOS DEL EVENTO',
        html: `
            <div class="text-left font-mono text-xs space-y-3 bg-white p-4 border-4 border-black h-64 overflow-y-auto" style="scrollbar-width: thin;">
                <p><strong>👤 Organizador:</strong> ${org.nombre || 'No definido'} ${org.participa ? '(Participa)' : '(No participa)'}</p>
                <p><strong>🎉 Celebración:</strong> ${ev.nombre || ev.tipo || 'Intercambio'}</p>
                <p><strong>📅 Fecha:</strong> ${fechaStr}</p>
                <p><strong>💰 Presupuesto:</strong> ${presuStr}</p>
                
                <div class="border-t-4 border-black mt-3 pt-2">
                    <p class="font-bold mb-1">👥 Participantes (${parts.length}):</p>
                    <p class="pl-2">${parts.map(p => p.nombre).join(', ')}</p>
                </div>

                <div class="border-t-4 border-black mt-3 pt-2">
                    <p class="font-bold mb-1">🚫 Exclusiones:</p>
                    <ul class="pl-4 list-disc marker:text-red-500">
                        ${htmlExclusiones}
                    </ul>
                </div>
            </div>
        `,
        background: '#f4ebd0',
        confirmButtonText: 'Cerrar Resumen',
        customClass: {
            popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_#000] font-mono',
            confirmButton: 'bg-[#4ade80] text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-none transition-all'
        },
        buttonsStyling: false
    });
}

function confirmarBorrarSorteo() {
    Swal.fire({
        title: '¿ELIMINAR RESULTADOS?',
        text: 'Se borrará el sorteo actual pero los participantes y reglas se mantendrán para que vuelvas a sortear.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar',
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
            datosIntercambio.resultados = []; // Vaciamos los resultados
            sincronizarDatos(); // Guardamos en el localStorage
            cerrarPantallaSobres();
            
            // Regresamos la imagen de la mesa a la normalidad
            document.getElementById('sobres-trigger').classList.add('hidden');

            const Libro = document.getElementById('el-libro');
            if (Libro) {
                Libro.classList.remove('is-open');
                Libro.style.opacity = "1";
                Libro.style.pointerEvents = "auto";
            }

            // Usamos las variables guardadas en main.js para restaurar el diseño
            const pagIzquierda = document.getElementById('pagina-izquierda');
            const pagDerecha = document.getElementById('pagina-derecha');
            
            if (pagIzquierda && pagDerecha && typeof htmlIzquierdaOriginal !== 'undefined') {
                pagIzquierda.innerHTML = htmlIzquierdaOriginal;
                pagDerecha.innerHTML = htmlDerechaOriginal;
                
                // Volvemos a encender los botones de la portada
                if (typeof activarEventosOrganizador === 'function') {
                    activarEventosOrganizador();
                }
            }
            
            Swal.fire({
                title: '¡Borrado!',
                text: 'El sorteo se eliminó. Ya puedes abrir la libreta para configurar de nuevo.',
                icon: 'success',
                background: '#f4ebd0',
                customClass: { popup: 'border-4 border-black font-mono' }
            });
        }
    });
}