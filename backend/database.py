import os
from datetime import datetime
from pathlib import Path
from types import SimpleNamespace

from pymongo import MongoClient, ReturnDocument

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def _load_project_env() -> None:
    env_path = Path(BASE_DIR).parent / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


_load_project_env()

MONGO_DATABASE_URL = os.getenv("MONGO_DATABASE_URL", "mongodb://localhost:27017")
MONGO_DATABASE_NAME = os.getenv("MONGO_DATABASE_NAME", "studyplatform")

client = MongoClient(MONGO_DATABASE_URL)
db = client[MONGO_DATABASE_NAME]


def get_db():
    yield db


def get_next_id(database, collection_name: str) -> int:
    counter = database.counters.find_one_and_update(
        {"_id": collection_name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(counter["seq"])


def now_utc() -> datetime:
    return datetime.utcnow()


def as_obj(document: dict | None):
    if not document:
        return None
    payload = {k: v for k, v in document.items() if k != "_id"}
    return SimpleNamespace(**payload)

