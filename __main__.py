import webbrowser
import socket
import sys
from src.server import start
from src.util import frozen

if __name__ == "__main__":
    if frozen():
        log_file = open("./latest.log", "w")
        sys.stdout = log_file
        sys.stderr = log_file

    # Generally we presume that any IP works.
    # If you need to bind to a specific IP, open a ticket and I'll add support.
    # But for now, just change ADDR to the address you want to bind to.
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    addr = s.getsockname()[0]
    s.close()

    ADDR = addr
    PORT = 18104

    webbrowser.open(f"http://{ADDR}:{PORT}/manage", new=0, autoraise=True)
    print("Started server.")
    print(f"Manage panel: http://{ADDR}:{PORT}/manage")
    start(ADDR, PORT)

    if frozen():
        log_file.close()