# -*- coding: utf-8 -*-
import zipfile
import xml.etree.ElementTree as etree
from StringIO import StringIO
import numpy as np
#import matplotlib.pyplot as plt
#import seaborn as sns
import buses
import json
import glob
import os
import sys
import fnmatch
import re

base_path = 'Data/'
pcontrol = 'Data/*/*/*/*/e-track-pcontrol-*.kmz'


def main():
    global pcontrol
    matches = []
    for root, dirnames, filenames in os.walk('Data'):
        for filename in fnmatch.filter(filenames, 'e-track-pcontrol-*.kmz'):
            matches.append(os.path.join(root, filename))

    records = np.array([])
    i = 0
    for f in matches:
        i += 1
        print "Procesando archivo", i, "de", len(matches)
        records_kmz = read_kmz(f)
        formatted = format_speed_records(records_kmz)
        records = np.concatenate((records,formatted.tolist()))

    print 'Recuperados', len(records),"archivos utiles"
    print 'Generando JSON ...'
    final = open("buses_final.json", "wb")
    json.dump(records.tolist(), final)
    final.close()


    '''
    records = read_kmz('pcontrol.kmz')
    formatted = format_speed_records(records)
    string_array = formatted.tolist()
    f = open("buses.json","wb")
    json.dump(string_array, f)
    f.close()'''


def format_speed_records(records):
    formatted_records = np.array([])
    for r in records:
        entry = dict()
        #TODO: generacion aleatoria de lineas hasta poderlas encontrar en los datos
        #entry['Linea'] = buses.get_bus()
        try:
            entry['Linea'] = str(re.search(": ([0-9]+)", r['Recorrido']).group(1))
            entry['Dia'] = int(r["Fecha"].split("/")[0])
            entry['Mes'] = int(r["Fecha"].split("/")[1])
            entry['Anio'] = int(r["Fecha"].split("/")[2])
            #entry['Fecha'] = r["Fecha"]
            entry['Hora'] = int(r["Hora"].split(":")[0])
            entry['Minuto'] = int(r["Hora"].split(":")[1])
            entry['Segundo'] = int(r["Hora"].split(":")[2])
            entry['Velocidad'] = float(r["Velocidad"].rstrip("Km/h"))
            entry['Latitud'] = float(r["Lat"])
            entry['Longitud'] = float(r["Lon"])
            formatted_records = np.append(formatted_records, entry)
        except AttributeError:
            pass

    return formatted_records

def decompress(fname):
    zfile = zipfile.ZipFile(fname)
    kml_string = zfile.read(zfile.filelist[0].filename).decode('iso-8859-1').encode('utf-8')
    it = etree.iterparse(StringIO(kml_string))
    for _, el in it:
        if '}' in el.tag:
            el.tag = el.tag.split('}', 1)[1]  # strip all namespaces
    root = it.root
    return root

def read_kmz(fname):
    records = np.array([])
    kml = decompress(fname)
    for child in kml.iter('ExtendedData'):
        baseRecord = dict()
        for data in child:
            baseRecord[data.attrib['name']] = data.find("value").text
        records = np.append(records, baseRecord)
    return records

if __name__ == "__main__":
    main()
