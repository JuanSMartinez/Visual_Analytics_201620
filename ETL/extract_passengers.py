import os
import glob
import sys
import extractdata as ed

if __name__ == '__main__':
    os.chdir(sys.argv[1])
    for name in glob.glob('*/*/*/*/*/e-track-pas-*.kmz'):
        try:
            for el in ed.process_passenger_info(name):
                print("insert into urb_tmp_pass ({}) values ({});".format(",".join(el.keys()), str(el.values()).strip('[]')))
        except:
            e = sys.exc_info()[0]
            print("-- name:", name, " error: ", e)
