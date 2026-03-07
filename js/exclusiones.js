function cargarPaginaExclusiones() {
    // Empezamos con el primer participante 
    let idActivo = datosIntercambio.participantes[0]?.id;
    const pagIzquierda = document.getElementById('pagina-izquierda');
    const pagDerecha = document.getElementById('pagina-derecha');

    // Variable de estado para saber si el usuario quiere exclusiones
    let exclusionesActivadas = datosIntercambio.participantes.some(p => p.exclusiones && p.exclusiones.length > 0);

    function renderizarExclusiones() {
        const pActivo = datosIntercambio.participantes.find(p => p.id === idActivo);
        
        // Si por alguna razon no hay participante activo mandamos todo a la chingada xd
        if (!pActivo) return;

        pagIzquierda.innerHTML = `
            <h2 class="text-xl font-bold border-b-4 border-black pb-1 mb-2 text-center mt-1 uppercase tracking-tighter">Reglas</h2>
            
            <div class="mb-2 shrink-0">
                <label class="flex items-center space-x-2 text-black cursor-pointer bg-white p-2 border-4 border-black hover:bg-[#e0f0ff] transition-colors shadow-[4px_4px_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1">
                    <input type="checkbox" id="check-activar-exclusiones" class="w-4 h-4 accent-black cursor-pointer" ${exclusionesActivadas ? 'checked' : ''}>
                    <span class="font-bold text-[10px] uppercase">¿Agregar excepciones?</span>
                </label>
            </div>

            <div id="interfaz-izq" class="${exclusionesActivadas ? 'flex' : 'hidden'} flex-col flex-grow min-h-0 gap-2">
                <div class="bg-white/60 p-2 border-4 border-black shadow-[4px_4px_0_#000]">
                    <label class="block text-black font-bold uppercase text-[9px] mb-1 italic">1. Selecciona a la persona</label>
                    <select id="select-activo" class="w-full bg-white border-4 border-black p-1 text-xs focus:outline-none focus:bg-[#ffffe0] font-mono cursor-pointer">
                        ${datosIntercambio.participantes.map(p => 
                            `<option value="${p.id}" ${p.id === idActivo ? 'selected' : ''}>${p.nombre}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="bg-white/60 p-2 border-4 border-black shadow-[4px_4px_0_#000] flex-grow flex flex-col min-h-0 overflow-hidden">
                    <label class="block text-black font-bold uppercase text-[9px] mb-2 text-center">2. Arrastra a la derecha ➔</label>
                    <div id="lista-disponibles" class="flex-grow overflow-y-auto overflow-x-hidden flex flex-col gap-2 p-1" style="scrollbar-width: thin;">
                        ${datosIntercambio.participantes
                            .filter(p => p.id !== idActivo && !pActivo.exclusiones.includes(p.id))
                            .map(p => `
                                <div class="papel-excluir shrink-0 bg-white border-2 border-black p-2 cursor-grab shadow-[2px_2px_0_#000] hover:bg-gray-200 font-bold text-[10px] uppercase truncate" 
                                    draggable="true" 
                                    data-id="${p.id}">
                                    📄 ${p.nombre}
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>

            <div class="mt-auto pt-2 border-t-4 border-black bg-[#f4ebd0] z-10 shrink-0">
                <button id="btn-regresar-pre" class="w-full px-4 py-1.5 bg-gray-400 text-black border-4 border-black font-bold uppercase hover:bg-gray-500 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all text-xs">Regresar</button>
            </div>
        `;

        pagDerecha.innerHTML = `
            <h2 class="text-xl font-bold border-b-4 border-black pb-1 mb-2 uppercase tracking-tighter text-center mt-1">Lista Negra</h2>
            
            <div id="interfaz-der" class="${exclusionesActivadas ? 'flex' : 'hidden'} flex-col flex-grow min-h-0 gap-2">
                <div class="bg-red-100 p-1.5 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-center shrink-0">
                    <p class="text-[9px] font-bold uppercase text-red-800 leading-none">
                        <span class="text-black block mb-1 truncate text-xs">${pActivo.nombre}</span> 
                        NO LE REGALARÁ A:
                    </p>
                </div>

                <div id="zona-drop-exclusiones" class="flex-grow border-4 border-dashed border-red-500 bg-white/50 p-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-0 relative transition-colors" style="scrollbar-width: thin;">
                    ${pActivo.exclusiones.length === 0 
                        ? '<div class="absolute inset-0 flex items-center justify-center opacity-40 text-[10px] uppercase font-bold text-center p-4">Suelta aquí</div>' 
                        : ''}
                    
                    ${pActivo.exclusiones.map(exId => {
                        const exP = datosIntercambio.participantes.find(p => p.id === exId);
                        return `
                            <div class="bg-red-500 text-white border-2 border-black p-1.5 shadow-[2px_2px_0_#000] font-bold text-[10px] uppercase flex justify-between items-center">
                                <span class="truncate">🚫 ${exP ? exP.nombre : 'Usuario'}</span>
                                <button class="btn-quitar-ex bg-white text-red-600 px-1.5 border-2 border-black font-black" data-id="${exId}">X</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div id="mensaje-vacio" class="${!exclusionesActivadas ? 'flex' : 'hidden'} flex-grow items-center justify-center border-4 border-black bg-white/50 p-4 text-center shadow-[inset_4px_4px_0_rgba(0,0,0,0.1)]">
                <p class="text-[10px] font-bold uppercase text-gray-500">Exclusiones desactivadas.<br><br>Todos participan contra todos libremente.</p>
            </div>

            <div class="mt-auto pt-2 border-t-4 border-black bg-[#f4ebd0] z-10 shrink-0">
                <button id="btn-finalizar-sorteo" class="w-full px-4 py-2 bg-[#facc15] text-black border-4 border-black font-bold uppercase tracking-widest text-xs shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all">¡Hacer Sorteo!</button>
            </div>
        `;

        configurarInteraccionesExclusiones();
    }

    function configurarInteraccionesExclusiones() {
        // Control del Checkbox
        document.getElementById('check-activar-exclusiones').addEventListener('change', (e) => {
            exclusionesActivadas = e.target.checked;
            
            // Si deciden no usar exclusiones, borramos todas las que habían hecho
            if (!exclusionesActivadas) {
                datosIntercambio.participantes.forEach(p => p.exclusiones = []);
                sincronizarDatos();
            }
            
            renderizarExclusiones(); // Redibujamos la pantalla con el nuevo estado
        });

        // Solo activamos los eventos del Drag & Drop si la interfaz está visible
        if (exclusionesActivadas) {
            // Cambio de pestaña
            document.getElementById('select-activo').addEventListener('change', (e) => {
                idActivo = e.target.value;
                renderizarExclusiones();
            });

            const dropzone = document.getElementById('zona-drop-exclusiones');

            // Configurar Draggables
            document.querySelectorAll('.papel-excluir').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', item.dataset.id);
                    item.classList.add('opacity-50');
                });
                item.addEventListener('dragend', () => item.classList.remove('opacity-50'));
            });

            // Configurar Dropzone
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('bg-red-200');
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('bg-red-200');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('bg-red-200');
                const idDrop = e.dataTransfer.getData('text/plain');
                const dador = datosIntercambio.participantes.find(p => p.id === idActivo);
                
                if (idDrop && !dador.exclusiones.includes(idDrop)) {
                    dador.exclusiones.push(idDrop);
                    sincronizarDatos();
                    renderizarExclusiones();
                }
            });

            // Botones para quitar exclusión
            document.querySelectorAll('.btn-quitar-ex').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const dador = datosIntercambio.participantes.find(p => p.id === idActivo);
                    const idAEliminar = btn.dataset.id;
                    dador.exclusiones = dador.exclusiones.filter(id => id !== idAEliminar);
                    sincronizarDatos();
                    renderizarExclusiones();
                });
            });
        }

        // Navegación y Botón Final (Siempre disponibles)
        document.getElementById('btn-regresar-pre').addEventListener('click', cargarPaginaPresupuesto);
        
        document.getElementById('btn-finalizar-sorteo').addEventListener('click', () => {
            const validacion = verificarConsistenciaReglas();

            // Si es posible hacemos el sorteo
            if (validacion.esPosible) {
                iniciarCeremoniaSorteo();
            } else {
                Swal.fire({
                    title: '¡Reglas Imposibles!',
                    text: validacion.mensaje,
                    icon: 'error',
                    background: '#f87171', 
                    color: '#ffffff', 
                    customClass: {
                        popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] font-mono',
                        confirmButton: 'bg-white text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all'
                    },
                    buttonsStyling: false
                });
            }
        });
    }

    renderizarExclusiones();
}

// Esta se la pedi a gemini, para manejar las exclusiones xd 
function verificarConsistenciaReglas() {
    const total = datosIntercambio.participantes.length;
    
    for (let p of datosIntercambio.participantes) {
        const cantidadExclusiones = p.exclusiones.length;
        const limiteMaximo = total - 2; 

        if (cantidadExclusiones > limiteMaximo) {
            return {
                esPosible: false,
                mensaje: `${p.nombre} ha excluido a demasiadas personas. No queda nadie disponible para asignarle.`
            };
        }
    }

    if (total === 2) {
        const p1 = datosIntercambio.participantes[0];
        const p2 = datosIntercambio.participantes[1];
        if (p1.exclusiones.includes(p2.id) || p2.exclusiones.includes(p1.id)) {
            return { esPosible: false, mensaje: "En un intercambio de 2 personas, no pueden excluirse entre sí." };
        }
    }

    return { esPosible: true };
}