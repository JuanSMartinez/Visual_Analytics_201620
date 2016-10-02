import os
import glob
import sys
import traceback as tb
import extractdata as ed

if __name__ == '__main__':
    os.chdir(sys.argv[1])
    for name in glob.glob('*/*/*/*/*/e-track-pcontrol-*.kmz'):
        try:
            for el in ed.process_control_point_info(name):
                print("insert into urb_tmp_cpoints ({}) values ({});".format(",".join(el.keys()), str(el.values()).strip('[]')))
        except:
            e = tb.format_exc()
            sys.stderr.write("ERROR:\n\t name:" + name + "\n\t error: " + e)
