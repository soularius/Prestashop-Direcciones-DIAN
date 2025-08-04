{*
* Módulo Generador de Direcciones
*
* @author    Yined Molina
* @copyright 2025
* @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*}

<!-- Modal para el generador de direcciones -->
<div class="modal fade" id="direccionModal" tabindex="-1" aria-labelledby="direccionModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-white" id="direccionModalLabel">Generador de Direcciones</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- Input dentro de la modal -->
        <div class="form-group mb-3">
          <label for="modal-direccion-input">Dirección:</label>
          <input type="text" id="modal-direccion-input" class="form-control" placeholder="Generador de direcciones" disabled>
        </div>
        
        <!-- Nomenclatura -->
        <div class="nomenclatura-container mb-4">
          <h6>Nomenclatura</h6>
          <div id="nomenclatura-buttons" class="nomenclatura-grid">
            {foreach from=$nomenclatura item=item}
              <button class="btn btn-outline-secondary btn-nomenclatura" 
                      data-codigo="{$item.codigo}" 
                      data-descripcion="{$item.descripcion}">
                <span class="codigo">{$item.codigo}</span> {$item.descripcion}
              </button>
            {/foreach}
          </div>
        </div>
        
        <!-- Números -->
        <div class="numeros-container mb-4">
          <h6>Números</h6>
          <div class="numeros-grid">
            <button class="btn btn-outline-secondary btn-num" data-value="1">1</button>
            <button class="btn btn-outline-secondary btn-num" data-value="2">2</button>
            <button class="btn btn-outline-secondary btn-num" data-value="3">3</button>
            <button class="btn btn-outline-secondary btn-num" data-value="4">4</button>
            <button class="btn btn-outline-secondary btn-num" data-value="5">5</button>
            <button class="btn btn-outline-secondary btn-num" data-value="6">6</button>
            <button class="btn btn-outline-secondary btn-num" data-value="7">7</button>
            <button class="btn btn-outline-secondary btn-num" data-value="8">8</button>
            <button class="btn btn-outline-secondary btn-num" data-value="9">9</button>
            <button class="btn btn-outline-secondary btn-num" data-value="0">0</button>
          </div>
        </div>
        
        <!-- Letras -->
        <div class="letras-container">
          <h6>Letras</h6>
          <div class="letras-grid">
            <button class="btn btn-outline-secondary btn-letra" data-value="A">A</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="B">B</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="C">C</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="D">D</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="E">E</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="F">F</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="G">G</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="H">H</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="I">I</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="J">J</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="K">K</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="L">L</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="M">M</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="N">N</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="O">O</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="P">P</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="Q">Q</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="R">R</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="S">S</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="T">T</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="U">U</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="V">V</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="W">W</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="X">X</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="Y">Y</button>
            <button class="btn btn-outline-secondary btn-letra" data-value="Z">Z</button>
          </div>
        </div>
        
        <!-- Caracteres especiales -->
        <div class="especiales-container mt-4">
          <div class="caracteres-grid">
            <button class="btn btn-outline-secondary btn-caracter" data-value=" ">Espacio</button>
            <button class="btn btn-outline-secondary btn-caracter" data-value="-">-</button>
            <button class="btn btn-outline-secondary btn-caracter" data-value="#">#</button>
            <button class="btn btn-outline-secondary btn-caracter" data-value=".">.</button>
            <button class="btn btn-outline-secondary btn-borrar" id="btn-backspace">⌫</button>
            <button class="btn btn-outline-danger btn-borrar" id="btn-clear">Limpiar</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="btn-cancelar">Cancelar</button>
        <button type="button" class="btn btn-primary" id="btn-aplicar">Aplicar</button>
      </div>
    </div>
  </div>
</div>
