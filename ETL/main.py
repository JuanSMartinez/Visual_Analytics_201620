# -*- coding: utf-8 -*-
import zipfile
import xml.etree.ElementTree as etree
from StringIO import StringIO
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import buses
import json
import glob

base_path = 'Data/'
pcontrol = '*/*/*/*/*/e-track-pcontrol-*.kmz'


def main():
    global  pcontrol
    for name in glob.glob(pcontrol):
        print name
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
        entry['Linea'] = buses.get_bus()
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
