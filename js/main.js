document.addEventListener('DOMContentLoaded', () => {
    const mesaTrigger = document.getElementById('mesa-trigger');
    const modalLibreta = document.getElementById('modal-libreta');
    const elLibro = document.getElementById('el-libro');
    
    // Elementos de la UI
    const triggerAbrir = document.getElementById('trigger-abrir');
    const elLapiz = document.getElementById('el-lapiz');
    const laFlecha = document.getElementById('la-flecha');
    const btnCerrar = document.getElementById('btn-cerrar');
    const btnSiguiente = document.getElementById('btn-siguiente'); // <- ¡Agregada para que no falle!
    
    let libroAbierto = false;

    // Libro brincando
    mesaTrigger.addEventListener('click', () => {
        modalLibreta.classList.remove('hidden');
        modalLibreta.classList.add('flex');
        
        elLibro.classList.add('animate-jump-pixel', 'cursor-pointer');
        elLibro.classList.remove('is-open');
        elLapiz.classList.remove('opacity-0');
        laFlecha.classList.remove('opacity-0');
        triggerAbrir.classList.remove('hidden');
        libroAbierto = false;

        setTimeout(() => modalLibreta.classList.remove('opacity-0'), 50);
    });

    // Abrir el libro.
    triggerAbrir.addEventListener('click', () => {
        if (libroAbierto) return;
        libroAbierto = true;

        triggerAbrir.classList.add('hidden');
        
        elLibro.classList.remove('animate-jump-pixel', 'cursor-pointer');
        
        elLapiz.classList.add('opacity-0');
        laFlecha.classList.add('opacity-0');

        elLibro.classList.add('is-open');
    });

    // Cerrar el modal
    btnCerrar.addEventListener('click', () => {
        elLibro.classList.remove('is-open');
        
        setTimeout(() => {
            modalLibreta.classList.add('opacity-0');
            setTimeout(() => {
                modalLibreta.classList.remove('flex');
                modalLibreta.classList.add('hidden');
            }, 500);
        }, 1200); 
    });
    
    btnSiguiente.addEventListener('click', () => {
        const inputNombreOrganizador = document.getElementById('nombre-organizador');
        const checkboxParticipa = document.getElementById('participa-organizador');
        
        const nombre = inputNombreOrganizador.value.trim();
        const participa = checkboxParticipa.checked;

        if (nombre === '') {
            alert('¡ERROR! INGRESA EL NOMBRE DEL ORGANIZADOR.');
            inputNombreOrganizador.focus();
            return;
        }

        cargarPaginaParticipantes(nombre, participa);
    });

    //Pagina de Participantes
    function cargarPaginaParticipantes(nombreOrganizador, organizadorParticipa) {
        const contenedorPagina = document.getElementById('contenido-pagina-derecha');

        contenedorPagina.innerHTML = `
            <h2 class="text-xl font-bold text-black mb-2 border-b-4 border-black pb-2 uppercase tracking-widest text-center">Participantes</h2>
            
            <div class="flex-grow flex flex-col gap-3 relative h-full mt-2">
                
                <div class="bg-white/60 p-3 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    <label class="block text-black font-bold uppercase text-[10px] mb-2">1. Escribe el nombre y 2. Arrastra el papel al vaso</label>
                    <div class="flex gap-2 items-center">
                        <input type="text" id="nuevo-participante" class="flex-grow bg-white border-4 border-black p-2 text-sm focus:outline-none focus:bg-[#ffffe0]" placeholder="Nombre...">
                        
                        <div id="papel-draggable" draggable="true" class="w-10 h-10 bg-white border-4 border-black flex items-center justify-center cursor-grab shadow-[2px_2px_0_#000] hover:bg-gray-200 active:cursor-grabbing text-xl" title="Arrástrame">
                            📄
                        </div>
                    </div>
                </div>

                <div class="flex-grow flex flex-col items-center justify-end pb-2 mt-4">
                    <div id="vaso-dropzone" class="w-32 h-40 bg-[#a0c4ff]/50 border-l-4 border-r-4 border-b-4 border-black rounded-b-xl relative flex flex-wrap-reverse content-start justify-center p-2 overflow-visible shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3)] transition-colors duration-200">
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 font-bold uppercase text-center text-xs tracking-widest">
                            SUELTA<br>EL<br>PAPEL AQUÍ
                        </div>
                        </div>
                </div>
                
            </div>
            
            <div class="flex justify-between mt-4 pt-4 border-t-4 border-black">
                <button id="btn-siguiente-fase" class="w-full px-4 py-2 bg-[#4ade80] text-black border-4 border-black font-bold uppercase hover:bg-[#22c55e] hover:translate-y-1 transition-transform shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none">Siguiente</button>
            </div>
        `;

        configurarDragAndDropVisual();

        // Papel del organizador
        if (organizadorParticipa) {
            setTimeout(() => {
                crearPapelitoVisual(nombreOrganizador);
            }, 600); 
        }
    }

    // Drag and Drop del vaso 
    function configurarDragAndDropVisual() {
        const inputNombre = document.getElementById('nuevo-participante');
        const papelDraggable = document.getElementById('papel-draggable');
        const vasoDropzone = document.getElementById('vaso-dropzone');

        papelDraggable.addEventListener('dragstart', (e) => {
            const nombre = inputNombre.value.trim();
            if (nombre === '') {
                e.preventDefault(); 
                alert("¡Escribe un nombre antes de arrastrar el papel!");
                inputNombre.focus();
                return;
            }
            e.dataTransfer.setData('text/plain', nombre);
            e.dataTransfer.effectAllowed = 'copy';
        });

        vasoDropzone.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            e.dataTransfer.dropEffect = 'copy';
            vasoDropzone.classList.add('vaso-dragover'); 
        });

        vasoDropzone.addEventListener('dragleave', () => {
            vasoDropzone.classList.remove('vaso-dragover');
        });

        vasoDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            vasoDropzone.classList.remove('vaso-dragover');

            const nombreRecibido = e.dataTransfer.getData('text/plain');
            crearPapelitoVisual(nombreRecibido);

            inputNombre.value = '';
            inputNombre.focus();
        });
    }

    // Crear el papelito
    function crearPapelitoVisual(nombre) {
        const vaso = document.getElementById('vaso-dropzone');
        const papel = document.createElement('div');
        
        const rotacion = Math.floor(Math.random() * 50) - 25;
        papel.style.setProperty('--rotacion-final', `${rotacion}deg`);
        
        papel.className = 'papel-arrugado animacion-caida absolute bottom-2 z-10';
        papel.textContent = nombre;

        vaso.appendChild(papel);
    }
});