<?php
/**
 * Módulo Generador de Direcciones
 *
 * @author    Cascade AI
 * @copyright 2025
 * @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

class Direcciones_Generator extends Module
{
    public function __construct()
    {
        $this->name = 'direcciones_generator';
        $this->tab = 'front_office_features';
        $this->version = '1.0.0';
        $this->author = 'Yined Molina';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = array('min' => '1.7', 'max' => _PS_VERSION_);
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Generador de Direcciones');
        $this->description = $this->l('Permite generar direcciones usando nomenclaturas, letras y números mediante una interfaz amigable');
        $this->confirmUninstall = $this->l('¿Estás seguro de que quieres desinstalar este módulo?');
    }

    /**
     * Instalación del módulo
     */
    public function install()
    {
        return parent::install() &&
            $this->registerHook('displayCustomerAddressForm') &&
            $this->registerHook('displayHeader') &&
            $this->registerHook('displayFooter');
    }

    /**
     * Desinstalación del módulo
     */
    public function uninstall()
    {
        return parent::uninstall();
    }

    /**
     * Hook para añadir CSS y JS al header
     */
    public function hookDisplayHeader()
    {
        // Cargar en todas las páginas para mayor compatibilidad
        $this->context->controller->addJS($this->_path . 'views/js/direcciones_generator.js');
        $this->context->controller->addCSS($this->_path . 'views/css/direcciones_generator.css');
        
        // Agregar script de diagnóstico para depuración
        if (_PS_MODE_DEV_) {
            $this->context->controller->addJS($this->_path . 'views/js/diagnostico.js');
        }
        
        // Agregar variables JS para el módulo
        Media::addJsDef([
            'direcciones_generator' => [
                'module_path' => $this->_path,
                'debug' => (bool)_PS_MODE_DEV_
            ]
        ]);

        return '';
    }

    /**
     * Hook para añadir el modal al footer
     */
    public function hookDisplayFooter()
    {
        // Cargamos la nomenclatura desde el archivo CSV
        $nomenclatura = $this->cargarNomenclatura();

        $this->context->smarty->assign([
            'nomenclatura' => $nomenclatura
        ]);

        return $this->display(__FILE__, 'views/templates/hook/footer.tpl');
    }

    /**
     * Hook para modificar el formulario de dirección
     */
    public function hookDisplayCustomerAddressForm($params)
    {
        return $this->display(__FILE__, 'views/templates/hook/address_form.tpl');
    }

    /**
     * Carga la nomenclatura desde el archivo CSV
     */
    private function cargarNomenclatura()
    {
        $nomenclatura = [];
        $csvFile = _PS_MODULE_DIR_ . $this->name . '/data/nomenclatura.csv';

        if (file_exists($csvFile)) {
            if (($handle = fopen($csvFile, "r")) !== false) {
                // Saltamos la primera línea (encabezados)
                fgetcsv($handle, 1000, ",");

                while (($data = fgetcsv($handle, 1000, ",")) !== false) {
                    if (isset($data[0]) && isset($data[1])) {
                        $nomenclatura[] = [
                            'codigo' => trim($data[0]),
                            'descripcion' => trim($data[1])
                        ];
                    }
                }
                fclose($handle);
            }
        }

        return $nomenclatura;
    }
}
