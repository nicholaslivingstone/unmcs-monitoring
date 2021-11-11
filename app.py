from threading import Timer
import logging
from flask import Flask, render_template, logging as flog
from zabbix_util import *


REFRESH_TIME = 5  # How often to refresh API data in minutes

app = Flask(__name__)
app.debug = True
flog.default_handler.setFormatter(logging.Formatter("%(asctime)s: %(message)s"))

@app.route('/')
def hello_world():
    return render_template('index.html', APIData=zapi.api_data)


class RepeatTimer(Timer):
    def run(self):
        while not self.finished.wait(self.interval):
            self.function(*self.args, **self.kwargs)

zapi = ZabbixLogin(app)
zapi.get_api_data()
RepeatTimer(60 * REFRESH_TIME, zapi.get_api_data).start()

if __name__ == '__main__':
    app.run()
