import sqlite3
import threading
import requests
import json
import logging
import os

logger = logging.getLogger('NeoProxy-Memory')

class KernelMemory:
    def __init__(self, db_path='sqlite.db'):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS memory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                daemon TEXT NOT NULL,
                event_type TEXT NOT NULL,
                details TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def wake(self, daemon, event_type, details):
        def _send():
            try:
                requests.post(
                    'http://localhost:3000/api/internal/wake',
                    json={'source': 'python_kernel', 'daemon': daemon, 'event_type': event_type, 'data': details},
                    timeout=1
                )
            except Exception as e:
                logger.debug(f"Wake signal failed: {e}")
        threading.Thread(target=_send, daemon=True).start()

    def log(self, daemon: str, event_type: str, details: dict = None):
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO memory (daemon, event_type, details) VALUES (?, ?, ?)',
                (daemon, event_type, json.dumps(details) if details else None)
            )
            conn.commit()
            conn.close()

            self.wake(daemon, event_type, details)
        except Exception as e:
            logger.error(f"Failed to log to memory: {e}")

memory_db = KernelMemory()
