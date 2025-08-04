/**
 * Script de diagnóstico para el módulo Generador de Direcciones
 * 
 * @author    Yined Molina
 * @copyright 2025
 * @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DIAGNÓSTICO MÓDULO GENERADOR DE DIRECCIONES ===');
    
    // Comprobar si el modal existe
    var modal = document.getElementById('direccionModal');
    console.log('Modal encontrado:', modal ? 'SÍ' : 'NO');
    
    // Comprobar si los inputs existen
    var selectores = [
        'input[name="address1"]',
        '.js-address-form input[name="address1"]',
        '#address_address1',
        '#address1',
        'input[id*="address1"]',
        'input[data-address-type="address1"]'
    ];
    
    console.log('Buscando campo de dirección con selectores:');
    selectores.forEach(function(selector) {
        var elementos = document.querySelectorAll(selector);
        console.log('- Selector "' + selector + '": ' + elementos.length + ' elementos encontrados');
        if (elementos.length > 0) {
            console.log('  * Primer elemento:', elementos[0].outerHTML);
        }
    });
    
    // Comprobar botones de nomenclatura
    var btnNomenclatura = document.querySelectorAll('.btn-nomenclatura');
    console.log('Botones de nomenclatura encontrados:', btnNomenclatura.length);
    
    // Comprobar si jQuery está disponible
    console.log('jQuery disponible:', typeof jQuery !== 'undefined' ? 'SÍ' : 'NO');
    
    // Comprobar si Bootstrap está disponible
    console.log('Bootstrap disponible:', typeof bootstrap !== 'undefined' ? 'SÍ' : 'NO');
    
    console.log('===============================================');
});
