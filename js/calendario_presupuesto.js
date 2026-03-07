let fechaActual = new Date(); 

function cargarPaginaPresupuesto() {
    const pagIzquierda = document.getElementById('pagina-izquierda');
    const pagDerecha = document.getElementById('pagina-derecha');
    const Libro = document.getElementById('el-libro');
    const vasoExterno = document.getElementById('vaso-externo');

    if (datosIntercambio.participantes.length < 2) {
        Swal.fire({
            title: 'Falta gente xd',
            text: '¡Debes agregar al menos 2 participantes para hacer un intercambio!',
            icon: 'error',
            background: '#f4ebd0',
            customClass: {
                popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] font-mono',
                confirmButton: 'bg-[#f87171] text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,1)]'
            },
            buttonsStyling: false
        });
        return;
    }

    // Oculta el vaso
    vasoExterno.classList.add('opacity-0');
    setTimeout(() => vasoExterno.classList.add('hidden'), 500);
    Libro.style.transform = ""; 

    pagIzquierda.innerHTML = `
        <h2 class="text-xl font-bold border-b-4 border-black pb-1 mb-3 text-center mt-2 uppercase">El Evento</h2>
        <div class="flex-grow flex flex-col gap-6">
            <div class="bg-white/60 p-4 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <label class="block font-bold uppercase text-[11px] mb-2">Motivo</label>
                <select id="motivo-intercambio" class="w-full bg-white border-4 border-black p-2 text-sm focus:outline-none focus:bg-[#ffffe0] font-mono cursor-pointer">
                    <option value="">Selecciona...</option>
                    <option value="Navidad">🎄 Navidad</option>
                    <option value="San Valentín">❤️ San Valentín</option>
                    <option value="Año Nuevo">🎇 Año Nuevo</option>
                    <option value="Otro">✨ Otro</option>
                </select>
            </div>
            <div class="bg-white/60 p-4 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] flex flex-col items-center">
                <label class="block font-bold uppercase text-[11px] mb-4">Fecha</label>
                <button id="btn-seleccionar-fecha" class="w-full bg-white border-4 border-black p-3 text-sm font-bold shadow-[4px_4px_0_rgba(0,0,0,1)] hover:bg-[#ffda75] transition-all uppercase">
                    SELECCIONAR FECHA 📅
                </button>
            </div>
        </div>
        <div class="mt-auto pt-3 border-t-4 border-black bg-[#f4ebd0] z-10">
            <button id="btn-regresar-a-participantes" class="w-full px-4 py-2 bg-gray-400 text-black border-4 border-black font-bold uppercase hover:bg-gray-500 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none">Regresar</button>
        </div>
    `;

    pagDerecha.innerHTML = `
        <h2 class="text-xl font-bold border-b-4 border-black pb-1 mb-3 text-center mt-2 uppercase">Presupuesto</h2>
        <div class="flex-grow flex flex-col gap-4 relative">
            <div class="bg-white/60 p-4 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-center">
                <label class="block font-bold uppercase text-[11px] mb-4">Monto Sugerido</label>
                <div class="grid grid-cols-2 gap-3 mb-2" id="botones-presupuesto">
                    <button class="btn-presup border-4 border-black bg-[#4ade80] py-2 font-bold shadow-[2px_2px_0_#000] transition-all" data-valor="100">$100</button>
                    <button class="btn-presup border-4 border-black bg-white py-2 font-bold shadow-[2px_2px_0_#000] transition-all" data-valor="200">$200</button>
                    <button class="btn-presup border-4 border-black bg-white py-2 font-bold shadow-[2px_2px_0_#000] transition-all" data-valor="500">$500</button>
                    <button class="btn-presup border-4 border-black bg-white py-2 font-bold shadow-[2px_2px_0_#000] transition-all" data-valor="0">Otro</button>
                </div>
                <input type="number" id="presupuesto-personalizado" class="w-full mt-3 bg-white border-4 border-black p-2 text-sm hidden font-mono" placeholder="Cantidad...">
            </div>
        </div>
        <div class="mt-auto pt-3 border-t-4 border-black bg-[#f4ebd0] z-10">
            <button id="btn-siguiente-exclusiones" class="w-full px-4 py-2 bg-[#4ade80] text-black border-4 border-black font-bold uppercase hover:bg-[#22c55e] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none">Siguiente</button>
        </div>
    `;

    // Autocompletamos los datos del evento si ya existen
    const ev = datosIntercambio.evento;

    // Autocompletamos motivo
    const selectMotivo = document.getElementById('motivo-intercambio');
    if(ev.tipo) {
        selectMotivo.value = ev.tipo;
    }

    // Autocompletamos fecha
    const btnFecha = document.getElementById('btn-seleccionar-fecha');
    if(ev.fecha) {
        const partesFecha = ev.fecha.split('-'); // Separamos la fecha de su formato YYYY-MM-DD
        if(partesFecha.length === 3) {
            const mesesStr = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            btnFecha.textContent = `${partesFecha[2]} de ${mesesStr[parseInt(partesFecha[1])-1]} del ${partesFecha[0]} 📅`;
            btnFecha.classList.add('bg-[#4ade80]');
        }
    }

    // Autocompletamos presupuesto
    if(ev.presupuesto > 0){
        const btnPresup = Array.from(document.querySelectorAll('.btn-presup')).find(b => parseInt(b.dataset.valor) === ev.presupuesto);;

        if(btnPresup && ev.presupuesto !== 0) {
            // Es un botón predefinido ($100, $200, $500)
            document.querySelectorAll('.btn-presup').forEach(b => { b.classList.remove('bg-[#4ade80]'); b.classList.add('bg-white'); });
            btnPresup.classList.replace('bg-white', 'bg-[#4ade80]');
        } else {
            // Es un presupuesto personalizado ("Otro")
            document.querySelectorAll('.btn-presup').forEach(b => { b.classList.remove('bg-[#4ade80]'); b.classList.add('bg-white'); });
            const btnOtro = Array.from(document.querySelectorAll('.btn-presup')).find(b => b.dataset.valor === "0");
            if (btnOtro) btnOtro.classList.replace('bg-white', 'bg-[#4ade80]');
            
            const inputP = document.getElementById('presupuesto-personalizado');
            inputP.value = ev.presupuesto;
            inputP.classList.remove('hidden');
        }
    }

    // Esto es por si selecciona de una fecha ya puesta
    selectMotivo.addEventListener('change', (e) => {
        const motivo = e.target.value;
        let fechaAuto = "";
        let textoBoton = "";

        if (motivo === "Navidad") {
            fechaAuto = "2026-12-25";
            textoBoton = "25 de Diciembre del 2026 🎄";
        } else if (motivo === "San Valentín") {
            fechaAuto = "2026-02-14";
            textoBoton = "14 de Febrero del 2026 ❤️";
        } else if (motivo === "Año Nuevo") {
            fechaAuto = "2027-01-01";
            textoBoton = "1 de Enero del 2026 🎇";
        }

        if (fechaAuto !== "") {
            datosIntercambio.evento.fecha = fechaAuto;
            btnFecha.textContent = textoBoton;
            btnFecha.classList.add('bg-[#4ade80]'); // Fondo verde éxito
        } else {
            btnFecha.textContent = "SELECCIONAR FECHA 📅";
            btnFecha.classList.remove('bg-[#4ade80]');
        }
        
        datosIntercambio.evento.tipo = motivo;
        sincronizarDatos();
    });

 
    // Botón Regresar
    document.getElementById('btn-regresar-a-participantes').addEventListener('click', () => {
        cargarPaginaParticipantes(datosIntercambio.organizador.nombre, datosIntercambio.organizador.participa);
    });

    // Presupuesto
    document.querySelectorAll('.btn-presup').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-presup').forEach(b => { b.classList.remove('bg-[#4ade80]'); b.classList.add('bg-white'); });
            e.target.classList.replace('bg-white', 'bg-[#4ade80]');
            const valor = e.target.dataset.valor;
            const input = document.getElementById('presupuesto-personalizado');
            if (valor === "0") {
                input.classList.remove('hidden');
                input.focus();
            } else {
                input.classList.add('hidden');
                datosIntercambio.evento.presupuesto = parseInt(valor);
            }
        });
    });

    // Abrir Calendario
    btnFecha.addEventListener('click', () => {
        Libro.classList.add('libro-alejado');
        const modalCal = document.getElementById('modal-calendario');
        const calPixel = document.getElementById('calendario-pixel');
        modalCal.classList.remove('hidden');
        modalCal.classList.add('flex');
        setTimeout(() => { modalCal.classList.remove('opacity-0'); calPixel.classList.replace('scale-75', 'scale-100'); }, 50);
        renderizarCalendario();
    });

    // Siguiente pantalla
    document.getElementById('btn-siguiente-exclusiones').addEventListener('click', () => {
        datosIntercambio.evento.tipo = selectMotivo.value;
        const inputP = document.getElementById('presupuesto-personalizado');
        if (!inputP.classList.contains('hidden')) datosIntercambio.evento.presupuesto = parseInt(inputP.value) || 0;
        sincronizarDatos();
        cargarPaginaExclusiones();
    });
}

