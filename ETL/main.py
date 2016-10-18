import zipfile
import xml.etree.ElementTree as etree
from StringIO import StringIO
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

base_path = 'Data/'
pcontrol = 'e-track-pcontrol-'
pas = 'e-track-pas-'


def main():
    records = read_kmz('pcontrol.kmz')
    for r in records:
        print r
    fomatted = format_speed_records(records)

def format_speed_records(records):
    formatted_records = np.array([])
    for r in records:
        entry = dict()
        entry['Dia'] = int(r["Fecha"].split("/")[0])
        entry['Mes'] = int(r["Fecha"].split("/")[1])
        entry['Anio'] = int(r["Fecha"].split("/")[2])
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
    #kml_string = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://earth.google.com/kml/2.2"><Document name="aja"><name>Example</name><Folder><Folder>F</Folder></Folder></Document></kml>'
    #kml_string = '<?xml version="1.0" encoding="UTF-8"?><kml><Document name="aja"><name>Example</name><Folder><Folder>F</Folder></Folder></Document></kml>'
    kml_string = zfile.read(zfile.filelist[0].filename).decode('iso-8859-1').encode('utf-8')
    it = etree.iterparse(StringIO(kml_string))
    for _, el in it:
        if '}' in el.tag:
            el.tag = el.tag.split('}', 1)[1]  # strip all namespaces
    root = it.root
    #root = etree.fromstring(kml_string)
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
