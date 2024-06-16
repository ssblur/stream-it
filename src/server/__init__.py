from http.server import ThreadingHTTPServer
from .handler import Handler
from socket import gethostbyname, gethostname

def start(addr, port):
    server = ThreadingHTTPServer((addr, port), Handler)
    server.serve_forever()