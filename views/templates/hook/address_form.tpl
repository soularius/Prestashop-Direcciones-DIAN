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
    
    function modifyAddressField() {
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
          // Solo configurar si no está configurado
          if (!addressInput.hasAttribute('data-direcciones-configured')) {
            console.log('Configurando campo:', addressInput);
            
            // Modificar el campo de dirección
            addressInput.setAttribute('readonly', 'readonly');
            addressInput.setAttribute('placeholder', 'Haga clic para generar la dirección');
            addressInput.classList.add('direcciones-generator-input');
            addressInput.setAttribute('data-direcciones-configured', 'true');
            
            // Agregar evento click para abrir el modal
            addressInput.addEventListener('click', function() {
              console.log('Click en campo de dirección');
              
              // Pasar el valor actual al input del modal
              var modalInput = document.getElementById('modal-direccion-input');
              if (modalInput) {
                modalInput.value = this.value;
                
                // Abrir el modal usando bootstrap 5
                try {
                  var modalElement = document.getElementById('direccionModal');
                  var direccionModal = new bootstrap.Modal(modalElement);
                  direccionModal.show();
                  console.log('Modal abierto con Bootstrap 5');
                } catch (e) {
                  // Alternativa para bootstrap 4
                  try {
                    $('#direccionModal').modal('show');
                    console.log('Modal abierto con Bootstrap 4/jQuery');
                  } catch (e2) {
                    console.error('Error al abrir modal:', e2);
                    
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
            });
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
  });
</script>
