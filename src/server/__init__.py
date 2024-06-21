from http.server import ThreadingHTTPServer
from .handler import Handler
from socket import gethostbyname, gethostname
from sys import platform
from ..util import module_path
import webbrowser

def start(addr, port):
    server = ThreadingHTTPServer((addr, port), Handler)

    if platform == "win32":
        from infi.systray import SysTrayIcon

        tray = SysTrayIcon(
            module_path("./src/client/favicon.ico"),
            "Stream It!",
            (
                (
                    "Open Manage Panel", 
                    None, 
                    lambda: webbrowser.open(
                        f"http://{server.server_address[0]}{server.server_address[1]}:/manage", 
                        new=0, 
                        autoraise=True
                    )
                ),
            ),
            on_quit=lambda t: server.shutdown()
        )
        tray.start()

    server.serve_forever()