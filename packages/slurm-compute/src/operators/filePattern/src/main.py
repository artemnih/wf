import argparse
import shutil
import os
from pathlib import Path
if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        prog="main", description="Convert Bioformats supported format to OME Zarr."
    )

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
    shutil.copy(input, os.path.join(os.getcwd(), "cwl.output.json"))
