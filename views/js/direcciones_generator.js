/**
 * Módulo Generador de Direcciones - JavaScript
 *
 * @author    Yined Molina
 * @copyright 2025
 * @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

// Variable global para depuración
var direccionesGenerator = {
    debug: true,
    log: function(msg) {
        if (this.debug) console.log('[DireccionesGenerator]', msg);
    }
};

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    direccionesGenerator.log('DOM cargado, iniciando configuración...');
    
    // Intentar inicializar inmediatamente y luego volver a intentar si es necesario
    if (!inicializarGenerador()) {
        direccionesGenerator.log('Configurando intervalo para buscar elementos...');
        const modalCheckInterval = setInterval(function() {
            if (inicializarGenerador()) {
                direccionesGenerator.log('Inicialización exitosa en intervalo');
                clearInterval(modalCheckInterval);
            }
        }, 500);
    }
    
    // También buscar y configurar campos de dirección
    configurarCamposDireccion();
});

// Función para configurar campos de dirección (puede llamarse varias veces)
function configurarCamposDireccion() {
    direccionesGenerator.log('Configurando campos de dirección...');
    
    // Buscar campos de dirección con múltiples selectores para mayor compatibilidad
    var selectores = [
        'input[name="address1"]',
        '.js-address-form input[name="address1"]',
        '#address_address1',
        '#address1',
        'input[id*="address1"]',
        'input[data-address-type="address1"]'
    ];
    
    var addressInputsFound = false;
    
    // Probar cada selector
    selectores.forEach(function(selector) {
        var addressInputs = document.querySelectorAll(selector);
        if (addressInputs.length > 0) {
            direccionesGenerator.log('Campo de dirección encontrado con selector: ' + selector);
            addressInputsFound = true;
            
            addressInputs.forEach(function(addressInput) {
                // Comprobar si ya está configurado
                if (addressInput.hasAttribute('data-direcciones-configured')) {
                    return;
                }
                
                // Marcar como configurado
                addressInput.setAttribute('data-direcciones-configured', 'true');
                
                // Aplicar estilos y atributos
                addressInput.setAttribute('readonly', 'readonly');
                addressInput.setAttribute('placeholder', 'Haga clic para generar la dirección');
                addressInput.classList.add('direcciones-generator-input');
                
                // Agregar evento click para abrir el modal
                addressInput.addEventListener('click', function() {
                    openDireccionModal(this);
                });
                
                direccionesGenerator.log('Campo configurado con éxito: ' + addressInput.name);
            });
        }
    });
    
    return addressInputsFound;
}

// Función para abrir el modal
function openDireccionModal(inputField) {
    direccionesGenerator.log('Intentando abrir modal...');
    
    var modalDireccionInput = document.getElementById('modal-direccion-input');
    var direccionModal = document.getElementById('direccionModal');
    
    if (modalDireccionInput && direccionModal) {
        // Transferir el valor actual al input del modal
        modalDireccionInput.value = inputField.value;
        modalDireccionInput.dataset.targetInput = inputField.name || inputField.id;
        
        // Intentar abrir el modal con diferentes métodos
        try {
            // Bootstrap 5
            direccionesGenerator.log('Intentando abrir con Bootstrap 5');
            var modal = new bootstrap.Modal(direccionModal);
            modal.show();
        } catch (e) {
            try {
                // Bootstrap 4/jQuery
                direccionesGenerator.log('Intentando abrir con jQuery');
                $(direccionModal).modal('show');
            } catch (e2) {
                // Método manual
                direccionesGenerator.log('Intentando abrir manualmente');
                direccionModal.style.display = 'block';
                direccionModal.classList.add('show');
                document.body.classList.add('modal-open');
                
                // Crear backdrop si no existe
                var backdrop = document.querySelector('.modal-backdrop');
                if (!backdrop) {
                    backdrop = document.createElement('div');
                    backdrop.className = 'modal-backdrop fade show';
                    document.body.appendChild(backdrop);
                }
            }
        }
    } else {
        direccionesGenerator.log('Error: Modal o input no encontrado');
        alert('Error: No se pudo abrir el generador de direcciones. Contacte al administrador.');
    }
}

// Variable para rastrear si ya se inicializó
let direccionesGeneratorInitialized = false;

// Función principal para inicializar el generador de direcciones
function inicializarGenerador() {
        // Si ya se ha inicializado, no hacerlo de nuevo
        if (direccionesGeneratorInitialized) {
            direccionesGenerator.log('El generador ya fue inicializado anteriormente');
            return true;
        }
        
        const modalDireccionInput = document.getElementById('modal-direccion-input');
        const btnAplicar = document.getElementById('btn-aplicar');
        const btnBackspace = document.getElementById('btn-backspace');
        const btnClear = document.getElementById('btn-clear');
        const btnCancelar = document.getElementById('btn-cancelar');
        const btnClose = document.querySelector('#direccionModal .btn-close');
        
        // Verificar que los elementos necesarios existan
        if (!modalDireccionInput || !btnAplicar || !btnBackspace || !btnClear) {
            direccionesGenerator.log('Error: No se encontraron todos los elementos necesarios para inicializar');
            return false; // Inicialización no exitosa (elementos no encontrados)
        }
        
        // Función para cerrar el modal con soporte para diferentes versiones de Bootstrap
        function closeDireccionModal() {
            try {
                // Bootstrap 5
                const modalElement = document.getElementById('direccionModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                    return;
                }
                
                // Bootstrap 4/jQuery
                if (typeof $ !== 'undefined' && typeof $.fn.modal === 'function') {
                    $(modalElement).modal('hide');
                    return;
                }
                
                // Método manual como fallback
                modalElement.style.display = 'none';
                modalElement.classList.remove('show');
                document.body.classList.remove('modal-open');
                
                // Eliminar backdrop
                var backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            } catch (e) {
                direccionesGenerator.log('Error al cerrar modal: ' + e);
                
                // Intento de cierre manual como fallback final
                const modalElement = document.getElementById('direccionModal');
                if (modalElement) {
                    modalElement.style.display = 'none';
                    modalElement.classList.remove('show');
                    document.body.classList.remove('modal-open');
                    
                    // Eliminar backdrop
                    var backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.parentNode.removeChild(backdrop);
                    }
                }
            }
        }
        
        // Aplicar el texto del input del modal al input externo
        btnAplicar.addEventListener('click', function() {
            direccionesGenerator.log('Aplicando valor al campo de dirección...');
            
            // Obtener el target input del dataset
            var targetInputSelector = modalDireccionInput.dataset.targetInput || 'address1';
            
            // Intentar encontrar el input objetivo de varias maneras
            var targetInput = null;
            
            // Por ID o nombre
            if (targetInputSelector) {
                targetInput = document.getElementById(targetInputSelector) || 
                             document.querySelector(`[name="${targetInputSelector}"]`);
            }
            
            // Si no se encontró, intentar otras formas
            if (!targetInput) {
                targetInput = document.getElementById('address1') ||
                             document.querySelector('[name="address1"]') ||
                             document.querySelector('.js-address1') ||
                             document.querySelector('#delivery_address1') ||
                             document.querySelector('#invoice_address1');
            }
            
            if (targetInput) {
                // Asignar el valor
                targetInput.value = modalDireccionInput.value;
                direccionesGenerator.log('Valor aplicado con éxito');
                
                // Disparar evento de cambio para activar cualquier validación
                try {
                    var event = new Event('change', { bubbles: true });
                    targetInput.dispatchEvent(event);
                    
                    var inputEvent = new Event('input', { bubbles: true });
                    targetInput.dispatchEvent(inputEvent);
                    
                    // También para jQuery si está disponible
                    if (typeof jQuery !== 'undefined') {
                        jQuery(targetInput).trigger('change').trigger('input');
                    }
                } catch (e) {
                    direccionesGenerator.log('Error al disparar evento: ' + e);
                }
            } else {
                direccionesGenerator.log('Error: No se encontró el campo de dirección');
                alert('Error: No se pudo aplicar la dirección. Por favor, inténtelo de nuevo.');
            }
            
            // Cerrar el modal
            closeDireccionModal();
        });
        
        // Botón de retroceso (borrar último carácter)
        btnBackspace.addEventListener('click', function() {
            modalDireccionInput.value = modalDireccionInput.value.slice(0, -1);
            modalDireccionInput.focus();
        });
        
        // Botón para limpiar todo
        btnClear.addEventListener('click', function() {
            modalDireccionInput.value = '';
            modalDireccionInput.focus();
        });
        
        // Configurar el buscador de nomenclatura
        const buscarNomenclatura = document.getElementById('buscar-nomenclatura');
        if (buscarNomenclatura) {
            buscarNomenclatura.addEventListener('input', function() {
                filtrarNomenclatura(this.value.toLowerCase());
            });
            
            // Función para filtrar nomenclatura
            function filtrarNomenclatura(texto) {
                direccionesGenerator.log('Filtrando nomenclatura: ' + texto);
                
                document.querySelectorAll('.btn-nomenclatura').forEach(btn => {
                    const codigo = btn.getAttribute('data-codigo').toLowerCase();
                    const descripcion = btn.getAttribute('data-descripcion').toLowerCase();
                    
                    if (codigo.includes(texto) || descripcion.includes(texto)) {
                        btn.classList.remove('oculto');
                    } else {
                        btn.classList.add('oculto');
                    }
                });
            }
        } else {
            direccionesGenerator.log('Error: Buscador de nomenclatura no encontrado');
        }
        
        // Configurar eventos para botones de nomenclatura
        document.querySelectorAll('.btn-nomenclatura').forEach(btn => {
            btn.addEventListener('click', function() {
                insertarNomenclatura(this.getAttribute('data-codigo'), this.getAttribute('data-descripcion'));
            });
        });
        
        // Configurar eventos para botones de números
        document.querySelectorAll('.btn-num').forEach(btn => {
            btn.addEventListener('click', function() {
                insertarTexto(this.getAttribute('data-value'));
            });
        });
        
        // Configurar eventos para botones de letras
        document.querySelectorAll('.btn-letra').forEach(btn => {
            btn.addEventListener('click', function() {
                insertarTexto(this.getAttribute('data-value'));
            });
        });
        
        // Configurar eventos para botones de caracteres especiales
        document.querySelectorAll('.btn-caracter').forEach(btn => {
            btn.addEventListener('click', function() {
                insertarTexto(this.getAttribute('data-value'));
            });
        });
        
        // Configurar eventos para los botones de cerrar y cancelar
        if (btnCancelar) {
            btnCancelar.addEventListener('click', function() {
                direccionesGenerator.log('Botón cancelar presionado');
                closeDireccionModal();
            });
        } else {
            direccionesGenerator.log('Advertencia: Botón cancelar no encontrado');
        }
        
        if (btnClose) {
            btnClose.addEventListener('click', function() {
                direccionesGenerator.log('Botón cerrar (X) presionado');
                closeDireccionModal();
            });
        } else {
            direccionesGenerator.log('Advertencia: Botón cerrar (X) no encontrado');
        }
        
        // Función para insertar nomenclatura en el input
        function insertarNomenclatura(codigo, descripcion) {
            // Insertar el código de nomenclatura + espacio
            modalDireccionInput.value += codigo + ' ';
            modalDireccionInput.focus();
            
            // Resaltar el botón seleccionado temporalmente
            const btnSeleccionado = document.querySelector(`[data-codigo="${codigo}"]`);
            if (btnSeleccionado) {
                btnSeleccionado.classList.add('active');
                setTimeout(() => {
                    btnSeleccionado.classList.remove('active');
                }, 300);
            }
        }
        
        // Función para insertar texto en la posición del cursor
        function insertarTexto(texto) {
            modalDireccionInput.value += texto;
            modalDireccionInput.focus();
        }
        
        // Marcar como inicializado para evitar duplicados
        direccionesGeneratorInitialized = true;
        direccionesGenerator.log('Generador de direcciones inicializado correctamente');
        
        return true; // Indicar que la inicialización fue exitosa
}

// Auto-inicializar el generador con reintentos para mayor compatibilidad
var direccionesInitAttempts = 0;
var maxDireccionesInitAttempts = 10;

// Rastreador global para evitar múltiples intentos en el mismo ciclo
var inicializacionEnProceso = false;

function intentarInicializarGenerador() {
    // Evitar inicializaciones múltiples simultáneas
    if (inicializacionEnProceso || direccionesGeneratorInitialized) {
        direccionesGenerator.log('Inicialización ya en proceso o completada');
        return;
    }
    
    inicializacionEnProceso = true;
    console.log('Intento de inicialización #' + (direccionesInitAttempts + 1));
    var result = inicializarGenerador();
    
    if (result) {
        console.log('Generador de direcciones inicializado correctamente');
        // Ya no necesitamos más intentos
        inicializacionEnProceso = false;
    } else if (direccionesInitAttempts < maxDireccionesInitAttempts) {
        direccionesInitAttempts++;
        inicializacionEnProceso = false; // Permitir el próximo intento
        setTimeout(intentarInicializarGenerador, 1000); // Reintentar cada segundo
        console.log('Reintentando inicialización... (' + direccionesInitAttempts + '/' + maxDireccionesInitAttempts + ')');
    } else {
        inicializacionEnProceso = false;
        console.error('No se pudo inicializar el generador después de ' + maxDireccionesInitAttempts + ' intentos');
    }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para asegurarnos de que todos los componentes estén cargados
    setTimeout(intentarInicializarGenerador, 500);
});
