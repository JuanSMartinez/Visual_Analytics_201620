import zipfile
import xml.etree.ElementTree as etree
from StringIO import StringIO
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

fname = "pcontrol.kmz"

def main():
    records = read_kmz()
    plot_speed(records)

def plot_speed(records):
    v = np.array([])
    x = np.array([i for i in xrange(len(records))])
    for r in records:
        v = np.append(v, float(r["Velocidad"].rstrip("Km/h")))
    plt.scatter(x,v)
    plt.show()
def decompress():
    global fname
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

def read_kmz():
    records = np.array([])
    kml = decompress()
    print kml.tag
    for child in kml.iter('ExtendedData'):
        baseRecord = dict()
        for data in child:
            baseRecord[data.attrib['name']] = data.find("value").text
        records = np.append(records, baseRecord)
    return records

if __name__ == "__main__":
    main()
