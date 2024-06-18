import sqlite3
from datetime import datetime, timedelta
from string import digits
from random import choice

# I keep rebuilding the connection because I'm scared of multithreading.
# It's fast anyways so I can improve it later probably

def __setup():
    conn = sqlite3.connect("database.db")
    curs = conn.cursor()
    curs.execute("""
        create table if not exists sound_queue (
            filename varchar(128),
            submitted timestamp
        );
    """)
    curs.execute("""
        create table if not exists codes (
            host varchar(128),
            session varchar(128),
            code varchar(4),
            submitted timestamp,
            updated datetime,
            approved boolean
        );
    """)
    curs.execute("""
        create table if not exists graphic_queue (
            filename varchar(128),
            type varchar(3),
            submitted timestamp,
            x real,
            y real,
            width real,
            height real,
            fade boolean,
            duration real
        );
    """)
    conn.commit()
    curs.close()
    conn.close()

def __convert_timestamps(rows):
    out = []
    for row in rows:
        out.append(list(row))
        for col in range(len(row)):
            if isinstance(row[col], datetime):
                out[-1][col] = row[col].strftime("%Y-%m-%d %H:%M:%S")
    return out

def add_sound(filename):
    conn = sqlite3.connect(
        "database.db", 
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES,
        
    )
    curs = conn.cursor()
    curs.execute(
        "insert into sound_queue values (?, ?);",
        (filename, datetime.now())
    )
    conn.commit()
    curs.close()
    conn.close()

def get_sounds():
    conn = sqlite3.connect(
        "database.db", 
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    curs = conn.cursor()

    curs.execute("select filename, submitted, rowid from sound_queue where submitted > ?;", (datetime.now() - timedelta(seconds=5),))
    results = [(id, time.strftime("%Y-%m-%d %H:%M:%S"), file) for file, time, id in curs.fetchall()]

    curs.close()
    conn.close()

    return results

def get_or_generate_code(host, session):
    conn = sqlite3.connect(
        "database.db", 
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES,
    )
    curs = conn.cursor()
    curs.execute(
        "select code, approved from codes where session = ? and host = ? and updated > ?",
        (session, host, datetime.now() - timedelta(hours=24))
    )
    code = curs.fetchall()

    if not code:
        while True:
            code = ''.join(choice(digits) for i in range(4))
            curs.execute("select * from codes where code = ?", (code,))
            results = curs.fetchall()
            if not results:
                break

        approved = False
        curs.execute(
            "insert into codes values (?, ?, ?, ?, ?, ?)",
            (
                host, 
                session,
                code,
                datetime.now(),
                datetime.now(),
                False
            )
        )
        conn.commit()
    else:
        code, approved = code[0]

    curs.close()
    conn.close()

    return code, approved

def approve_code(code):
    conn = sqlite3.connect(
        "database.db", 
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES,
    )
    curs = conn.cursor()
    curs.execute(
        "update codes set approved = TRUE, updated = ? where code = ? and updated > ?",
        (datetime.now(), code, datetime.now() - timedelta(hours=24))
    )
    conn.commit()

def add_image(filename, duration, x, y, width, height, fade_in):
    conn = sqlite3.connect(
        "database.db", 
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES,
        
    )
    curs = conn.cursor()

    curs.execute(
        "insert into graphic_queue values (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        (
            filename,
            "gfx",
            datetime.now(),
            x, 
            y,
            width,
            height,
            fade_in,
            duration
        )
    )

    conn.commit()
    curs.close()
    conn.close()

def get_graphics():
    conn = sqlite3.connect(
        "database.db", 
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
    )
    curs = conn.cursor()

    curs.execute("""select 
        rowid,
        filename,
        type,
        submitted,
        x,
        y,
        width,
        height,
        fade,
        duration 
        from graphic_queue where submitted > ?;""", (datetime.now() - timedelta(seconds=5),))
    results = __convert_timestamps(curs.fetchall())

    curs.close()
    conn.close()

    return results

__setup()