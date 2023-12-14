"""
Path Creator implementation.
"""

import os
import logging
import pathlib
import typer
from typing import List

app = typer.Typer()

# Initialize the logger
logging.basicConfig(
    format="%(asctime)s - %(name)-8s - %(levelname)-8s - %(message)s",
    datefmt="%d-%b-%y %H:%M:%S",
)
logger = logging.getLogger("argo.steps.path_creator")
logger.setLevel(os.environ.get("ARGO_LOG", logging.DEBUG))


@app.command()
def main(
    paths: str = typer.Option(
        ...,
        "--paths",
        help="Paths that needs to be created before running the workflow",
    ),
) -> None:
    """Create paths necessary to execute the workflow."""
    for index, path in enumerate(paths.split(",")):
        logger.debug(f"creating path : {index} {path}")
        pathlib.Path(path).mkdir(parents=True, exist_ok=True)

if __name__ == "__main__":
    app()

