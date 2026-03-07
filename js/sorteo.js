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
                        vasoExterno.classList.add('hidden');
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
                        vasoExterno.classList.add('hidden');
                        
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