import logging
import os
import time
from threading import Thread

from pyzabbix import ZabbixAPI


def login_zabbix():
    """
    Login and Connect to Zabbix API
    """
    zapi = ZabbixAPI(os.getenv('ZABBIX_API'))
    zapi.login(api_token=os.getenv('API_TOKEN'))
    print("Connected to Zabbix API Version %s" % zapi.api_version())
    return zapi



