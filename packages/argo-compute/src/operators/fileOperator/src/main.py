import argparse
from pathlib import Path
import json
import sys
import os

if __name__ == "__main__":

    parser = argparse.ArgumentParser(prog="main")

    # Input arguments
    parser.add_argument(
        "--input",
        dest="input",
        type=str,
        help="Input generic data collection to be processed by this plugin",
        required=True,
    )

    args = parser.parse_args()
    input = os.path.join(Path(args.input), "file_patterns.json")
    with open(input, "r") as argoout:
        file_patterns = json.load(argoout)
        json.dump(file_patterns["filePatterns"], sys.stdout)