// Funcion para el modal calendario
function renderizarCalendario() {
    const grid = document.getElementById('cal-dias');
    const titulo = document.getElementById('cal-mes-ano');
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    titulo.textContent = `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
    grid.innerHTML = ''; 

    const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
    const diasMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) grid.appendChild(Object.assign(document.createElement('div'), {className: 'dia-calendario vacio'}));

    for (let i = 1; i <= diasMes; i++) {
        const dia = Object.assign(document.createElement('div'), {className: 'dia-calendario', textContent: i});
        dia.addEventListener('click', () => {
            const mesesStr = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const fStr = `${i} de ${mesesStr[fechaActual.getMonth()]} del ${fechaActual.getFullYear()} 📅`;
            const btn = document.getElementById('btn-seleccionar-fecha');

            btn.textContent = fStr;
            btn.classList.add('bg-[#4ade80]');
            datosIntercambio.evento.fecha = `${fechaActual.getFullYear()}-${fechaActual.getMonth()+1}-${i}`;
            
            // Verificamos qué fecha eligió el usuario para cambiar el motivo
            const selectMotivo = document.getElementById('motivo-intercambio');
            const mesElegido = fechaActual.getMonth() + 1;
            
            if (mesElegido === 12 && i === 25) {
                selectMotivo.value = "Navidad";
                datosIntercambio.evento.tipo = "Navidad";
            } else if (mesElegido === 2 && i === 14) {
                selectMotivo.value = "San Valentín";
                datosIntercambio.evento.tipo = "San Valentín";
            } else if (mesElegido === 1 && i === 1) {
                selectMotivo.value = "Año Nuevo";
                datosIntercambio.evento.tipo = "Año Nuevo";
            } else {
                selectMotivo.value = "Otro";
                datosIntercambio.evento.tipo = "Otro";
            }
            
            // Guardamos los cambios en LocalStorage
            sincronizarDatos();
            
            cerrarCalendario();
        });
        grid.appendChild(dia);
    }
}

// Funcion para cerrar el modal del calendario
function cerrarCalendario() {
    const modalCal = document.getElementById('modal-calendario');
    const calPixel = document.getElementById('calendario-pixel');
    calPixel.classList.replace('scale-100', 'scale-75');
    modalCal.classList.add('opacity-0');
    document.getElementById('el-libro').classList.remove('libro-alejado');
    setTimeout(() => { modalCal.classList.replace('flex', 'hidden'); }, 500);
}