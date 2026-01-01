from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from pymongo.database import Database
from dotenv import load_dotenv
import certifi
import logging
load_dotenv()


uri=os.getenv('MONGO_URL')
DATABASE_NAME = os.getenv('DATABASE_NAME')
logger = logging.getLogger(__name__)

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
except Exception as e:
    logger.exception(e)

# Get database and collection
db: Database = client[DATABASE_NAME]
users_collection = db["users"]
refresh_tokens_collection = db["refresh_token"]

# Create unique index on email
try:
    users_collection.create_index("email", unique=True)
    refresh_tokens_collection.create_index("token", unique=True)
    refresh_tokens_collection.create_index("expires_at", expireAfterSeconds=0)
except Exception as e:
    logger.exception(f"⚠️ Index creation note: {e}")