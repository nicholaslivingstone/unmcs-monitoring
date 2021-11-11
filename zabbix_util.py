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
                host_dict = {'name': host['host']}  # Save the name of the host

                # Get all the data for each item in the host with "API" tag
                host_data = self.login_instance.item.get(hostids=host['hostid'], tags=[{"tag": "API"}])

                # Iterate through each item attached to the host
                for item in host_data:
                    item_val = item['lastvalue']  # Last value of the item
                    host_dict[item['name']] = round(float(item_val), 2)  # Save the name of the item and it's value in
                    # the dictionary

                # Save the formatted dictionary
                group_data.append(host_dict)

            new_api_data[g['group_name']] = sorted(group_data, key=lambda i: i['name'])  # Sort the group when complete

        self.api_data = new_api_data
