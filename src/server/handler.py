from http.server import BaseHTTPRequestHandler
from functools import cached_property
from urllib.parse import parse_qsl, urlparse
from os.path import commonprefix, realpath, join, pathsep, exists
from os import getcwd, mkdir
from mimetypes import guess_type
from json import loads, load, dump, dumps
from uuid import uuid4
import re
from http.cookies import SimpleCookie
from random import choice
from string import ascii_letters
from .modules import modules
from .database import add_sound, get_sounds, get_or_generate_code, approve_code

special_paths = {
    "/": "./src/client/index.html",
    "/play": "./src/client/play.html",
    "/manage": "./src/client/manage.html",
    "/favicon.ico": "./src/client/favicon.ico",
    "/favicon.png": "./src/client/favicon.png"
}

restricted_paths = [
    "/manage"
]

version = 0

class Handler(BaseHTTPRequestHandler):
    @cached_property
    def url(self):
        return urlparse(self.path)

    @cached_property
    def query_data(self):
        return dict(parse_qsl(self.url.query))

    @cached_property
    def post_json(self):
        content_length = int(self.headers.get("Content-Length", 0))
        return loads(self.rfile.read(content_length))

    @cached_property
    def post_files(self):
        # This only gets called by the host of this machine, I'm not going to implement strict security.
        # Will probably bite me in the ass some day but I'm also pretty sure I won't remember doing this.
        # I'm so sick man.
        content_length = int(self.headers.get("Content-Length", 0))
        ticker = 0
        def readline(): # you'd think in 2024 it wouldn't hang on a read past the end of input
            nonlocal ticker
            if ticker >= content_length:
                return ""
            l = self.rfile.readline()
            ticker += len(l)
            return l
        
        bound = readline().strip()
        line = readline()
        files = []
        while line:
            try:
                results = re.findall(r'Content-Disposition.*name="file"; filename="(.*)"', line.decode("utf-8"))
            except:
                line = readline()
                continue

            if results:
                extension = results[0].split(".")[-1]
                uuid = uuid4()
                readline()
                readline()
                if not exists("uploads"):
                    mkdir("uploads")
                with open(f"uploads/{uuid}.{extension}", "wb") as f:
                    l = readline()
                    while l:
                        if bound in l:
                            files.append(f"uploads/{uuid}.{extension}")
                            f.close()
                            break
                        f.write(l)
                        l = readline()
            line = readline()
        return files


    @cached_property
    def cookies(self) -> SimpleCookie:
        return SimpleCookie(self.headers.get("Cookie"))

    def session(self):
        cookie = self.cookies
        if "session" in cookie:
            session = cookie["session"].value
            self.new_cookie = False
        else:
            session = ''.join(choice(ascii_letters) for i in range(128))
            cookie["session"] = session
            self.new_cookie = cookie

        self.code, self.code_approved = get_or_generate_code(self.client_address[0], session)

    def write(self, out):
        self.wfile.write(out.encode("utf-8"))

    def write_file(self, file):
        self.wfile.write(file.read())

    def write_json(self, json):
        self.write(dumps(json))

    def header(self, code, type):
        self.send_response(code)
        self.send_header("Content-Type", type)
        if self.new_cookie:
            self.send_header("Set-Cookie", self.new_cookie.output(header="") + "; Path=/")
        self.end_headers()

    def do_GET(self):
        self.session()
        
        path = self.url.path

        if path.startswith("/code"):
            with open("./src/client/code.html", "r") as f:
                self.header(200, "text/html")
                self.write(f.read().replace("{{code}}", self.code))
                return
        elif path.startswith("/resources"):
            location = realpath(join("./src/client", path[1:]))
            safe_location = realpath("./src/client/resources")
            if commonprefix([location, safe_location]) != safe_location:
                self.header(401, "text/plain")
                self.write("Access Denied")
                return
            
            with open(location, "rb") as f:
                self.header(200, guess_type(location)[0])
                self.write_file(f)
                return
        
        if (
            self.client_address[0] != self.server.server_address[0]
            and not self.code_approved
        ):
            self.send_response(307)
            self.send_header("Content-Type", "text/plain")
            self.send_header("Location", "/code")
            if self.new_cookie:
                self.send_header("Set-Cookie", self.new_cookie.output(header="") + "; Path=/")
            self.end_headers()

        if path.startswith("/api"):
            self.header(405, "text/plain")
            self.write(f"API is POST-only")
            return
        elif path == "/shutdown":
            if self.client_address[0] != self.server.server_address[0]:
                self.header(401, "text/plain")
                self.write("Access Denied")
                return
            self.server.shutdown()
        elif path.startswith("/uploads"):
            path = path[9:]
            location = realpath(join("./uploads", path))
            safe_location = realpath("./uploads")
            if commonprefix([location, safe_location]) != safe_location:
                self.header(401, "text/plain")
                self.write("Access Denied")
                return
            
            with open(location, "rb") as f:
                self.header(200, guess_type(location)[0])
                self.write_file(f)
                return
        elif path == "/module":
            self.header(200, "text/javascript")
            self.write("var MODULES = {};\n")
            self.write("var Module = {};\n\n")
            for k, v in modules.items():
                self.write(f"/* {k} */\n\n")
                with v.javascript() as f:
                    self.write(re.sub(r"class\sModule", "Module = class ", f.read().decode("utf-8")))
                self.write(f"\n\nMODULES['{k}'] = Module;\n")
                self.write(f"\n\n/* end {k} */\n\n")
            return
        elif path.startswith("/module"):
            path = path[8:]
            if path in modules:
                with modules[path].javascript() as f:
                    self.header(200, "text/javascript")
                    self.write_file(f)
                    return
        elif path in special_paths:
            if path in restricted_paths and self.client_address[0] != self.server.server_address[0]:
                self.header(401, "text/plain")
                self.write("Access Denied")
                return

            location = special_paths[path]
            with open(location, "rb") as f:
                self.header(200, guess_type(location)[0])
                self.write_file(f)
                return
        self.header(404, "text/plain")
        self.write(f"Not Found")
        return

    def do_POST(self):
        self.session()

        path = self.url.path
        
        if path.startswith("/api"):
            path = path[4:]
            if path.startswith("/code"):
                if self.code_approved:
                    self.header(200, "application/json")
                    self.write("{\"error\": 200, \"approved\": true}")
                else:
                    self.header(200, "application/json")
                    self.write("{\"error\": 200, \"approved\": false}")
            elif (
                self.client_address[0] != self.server.server_address[0]
                and not self.code_approved
            ):
                self.header(401, "application/json")
                self.write("{\"error\": 401, \"message\": \"Access Denied\"}")
                return
            elif path.startswith("/approve"):
                approve_code(self.post_json["code"])
                self.header(200, "application/json")
                self.write("{\"error\": 200, \"message\": \"OK\"}")
                return
            elif path.startswith("/activate"):
                path = path[10:]
                with open("buttons.json", "r") as f:
                    json = load(f)
                if path in json:
                    for module in json[path]["data"]:
                        modules[module].act(json[path]["data"][module])
                    self.header(200, "application/json")
                    self.write("{\"error\": 200, \"message\": \"OK\"}")
                else:
                    self.header(404, "application/json")
                    self.write("{\"error\": 404, \"message\": \"Not Found\"}")
                return                 
            elif path.startswith("/upload"):
                if self.client_address[0] != self.server.server_address[0]:
                    self.header(401, "application/json")
                    self.write("{\"error\": 401, \"message\": \"Access Denied\"}")
                    return
                self.header(200, "application/json")
                self.write_json(self.post_files)
                return
            elif path.startswith("/update"):
                if self.client_address[0] != self.server.server_address[0]:
                    self.header(401, "application/json")
                    self.write("{\"error\": 401, \"message\": \"Access Denied\"}")
                    return
                with open("buttons.json", "w") as f:
                    dump(self.post_json, f, indent=2)
                self.header(200, "application/json")
                self.write("{\"error\": 200, \"message\": \"OK\"}")
                global version
                version += 1
                return
            elif path.startswith("/buttons"):
                self.header(200, "application/json")
                with open("buttons.json", "rb") as f:
                    self.write_file(f)
                return
            elif path.startswith("/version"):
                self.header(200, "application/json")
                self.write(f"{version}")
                return
            elif path.startswith("/queue"):
                self.header(200, "application/json")
                self.write_json(get_sounds())
                return
        else:
            self.do_GET()