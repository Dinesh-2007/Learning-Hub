import os
from datetime import datetime
from types import SimpleNamespace

from pymongo import MongoClient, ReturnDocument

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
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

