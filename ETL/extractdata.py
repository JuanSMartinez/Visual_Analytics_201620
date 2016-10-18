import os
import glob
import zipfile

from pykml import parser
from lxml import etree

from pprint import pprint


def read_kmz(fname):
    zfile = zipfile.ZipFile(fname)
    kml_string = zfile.read(zfile.filelist[0].filename).decode('iso-8859-1').encode('utf-8')

    root = parser.fromstring(kml_string)
    return root


def process_passenger_info(name):
    company, year, month, day_number, hour, filename = name.split('/')
    vehicle_number = filename.split('-')[-1].split('.')[0]
    baseRecord = {
        "company" : company,
        "year" : year,
        "month": month,
        "day_number": day_number,
        "hour": hour,
        "vehicle_number": vehicle_number
    }

    kml = read_kmz(name)

    returnData = []
    currentRecord = dict(baseRecord)

    try:
        extdata = kml.Document.Folder.Folder.Placemark.ExtendedData
    except AttributeError:
        currentRecord['error'] = 'NO PLACEMARK'
        returnData.append(currentRecord)
        return returnData

    for d in extdata.getchildren():
        currentRecord[d.attrib['name']] = d.getchildren()[0]

    returnData.append(currentRecord)

    return returnData

"""
This file holds how many passengers got up to the unit in the lat-long and date-time specified
"""
def process_passangers_info():
    data = []
    for name in glob.glob('*/*/*/*/*/e-track-pas-*.kmz'):
        data += process_passenger_info(name)

    return data


def process_control_point_info(name):
    company, year, month, day_number, hour, filename = name.split('/')
    vehicle_number = filename.split('-')[-1].split('.')[0]
    baseRecord = {
        "company" : company,
        "year" : year,
        "month": month,
        "day_number": day_number,
        "hour": hour,
        "vehicle_number": vehicle_number
    }

    returnData = []
    currentRecord = dict(baseRecord)

    kml = read_kmz(name)
    try:
        extdata = kml.Document.Folder.Folder.Placemark.ExtendedData
    except AttributeError:
        currentRecord['error'] = 'NO PLACEMARK'
        returnData.append(currentRecord)
        return returnData

    for d in extdata.getchildren():
        currentRecord[d.attrib['name']] = d.getchildren()[0]

    returnData.append(currentRecord)

    return returnData


def process_stop_point_info(name):
    company, year, month, day_number, hour, filename = name.split('/')
    vehicle_number = filename.split('-')[-1].split('.')[0]
    baseRecord = {
        "company" : company,
        "year" : year,
        "month": month,
        "day_number": day_number,
        "hour": hour,
        "vehicle_number": vehicle_number
    }

    returnData = []
    currentRecord = dict(baseRecord)

    kml = read_kmz(name)
    try:
        extdata = kml.Document.Folder.Folder.Placemark.ExtendedData
    except AttributeError:
        currentRecord['error'] = 'NO PLACEMARK'
        returnData.append(currentRecord)
        return returnData

    # print etree.tostring(extdata, pretty_print=True)

    for d in extdata.getchildren():
        if (len(d.getchildren()) > 0):
            currentRecord[d.attrib['name']] = d.getchildren()[0]
        else:
            currentRecord[d.attrib['name']] = None

    returnData.append(currentRecord)

    return returnData


"""
Where the unit was on each datetime
"""
def process_control_points_info():
    data = []
    for name in glob.glob('*/*/*/*/*/e-track-pcontrol-*.kmz'):
        data += process_control_point_info(name)

    return data


"""
When the vehicle stops, it sends the information on where it stoped, and how much time it has stopped.
"""
def process_stop_points_info():
    data = []
    for name in glob.glob('*/*/*/*/*/e-track-stop-*.kmz'):
        data += process_stop_point_info(name)

    return data


if __name__ == '__main__':
    os.chdir('./Data')
    print("stops: ")
    pprint(process_stop_points_info())
    print("control points: ")
    pprint(process_control_points_info())
    print("passangers: ")
    pprint(process_passangers_info())
    print("*** END ***")
