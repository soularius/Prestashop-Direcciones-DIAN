/**
 * Módulo Generador de Direcciones - JavaScript
 *
 * @author    Yined Molina
 * @copyright 2025
 * @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

// Variables globales y configuración
var direccionesGenerator = {
    debug: true,
    log: function(msg) {
        if (this.debug) console.log('[DireccionesGenerator]', msg);
    },
    // Estado de inicialización global
    initialized: false,
    // Flag para controlar si hay una inicialización en curso
    initializingFields: false,
    // Última vez que se ejecutó la inicialización
    lastInitTime: 0,
    // Tiempo mínimo entre reinicios en ms
    minInitInterval: 1000,
    // Flag para seguir actualizaciones de país
    countryChanged: false,
    // Timestamp de último cambio de país
    lastCountryChangeTime: 0
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
    
    // Configurar la detección de cambio de país de forma global
    configurarDetectorCambioPais();
    
    // Simplificado: La detección se basa únicamente en MutationObserver y reinicios programados
    // La verificación periódica se ha eliminado para evitar sobrecarga del sistema
});

// Función para detectar cambios de país a nivel global
function configurarDetectorCambioPais() {
    direccionesGenerator.log('Configurando detector global de cambios de país');
    
    // Posibles selectores para el selector de país
    const countrySelectors = [
        'select.form-control.js-country',        // Selector específico del usuario
        'select.js-country',                    // Variación
        'select[name="id_country"]',            // Por nombre
        '#id_country',                          // Por ID
        'select.form-control[name*="country"]',  // Cualquier select con country
        'select[data-address-type="id_country"]' // Por data attribute
    ];
    
    // Configurar observador para detectar nuevos selectores de país
    const countryObserver = new MutationObserver(function() {
        // Buscar los selectores de país y configurarlos
        countrySelectors.forEach(function(selector) {
            const countryElements = document.querySelectorAll(selector);
            if (countryElements.length > 0) {
                countryElements.forEach(function(element) {
                    // Solo configurar si no está configurado
                    if (!element.hasAttribute('data-direcciones-country-watcher')) {
                        element.setAttribute('data-direcciones-country-watcher', 'true');
                        direccionesGenerator.log('Detector de país configurado en:', element);
                        
                        // Guardar valor original
                        element.dataset.originalCountry = element.value;
                        
                        // Configurar detector de cambios
                        element.addEventListener('change', function() {
                            direccionesGenerator.log('¡CAMBIO DE PAÍS DETECTADO!');
                            direccionesGenerator.countryChanged = true;
                            direccionesGenerator.lastCountryChangeTime = Date.now();
                            
                            // Programar múltiples intentos de reinicialización
                            [500, 1000, 1500, 2000, 3000, 5000].forEach(function(delay) {
                                setTimeout(function() {
                                    direccionesGenerator.log('Intentando reinicializar campos después de ' + delay + 'ms');
                                    configurarCamposDireccion(true);
                                }, delay);
                            });
                        });
                    }
                });
            }
        });
    });
    
    // Iniciar la observación del DOM
    countryObserver.observe(document.body, { childList: true, subtree: true });
    
    // También buscar ahora
    countrySelectors.forEach(function(selector) {
        const countryElements = document.querySelectorAll(selector);
        if (countryElements.length > 0) {
            countryElements.forEach(function(element) {
                // Solo configurar si no está configurado
                if (!element.hasAttribute('data-direcciones-country-watcher')) {
                    element.setAttribute('data-direcciones-country-watcher', 'true');
                    direccionesGenerator.log('* Detector de país configurado en:', element);
                    
                    // Guardar valor original
                    element.dataset.originalCountry = element.value;
                    
                    // Configurar detector de cambios
                    element.addEventListener('change', function() {
                        direccionesGenerator.log('¡CAMBIO DE PAÍS DETECTADO!');
                        direccionesGenerator.countryChanged = true;
                        direccionesGenerator.lastCountryChangeTime = Date.now();
                        
                        // Programar múltiples intentos de reinicialización
                        [500, 1000, 1500, 2000, 3000, 5000].forEach(function(delay) {
                            setTimeout(function() {
                                direccionesGenerator.log('Intentando reinicializar campos después de ' + delay + 'ms');
                                configurarCamposDireccion(true);
                            }, delay);
                        });
                    });
                }
            });
        }
    });
}

// Función para configurar campos de dirección (puede llamarse varias veces)
function configurarCamposDireccion(forceReinit) {
    // Prevenir múltiples inicializaciones muy seguidas
    var now = Date.now();
    if (direccionesGenerator.initializingFields && (now - direccionesGenerator.lastInitTime) < 500) {
        direccionesGenerator.log('Inicialización ignorada: demasiado cerca de la anterior');
        return false;
    }
    
    // Si no hay cambio de país y no se fuerza la reinicialización, y la última inicialización fue hace poco,
    // saltamos esta ejecución para evitar sobrecarga
    if (!direccionesGenerator.countryChanged && !forceReinit && 
        (now - direccionesGenerator.lastInitTime) < direccionesGenerator.minInitInterval) {
        return false;
    }
    
    // Marcar como en proceso de inicialización
    direccionesGenerator.initializingFields = true;
    direccionesGenerator.lastInitTime = now;
    
    direccionesGenerator.log('Configurando campos de dirección...', forceReinit ? '(forzado)' : '');
    
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
    
    // Recorrer cada selector y buscar campos de dirección
    selectores.forEach(function(selector) {
        var inputs = document.querySelectorAll(selector);
        if (inputs.length > 0) {
            addressInputsFound = true;
            
            // Configurar cada campo encontrado
            inputs.forEach(function(input) {
                var needsConfiguration = forceReinit || !input.hasAttribute('data-direcciones-generator-configured');
                
                if (needsConfiguration) {
                    direccionesGenerator.log('Configurando campo de dirección:', input, forceReinit ? '(reinicialización forzada)' : '');
                    
                    // Si ya tiene un controlador de eventos, eliminarlo antes de agregar uno nuevo
                    if (input._direccionesClickHandler && forceReinit) {
                        input.removeEventListener('click', input._direccionesClickHandler);
                        direccionesGenerator.log('Evento click anterior removido');
                    }
                    
                    // Modificar el campo de dirección
                    input.setAttribute('readonly', 'readonly');
                    input.setAttribute('placeholder', 'Haga clic para generar la dirección');
                    input.classList.add('direcciones-generator-input');
                    input.setAttribute('data-direcciones-generator-configured', 'true');
                    
                    // Definir función de click que muestra el modal
                    function direccionesClickHandler() {
                        direccionesGenerator.log('Click en campo de dirección');
                        
                        // Pasar el valor actual al input del modal
                        var modalInput = document.getElementById('modal-direccion-input');
                        if (modalInput) {
                            modalInput.value = this.value;
                            
                            // Guardar referencia al campo original
                            modalInput.dataset.targetInput = this.name || this.id;
                            
                            // Intentar abrir el modal con jQuery primero (más fiable en PrestaShop)
                            if (typeof $ !== 'undefined' && typeof $.fn.modal === 'function') {
                                try {
                                    $('#direccionModal').modal('show');
                                    direccionesGenerator.log('Modal abierto con jQuery/Bootstrap');
                                    return; // Terminamos aquí si fue exitoso
                                } catch (e) {
                                    direccionesGenerator.log('Error al abrir modal con jQuery:', e);
                                }
                            }
                            
                            // Intentar con Bootstrap 5
                            try {
                                var modalElement = document.getElementById('direccionModal');
                                
                                if (typeof bootstrap !== 'undefined' && typeof bootstrap.Modal === 'function') {
                                    var modal = new bootstrap.Modal(modalElement);
                                    modal.show();
                                    direccionesGenerator.log('Modal abierto con Bootstrap 5');
                                    return;
                                } else {
                                    direccionesGenerator.log('Bootstrap no está disponible');
                                }
                            } catch (e) {
                                direccionesGenerator.log('Error al abrir modal con Bootstrap 5:', e);
                            }
                            
                            // Último recurso: mostrar manualmente
                            try {
                                var modalElement = document.getElementById('direccionModal');
                                if (modalElement) {
                                    modalElement.style.display = 'block';
                                    modalElement.classList.add('show');
                                    document.body.classList.add('modal-open');
                                    direccionesGenerator.log('Modal abierto manualmente');
                                }
                            } catch (e3) {
                                direccionesGenerator.log('Todos los intentos de abrir modal fallaron:', e3);
                            }
                        } else {
                            direccionesGenerator.log('Error: modal-direccion-input no encontrado');
                        }
                    }
                    
                    // Guardar la referencia a la función para poder eliminarla luego
                    input._direccionesClickHandler = direccionesClickHandler;
                    
                    // Asignar el evento click
                    input.addEventListener('click', direccionesClickHandler);
                }
            });
        }
    });
    
    // Reportar resultados
    if (addressInputsFound) {
        direccionesGenerator.log('Campos de dirección configurados correctamente');
    } else {
        direccionesGenerator.log('No se encontraron campos de dirección');
    }
    
    // Marcar inicialización como completada
    direccionesGenerator.initializingFields = false;
    
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
