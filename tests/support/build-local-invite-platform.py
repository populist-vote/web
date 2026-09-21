"""Build the real API with only SendGrid/Geocodio URLs replaced by local stubs."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
from urllib.parse import urlparse

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("platform", type=Path)
parser.add_argument("build_dir", type=Path)
args = parser.parse_args()
platform = args.platform.resolve()
build_dir = args.build_dir.resolve()
database_url = os.environ.get("DATABASE_URL", "")
if urlparse(database_url).hostname not in ("localhost", "127.0.0.1"):
    parser.error("DATABASE_URL must point to a local, disposable database")
registry = Path(os.environ.get("CARGO_HOME", Path.home() / ".cargo")) / "registry/src"
sources = list(registry.glob("*/sendgrid-0.17.4"))
if not sources:
    parser.error("Run cargo fetch in platform first (SendGrid 0.17.4 is required)")
for source, name, source_file, old, new in [
    (sources[0], "sendgrid-local", "src/v3.rs", "https://api.sendgrid.com/v3/mail/send", "http://127.0.0.1:55440/v3/mail/send"),
    (platform / "geocodio", "geocodio-local", "src/lib.rs", "https://api.geocod.io/v1.7/", "http://127.0.0.1:55440/v1.7/"),
]:
    destination = build_dir / name
    shutil.copytree(source, destination, dirs_exist_ok=True, ignore=shutil.ignore_patterns(".git", "target", ".env", ".env.*"))
    file = destination / source_file
    content = file.read_text()
    if old not in content:
        raise RuntimeError(f"Expected transport URL missing in {source_file}")
    file.write_text(content.replace(old, new))
lock = platform / "Cargo.lock"
original_lock = lock.read_bytes()
try:
    subprocess.run([
        "cargo", "--config", f'patch.crates-io.sendgrid.path="{build_dir / "sendgrid-local"}"',
        "--config", f'paths=["{build_dir / "geocodio-local"}"]',
        "build", "-p", "server", "--bin", "server",
    ], cwd=platform, check=True)
finally:
    lock.write_bytes(original_lock)
print("Built a LOCAL-ONLY validation server. Rebuild normally before any deployment.")
