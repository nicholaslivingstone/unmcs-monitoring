import logging
import os
import time
from threading import Thread

from pyzabbix import ZabbixAPI


class ZabbixLogin():
    def __init__(self):
        # Login and Connect to Zabbix API
        self.login_instance = ZabbixAPI(os.getenv('ZABBIX_API'))
        self.login_instance.login(api_token=os.getenv('API_TOKEN'))
        print("Connected to Zabbix API Version %s" % self.login_instance.api_version())

        # Initialize Data
        self.api_data = None

    def get_api_data(self, group_id):
        hosts = list()

        raw_host_data = self.login_instance.host.get(output='extend', groupids=group_id)

        for host in raw_host_data:
            name = host['host']
            cpu_util = self.login_instance.item.get(hostids=host['hostid'], tags=[{"tag": "API"}])[0]['lastvalue']
            cpu_util = round(float(cpu_util), 2)

            host_dict = {
                'name': name,
                'cpu_util': cpu_util
            }

            hosts.append(host_dict)

        self.api_data = sorted(hosts, key=lambda i: i['name'])


