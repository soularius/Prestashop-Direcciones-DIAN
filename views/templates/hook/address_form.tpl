{*
* Módulo Generador de Direcciones
*
* @author    Yined Molina
* @copyright 2025
* @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*}

<style>
  .direcciones-generator-input {
    cursor: pointer !important;
    background-color: #f8f9fa !important;
  }
</style>

<script>
  // Método directo para modificar el campo cuando el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', function() {
    // Intentar varias veces modificar el campo (puede que tarde en cargarse)
    var attempts = 0;
    var maxAttempts = 20;
    var mutationObserverActive = false;
    
    // Agregar escuchadores para el cambio de país
    function listenForCountryChanges() {
      // Posibles selectores para el selector de país
      const countrySelectors = [
        'select.form-control.js-country',  // El selector específico que mencionaste
        'select.js-country',              // Variación de la clase js-country
        'select[name="id_country"]',       // Selector por nombre
        '#id_country',                    // Selector por ID
        'select.form-control[name*="country"]', // Cualquier select con country en el nombre
        'select[data-address-type="id_country"]' // Por data-attribute
      ];
      
      // Intentar encontrar y configurar el selector de país
      countrySelectors.forEach(selector => {
        const countrySelect = document.querySelectorAll(selector);
        if (countrySelect.length > 0) {
          countrySelect.forEach(select => {
            // Evitar configurar múltiples veces el mismo selector
            if (!select.hasAttribute('data-direcciones-country-listener')) {
              console.log('Configurando escuchador para cambio de país en:', select);
              
              // Marcar como configurado
              select.setAttribute('data-direcciones-country-listener', 'true');
              
              // Guardar el estado actual antes del cambio de país
              var countryBeforeChange = select.value;
              
              // Agregar evento para cuando cambia el país
              select.addEventListener('change', function() {
                console.log('País cambiado, configurando observador para detectar actualización del formulario...');
                
                // Marcar con timestamp para saber que el país cambió recientemente
                window.countryChangedTimestamp = Date.now();
                
                // Configurar MutationObserver específico para detectar cuando termina la actualización del formulario
                var formUpdateObserver = new MutationObserver(function(mutations) {
                  // Verificar si ha pasado suficiente tiempo desde el cambio de país (al menos 500ms)
                  if (window.countryChangedTimestamp && (Date.now() - window.countryChangedTimestamp > 500)) {
                    console.log('Detectada actualización del DOM después del cambio de país');
                    
                    // Detener este observador específico
                    formUpdateObserver.disconnect();
                    
                    // Programar múltiples intentos de reinicialización para mayor seguridad
                    for (var delay = 100; delay <= 2000; delay += 300) {
                      setTimeout(function() {
                        console.log('Intento de reinicialización después de POST, delay:', delay);
                        modifyAddressField(true); // true = forzar reinicialización
                      }, delay);
                    }
                    
                    // Limpiar el timestamp
                    window.countryChangedTimestamp = null;
                  }
                });
                
                // Comenzar a observar cambios en el documento
                formUpdateObserver.observe(document.body, { 
                  childList: true, 
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['class', 'style', 'disabled']
                });
                
                // También programar reinicialización después de un tiempo fijo como respaldo
                setTimeout(function() {
                  console.log('Ejecutando reinicialización programada después del cambio de país');
                  modifyAddressField(true);
                }, 1500);
              });
            }
          });
        }
      });
    }
    
    function modifyAddressField(forceReinit = false) {
      // Array con posibles selectores para mayor compatibilidad
      var selectores = [
        'input[name="address1"]',
        '.js-address-form input[name="address1"]',
        '#address_address1',
        '#address1',
        'input[id*="address1"]',
        'input[data-address-type="address1"]'
      ];
      
      var addressInputs = [];
      
      // Probar cada selector y combinar resultados
      selectores.forEach(function(selector) {
        var encontrados = document.querySelectorAll(selector);
        if (encontrados.length > 0) {
          Array.prototype.forEach.call(encontrados, function(elemento) {
            // Evitar duplicados
            if (addressInputs.indexOf(elemento) === -1) {
              addressInputs.push(elemento);
            }
          });
        }
      });
      
      if (addressInputs.length > 0) {
        // Éxito: Encontramos el campo
        console.log('Campo de dirección encontrado y modificado (' + addressInputs.length + ' campos)');
        
        addressInputs.forEach(function(addressInput) {
          // Configurar si no está configurado o si estamos forzando la reinicialización
          if (!addressInput.hasAttribute('data-direcciones-configured') || forceReinit) {
            console.log('Configurando campo:', addressInput, forceReinit ? '(forzado)' : '');
            
            // Si ya existe un evento click, eliminarlo antes de agregar uno nuevo
            if (forceReinit && addressInput._direccionesClickHandler) {
              addressInput.removeEventListener('click', addressInput._direccionesClickHandler);
              console.log('Evento click anterior removido');
            }
            
            // Modificar el campo de dirección
            addressInput.setAttribute('readonly', 'readonly');
            addressInput.setAttribute('placeholder', 'Haga clic para generar la dirección');
            addressInput.classList.add('direcciones-generator-input');
            addressInput.setAttribute('data-direcciones-configured', 'true');
            
            // Definir la función de click
            function direccionesClickHandler() {
              console.log('Click en campo de dirección');
              
              // Pasar el valor actual al input del modal
              var modalInput = document.getElementById('modal-direccion-input');
              if (modalInput) {
                modalInput.value = this.value;
                modalInput.dataset.targetInput = this.name || this.id;
                
                // Intentar con jQuery primero (más fiable en PrestaShop)
                if (typeof $ !== 'undefined' && typeof $.fn.modal === 'function') {
                  try {
                    $('#direccionModal').modal('show');
                    console.log('Modal abierto con jQuery/Bootstrap');
                    return; // Terminamos aquí si fue exitoso
                  } catch (e) {
                    console.log('Error al abrir modal con jQuery:', e);
                    // Continuamos con otros métodos
                  }
                }
                
                // Intentar con Bootstrap 5 (global)
                try {
                  var modalElement = document.getElementById('direccionModal');
                  
                  // Verificar si bootstrap está definido
                  if (typeof bootstrap !== 'undefined' && typeof bootstrap.Modal === 'function') {
                    var modal = new bootstrap.Modal(modalElement);
                    modal.show();
                    console.log('Modal abierto con Bootstrap 5');
                    return; // Terminamos aquí si fue exitoso
                  } else {
                    console.log('Bootstrap no está definido globalmente');
                  }
                } catch (e) {
                    console.error('Error al abrir modal:', e);
                    
                    // Último recurso: mostrar manualmente
                    try {
                      var modalElement = document.getElementById('direccionModal');
                      if (modalElement) {
                        modalElement.style.display = 'block';
                        modalElement.classList.add('show');
                        document.body.classList.add('modal-open');
                        console.log('Modal abierto manualmente');
                      }
                    } catch (e3) {
                      console.error('Todos los intentos de abrir modal fallaron');
                    }
                  }
                }
              } else {
                console.error('Modal input not found');
              }
            }
            
            // Guardar la referencia a la función para poder eliminarla luego si es necesario
            addressInput._direccionesClickHandler = direccionesClickHandler;
            
            // Agregar evento click para abrir el modal
            addressInput.addEventListener('click', direccionesClickHandler);
          }
        });
        
        // Configurar observador de mutaciones si no está activo
        if (!mutationObserverActive) {
          configurarObservador();
          mutationObserverActive = true;
        }
        
        return true;
      } else if (attempts < maxAttempts) {
        // Reintentamos en 500ms
        attempts++;
        setTimeout(modifyAddressField, 500);
        return false;
      } else {
        console.error('No se encontró el campo de dirección después de ' + maxAttempts + ' intentos');
        
        // Aún así, configurar el observador por si aparece más tarde
        if (!mutationObserverActive) {
          configurarObservador();
          mutationObserverActive = true;
        }
        
        return false;
      }
    }
    
    // Función para observar cambios en el DOM y aplicar modificaciones si aparecen nuevos campos
    function configurarObservador() {
      if (!window.MutationObserver) {
        return false;
      }
      
      var observador = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // Comprobar si alguno de los nodos añadidos es un campo address1 o contiene uno
            for (var i = 0; i < mutation.addedNodes.length; i++) {
              var nodo = mutation.addedNodes[i];
              if (nodo.nodeType === 1) { // Elemento
                // Buscar dentro del nodo
                var inputs = nodo.querySelectorAll('input[name="address1"]');
                if (inputs.length > 0) {
                  console.log('Campo de dirección detectado por el observador, reconfigurando...');
                  modifyAddressField();
                  break;
                }
                // Comprobar si el propio nodo es un input address1
                if (nodo.tagName === 'INPUT' && nodo.getAttribute('name') === 'address1') {
                  console.log('Input address1 detectado directamente, reconfigurando...');
                  modifyAddressField();
                  break;
                }
              }
            }
          }
        });
      });
      
      // Observar todo el body por cambios en la estructura del DOM
      observador.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      console.log('Observador de mutaciones configurado');
      return true;
    }
    
    // Iniciar el proceso de modificación
    modifyAddressField();
    
    // Configurar detector de cambios de país
    listenForCountryChanges();
    
    // También revisar periódicamente cambios en el campo de país
    // (por si se agrega después de la carga inicial)
    setInterval(function() {
      listenForCountryChanges();
    }, 3000);
  });
</script>
