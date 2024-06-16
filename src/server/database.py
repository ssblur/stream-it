import sqlite3
from datetime import datetime, timedelta

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
    conn.commit()
    curs.close()
    conn.close()

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


__setup()