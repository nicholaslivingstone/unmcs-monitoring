import os

from pyzabbix import ZabbixAPI


class ZabbixLogin():
    def __init__(self, app):
        self.app = app
        # Login and Connect to Zabbix API
        self.login_instance = ZabbixAPI(os.getenv('ZABBIX_API'))
        self.login_instance.login(api_token=os.getenv('API_TOKEN'))
        self.app.logger.info("Connected to Zabbix API Version %s" % self.login_instance.api_version())

        # Initialize Data
        self.api_data = None
        self.groups = [
            {
                "group_name": "B146",
                "group_id": os.getenv("B146_GROUPID")
            },
            {
                "group_name": "FE2065",
                "group_id": os.getenv("FE2065_GROUPID")
            }
        ]

    def get_api_data(self):
        self.app.logger.info("Getting Latest data from Zabbix")
        new_api_data = {}

        for g in self.groups:
            group_data = list()

            raw_host_data = self.login_instance.host.get(output='extend', groupids=g['group_id'])

            for host in raw_host_data:
                name = host['host']
                cpu_util = self.login_instance.item.get(hostids=host['hostid'], tags=[{"tag": "API"}])[0]['lastvalue']
                cpu_util = round(float(cpu_util), 2)

                host_dict = {
                    'name': name,
                    'cpu_util': cpu_util
                }

                group_data.append(host_dict)

            new_api_data[g['group_name']] = sorted(group_data, key=lambda i: i['name'])

        self.api_data = new_api_data
