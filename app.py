import os
import time
from threading import Thread

from flask import Flask, render_template

from zabbix_util import *

REFRESH_TIME = 5  # How often to refresh API data in minutes



app = Flask(__name__)
app.debug = True

zapi = ZabbixLogin()


@app.route('/')
def hello_world():
    zapi.get_api_data()

    print(zapi.api_data[0])

    return render_template('index.html', hostData=zapi.api_data[0])


def thread_refresh_data():
    refresh = 60 * REFRESH_TIME
    start_time = time.time()
    while True:
        logging.info("Updating API Data")
        time.sleep(refresh - ((time.time() - start_time) % refresh))


if __name__ == '__main__':
    app.run()
