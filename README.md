# Generador de Direcciones para PrestaShop

## Descripción
Este módulo integra un generador de direcciones con nomenclatura en los formularios de dirección de PrestaShop. Facilita a los usuarios la creación de direcciones estandarizadas utilizando códigos de nomenclatura, especialmente útil para Colombia y otros países con sistemas de dirección complejos.

## Características
- Modal interactivo para generación de direcciones
- Selección de nomenclaturas predefinidas (AC, AD, AK, etc.)
- Botones para números, letras y caracteres especiales
- Integración transparente con los formularios de dirección de PrestaShop
- Personalizable mediante archivos CSV de nomenclatura

## Instalación
1. Copie la carpeta `direcciones_generator` en la carpeta `modules` de su instalación de PrestaShop
2. Vaya a "Módulos > Administrador de módulos" en el panel de administración
3. Encuentre "Generador de Direcciones" en la lista de módulos y haga clic en "Instalar"

## Configuración
El módulo viene preconfigurado con una lista de nomenclaturas comunes. Si desea modificar la lista, puede editar el archivo CSV en `modules/direcciones_generator/data/nomenclatura.csv`.

## Requisitos
- PrestaShop 1.7 o superior
- Bootstrap 5

## Uso
Una vez instalado, el campo de dirección (address1) en los formularios de dirección se vuelve de solo lectura y muestra el mensaje "Haga clic para generar la dirección". Al hacer clic en él, se abre un modal con todas las opciones para construir una dirección estandarizada.

## Compatibilidad
El módulo es compatible con los temas predeterminados de PrestaShop y con la mayoría de los temas personalizados que siguen la estructura estándar de los formularios de dirección.

## Soporte
Para obtener ayuda o informar problemas, contacte al soporte técnico.

## Licencia
Academic Free License (AFL 3.0)
