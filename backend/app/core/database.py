import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.hacklens

user_collection = database.get_collection("users")
hackathon_collection = database.get_collection("hackathons")
registrations_collection = database.get_collection("registrations")
submissions_collection = database.get_collection("submissions")
evaluations_collection = database.get_collection("evaluations")

