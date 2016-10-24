# -*- coding: utf-8 -*-
'''
Ejemplo de prueba con las líneas de bus
fuente: http://wiki.openstreetmap.org/wiki/Bah%C3%ADa_Blanca/transporte_publico
'''
import numpy as np


buses = ("500",
        "502",
        "503",
        "503 Prolongación Solares Norte / CONICET",
        "504",
        "504 Prolongación Paraje El Guanaco",
        "505",
        "505 Prolongación Balneario Maldonado",
        "506",
        "506 Prolongación Cementerio",
        "507",
        "507 Prolongación Barrio Espora (período escolar)",
        "507 Directo Harding Green",
        "509",
        "509 Prolongación Cementerio",
        "512",
        "513",
        "513 Prolongación Bº Viajantes del Sur y V. Hipodromo (rondín)",
        "514",
        "516",
        "517",
        "517 Prolongación Barrio Polo (período escolar)",
        "517 Prolongación Grünbein (período escolar)",
        "517 Prolongación Barrio 17 de Mayo (período escolar)",
        "517 Prolongación Villa Harding Green (período escolar)",
        "518",
        "519",
        "519 por Escuela Media Nº 7",
        "519A Aldea Romana",
        "519A Patagonia",
        "519A Prolongación Los Chañares Y V° Bordeu")


def get_bus():
    global buses
    index = np.random.random_integers(0,len(buses)-1)
    return buses[index]
