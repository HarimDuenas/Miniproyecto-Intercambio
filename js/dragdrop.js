function dragandDropVaso() {
    const inputNombre = document.getElementById('nuevo-participante');
    const papelDraggable = document.getElementById('papel-draggable');
    let vasoViejo = document.getElementById('vaso-dropzone');
    
    let vasoDropzone = vasoViejo.cloneNode(true);
    vasoViejo.parentNode.replaceChild(vasoDropzone, vasoViejo);

    papelDraggable.addEventListener('dragstart', (e) => {
        const nombre = inputNombre.value.trim();
        if (nombre === '') {
            e.preventDefault(); 
            Swal.fire({
                title: 'Papelito vacío',
                text: '¡Escribe un nombre antes de arrastrar al vasito!',
                icon: 'warning',
                background: '#f4ebd0',
                customClass: {
                    popup: 'border-4 border-black rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] font-mono',
                    confirmButton: 'bg-[#facc15] text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,1)]'
                },
                buttonsStyling: false
            });
            return;
        }
        e.dataTransfer.setData('text/plain', nombre);
        papelDraggable.classList.add('opacity-50');
    });

    papelDraggable.addEventListener('dragend', () => papelDraggable.classList.remove('opacity-50'));
    
    vasoDropzone.addEventListener('dragover', (e) => { e.preventDefault(); vasoDropzone.classList.add('vaso-dragover'); });
    vasoDropzone.addEventListener('dragleave', () => vasoDropzone.classList.remove('vaso-dragover'));
    
    vasoDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        vasoDropzone.classList.remove('vaso-dragover');
        const nombre = e.dataTransfer.getData('text/plain');
        
        ultimoIdAsignado++; 
        const id = ultimoIdAsignado.toString(); 
        
        crearPapelito(nombre, id);
        agregarLista(nombre, id);
        inputNombre.value = '';
        inputNombre.focus();
    });
}

function crearPapelito(nombre, id) {
    const vaso = document.getElementById('vaso-dropzone');
    const papel = document.createElement('div');
    papel.style.setProperty('--rotacion-final', `${Math.floor(Math.random() * 50) - 25}deg`);
    papel.className = 'papel-arrugado animacion-caida absolute z-10';
    papel.textContent = nombre;
    papel.dataset.id = id; 
    vaso.appendChild(papel);
}

function agregarLista(nombre, id) {
    const lista = document.getElementById('lista-participantes');
    if(!lista) return;
    const li = document.createElement('li');
    li.className = "bg-white border-2 border-black p-1.5 sm:p-2 shadow-[2px_2px_0_#000] flex justify-between items-center transition-all duration-300";
    li.innerHTML = `<span class="truncate">✓ ${nombre}</span><button class="btn-eliminar text-red-600 font-extrabold px-2 border-2 border-red-600 rounded-sm">X</button>`;
    
    datosIntercambio.participantes.push({ id: id, nombre: nombre, exclusiones: [] });
    sincronizarDatos();

    li.querySelector('.btn-eliminar').addEventListener('click', () => {
        datosIntercambio.participantes = datosIntercambio.participantes.filter(p => p.id !== id);
        li.remove();
        sincronizarDatos();
        const papel = document.querySelector(`.papel-arrugado[data-id="${id}"]`);
        if (papel) {
            papel.classList.add('animacion-salida');
            setTimeout(() => papel.remove(), 500);
        }
    });
    lista.appendChild(li);
    lista.scrollTop = lista.scrollHeight;
}