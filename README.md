# Stream It!

## WARNING

Stream It! should not be used on public networks, as though there is basic authentication in
place, it is not particularly robust.

Do not leave Stream It! running on multi-user machines, as other users are able to reconfigure
your buttons and layout.

## What

Stream It! is a virtual button panel a la the stream deck which allows you to trigger a variety of 
actions within a browser view or on a host machine by simply pressing buttons.

Currently you can use it to play sounds in an OBS browser source, press keys on the host computer,
or run commands.
Planned features include macros which combine other actions, displaying graphics in a browser view,
and setting up triggers which can automatically press buttons.

## Why

This was made to assist in foley for my own personal streams. 
I made it in a feverish pitch when I was very sick.
Don't blame me for any funk or jank.

## Setup

To set this up, install Python 3.10 or newer using a package manager or through 
[the official website](https://www.python.org/),
then install using `python -m pip install pipenv` and install and run this project
using `pipenv install` and `pipenv run .` in the project directory.

Once running, it will spit a link out in console to the local management panel,
where you can create and configure buttons.
In this panel is also the browser source link (for stream suites like OBS) and the
button panel link, where you can navigate on other devices to control this device.

## License

Stream It! by Patrick Hallbick is marked with [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).

Do whatever you want with it, it's effectively public domain.