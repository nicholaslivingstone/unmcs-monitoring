import os
import time
from threading import Thread

from flask import Flask, render_template

from zabbix_util import *

B146_GROUPID = os.getenv("B146_GROUPID")
FE2065_GROUPID = os.getenv("FE2065_GROUPID")
REFRESH_TIME = 5    # How often to refresh API data in minutes

group_ids = {B146_GROUPID, FE2065_GROUPID}


app = Flask(__name__)
app.debug = True

zapi = login_zabbix()


@app.route('/')
def hello_world():
    b146_data = get_api_data(B146_GROUPID)
    fe2965_data = get_api_data(FE2065_GROUPID)

    print(b146_data)

    return render_template('index.html', hostData=b146_data)


def get_api_data(group_id):
    hosts = list()

    raw_host_data = zapi.host.get(output='extend', groupids=group_id)

    for host in raw_host_data:
        name = host['host']
        cpu_util = zapi.item.get(hostids=host['hostid'], tags=[{"tag": "API"}])[0]['lastvalue']
        cpu_util = round(float(cpu_util), 2)

        host_dict = {
            'name': name,
            'cpu_util': cpu_util
        }

        hosts.append(host_dict)

    hosts = sorted(hosts, key=lambda i: i['name'])

    return hosts


def thread_refresh_data():
    refresh = 60 * REFRESH_TIME
    start_time = time.time()
    while True:
        logging.info("Updating API Data")
        time.sleep(refresh - ((time.time() - start_time) % refresh))


if __name__ == '__main__':
    app.run()
