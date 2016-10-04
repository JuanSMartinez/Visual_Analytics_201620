# Visualización para datos probeta en Buses de la ciudad de Bahía Blanca, Argentina.
## Mario Varón
## Juan Sebastián Martínez
## Universidad de los Andes, segundo semestre de 2016

### Descripción
La municipalidad de la ciudad de Bahía Blanca, Argentina, ha recopilado información sobre el recorrido de sus buses de transporte público desde el año 2010 hasta el año 2016. Con esta información, resulta interesante para los analistas del transporte urbano el estudio del comportamiento de estos buses en sus recorridos diarios, así como el perfilamiento del tráfico de los usuarios del sistema de transporte masivo.

Con esto en mente, la información sobre el recorrido de los buses en cuanto a su posición, velocidad, rumbo, pasajeros, y otras variables, pretende ser visualizada para cumplir con los siguientes objetivos:

1. Visualizar la información descriptiva de tráfico obtenida de los datos probeta con el fin de obtener medidas de desempeño del tráfico(i.e tiempo de viaje o costo de viaje) que permitan construir un sistema ATIS (Sistemas de Información de Tráfico avanzado al viajero).
2. Visualizar la información del APC  (Automatic Passenger Counting System) con el fin de optimizar el costo de operación de los buses públicos en la ciudad de Bahía Blanca.
3. Preprocesar y Tratar los datos para obtener medidas estadísticas poblacionales que permitan caracterizar el comportamiento de los buses y en menor medida, del tráfico en la ciudad de Bahía Blanca.
4. Derivar métricas que permitan caracterizar el comportamiento del tráfico de personas alrededor de la ciudad durante el día.

Para mayor información sobre el proyecto, diríjase a consltar la [propuesta.](https://github.com/JuanSMartinez/Visual_Analytics_201620/tree/master/Documentos)

### Caracterización de visualizaciones

#### What:

Datos geográficos (geometry-spatial)  con varios atributos cuantitativos secuenciales, entre esos velocidad de desplazamiento, cantidad de pasajeros, distancia recorrida, rumbos y estado del vehículo clasificados por datos categóricos, como la placa del bus.  

#### Why:

1.	Descubrir la distribución de los datos de velocidad de desplazamiento por franja horaria.
2.	Explorar los Outliers de velocidad para identificar eventos de congestión no recurrente.
3.	Identificar las rutas de los buses por franja horaria.
4.	Descubrir las características de los datos de pasajeros clasificados por bus.

#### How:

Para las Tareas 1, 2 y 3: Map con formas (shapes) que usan la geometría de los datos y representen las magnitudes de velocidad de desplazamiento a través de las rutas de los buses.
Para la Tarea 4: HeatMaps geográficos que representen las densidades de tráfico de pasajeros durante el día.

### Colaboración
El proyecto se desarrolla con la colaboración de Claudio Delrieux y Rodrigo René Cura, quienes proporcionaron los datos de tráfico en el transporte público de la ciudad.

### URL del curso

Este proyecto se desarrolla bajo el marco del curso de maestría "Visual Analytics" de la Universidad de los Andes, la página oficial del curso se encuentra en el siguiente [link](http://johnguerra.co/classes/isis_4822_fall_2016/)
