function cargarPaginaParticipantes(nombreOrganizador, organizadorParticipa) {
    const pagIzquierda = document.getElementById('pagina-izquierda');
    const pagDerecha = document.getElementById('pagina-derecha');
    
    const contenedorLibro = document.getElementById('contenedor-libro'); 
    const vasoExterno = document.getElementById('vaso-externo');

    const msj = document.getElementById('mensaje-ritual');
    if (msj) msj.remove();

    contenedorLibro.classList.add('-translate-y-[25vh]', 'lg:translate-y-0', 'lg:-translate-x-[18vw]');
    
    vasoExterno.classList.remove('hidden');
    setTimeout(() => vasoExterno.classList.remove('opacity-0'), 300);

    pagIzquierda.innerHTML = `
        <h2 class="text-lg sm:text-xl font-bold border-b-4 border-black pb-1 mb-2 sm:mb-3 text-center mt-1 sm:mt-2 uppercase">AGREGAR</h2>
        <div class="flex-grow flex flex-col justify-center gap-2 sm:gap-4">
            <div class="bg-white/60 p-2 sm:p-4 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-center">
                <p class="text-[9px] sm:text-[10px] font-bold uppercase mb-1 sm:mb-2">1. Escribe el nombre</p>
                <input type="text" id="nuevo-participante" class="w-full bg-white border-4 border-black p-1.5 sm:p-2 text-xs sm:text-sm focus:outline-none mb-3 sm:mb-4 text-center" placeholder="Nombre...">
                <p class="text-[9px] sm:text-[10px] font-bold uppercase mb-1 sm:mb-2">2. Arrastra al vasito ➔</p>
                <div id="papel-draggable" draggable="true" class="w-12 h-12 sm:w-16 sm:h-16 bg-white border-4 border-black flex items-center justify-center cursor-grab shadow-[4px_4px_0_#000] hover:bg-gray-200 text-2xl sm:text-3xl mx-auto transition-transform hover:scale-105">📄</div>
            </div>
        </div>
        <div class="mt-auto pt-2 sm:pt-3 border-t-4 border-black bg-[#f4ebd0] z-10">
            <button id="btn-regresar-organizador" class="w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-400 text-black border-4 border-black font-bold uppercase hover:bg-gray-500 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-[10px] sm:text-xs">Regresar</button>
        </div>
    `;

    pagDerecha.innerHTML = `
        <h2 class="text-lg sm:text-xl font-bold border-b-4 border-black pb-1 mb-2 sm:mb-3 text-center mt-1 sm:mt-2 uppercase">LISTA</h2>
        <div class="flex-grow flex flex-col min-h-0 relative">
            <ul id="lista-participantes" class="flex-grow overflow-y-auto overflow-x-hidden pr-1 pb-1 font-mono text-xs sm:text-sm font-bold uppercase flex flex-col gap-1.5" style="scrollbar-width: thin;"></ul>
        </div>
        <div class="mt-auto pt-2 sm:pt-3 border-t-4 border-black bg-[#f4ebd0] z-10">
            <button id="btn-siguiente-fase" class="w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-[#4ade80] text-black border-4 border-black font-bold uppercase hover:bg-[#22c55e] text-[10px] sm:text-xs">Siguiente</button>
        </div>
    `;

    // Limpiamos el vaso para que los papelitos no se vean dobles si regresa
    document.getElementById('vaso-dropzone').querySelectorAll('.papel-arrugado').forEach(p => p.remove());
    
    // Si regresamos de calendario/presupuesto, ponemos lo que ya estaba con la lista y todo
    if (datosIntercambio.participantes.length > 0) {
        const copiaSorteo = [...datosIntercambio.participantes];
        datosIntercambio.participantes = []; 
        copiaSorteo.forEach(p => {
            crearPapelito(p.nombre, p.id);
            agregarLista(p.nombre, p.id);
        });
    } else if (organizadorParticipa) {
        ultimoIdAsignado++; 
        const idOrg = ultimoIdAsignado.toString();
        crearPapelito(nombreOrganizador, idOrg);
        agregarLista(nombreOrganizador, idOrg);
    }

    // Drag an drop del vaso
    dragandDropVaso();

    // Evento de salir y cancelar
    document.getElementById('btn-regresar-organizador').addEventListener('click', () => {
        vasoExterno.classList.add('opacity-0');
        setTimeout(() => vasoExterno.classList.add('hidden'), 500);

        // Limpiamos las clases de Tailwind
        contenedorLibro.classList.remove('-translate-y-[25vh]', 'lg:translate-y-0', 'lg:-translate-x-[18vw]');

        pagIzquierda.innerHTML = htmlIzquierdaOriginal;
        pagDerecha.innerHTML = htmlDerechaOriginal;

        datosIntercambio.participantes = [];
        ultimoIdAsignado = 0;
        document.getElementById('vaso-dropzone').querySelectorAll('.papel-arrugado').forEach(p => p.remove());
        activarEventosOrganizador();
    });

    // Evento de Siguiente
    document.getElementById('btn-siguiente-fase').addEventListener('click', () => {
        // Limpiamos las clases de Tailwind
        contenedorLibro.classList.remove('-translate-y-[25vh]', 'lg:translate-y-0', 'lg:-translate-x-[18vw]');
        cargarPaginaPresupuesto();
    });
}