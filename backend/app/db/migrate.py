from alembic import command
from alembic.config import Config
import os


def run_migrations(database_url: str) -> None:
    cfg = Config(os.path.join(os.path.dirname(__file__), "..", "..", "alembic.ini"))
    cfg.set_main_option("sqlalchemy.url", database_url)
    # ensure script_location is relative to backend dir
    cfg.set_main_option("script_location", os.path.join(os.path.dirname(__file__), "..", "..", "alembic"))
    command.upgrade(cfg, "head")

