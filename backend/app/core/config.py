from pathlib import Path
from os import getenv

from dotenv import load_dotenv
from pydantic import AnyUrl, BaseModel


env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(env_path)


class Settings(BaseModel):
    database_url: AnyUrl
    secret_key: str = "change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60


settings = Settings(
    database_url=getenv("DATABASE_URL", ""),
    secret_key=getenv("SECRET_KEY", "change-me"),
    algorithm=getenv("ALGORITHM", "HS256"),
    access_token_expire_minutes=int(getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)),
)
