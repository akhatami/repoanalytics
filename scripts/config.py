from pydantic_settings  import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str
    MONGO_INITDB_DATABASE: str

settings = Settings()
