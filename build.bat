pipenv run pyinstaller --onefile --clean -y ^
 --add-data "src/modules/:src/modules/" ^
 --noconsole ^
 --icon "src/client/favicon.ico" ^
 --add-data "src/client/*:src/client/" ^
 -n "StreamIt" ^
 ./__main__.py