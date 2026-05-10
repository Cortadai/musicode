#!/bin/bash
# Build the full Sonance app: React frontend + Spring Boot JAR
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
UI_DIR="$ROOT_DIR/sonance-ui"
SERVER_DIR="$ROOT_DIR/sonance-server"
STATIC_DIR="$SERVER_DIR/src/main/resources/static"

echo "=== Building React frontend ==="
cd "$UI_DIR"
npm run build

echo "=== Copying frontend build to Spring Boot static resources ==="
rm -rf "$STATIC_DIR"
mkdir -p "$STATIC_DIR"
cp -r "$UI_DIR/dist/"* "$STATIC_DIR/"

echo "=== Building Spring Boot JAR ==="
cd "$SERVER_DIR"
mvn package -DskipTests -q

JAR=$(ls "$SERVER_DIR/target"/sonance-server*.jar | grep -v original | head -1)
cp "$JAR" "$SERVER_DIR/target/sonance-server.jar"
echo "=== Build complete: $SERVER_DIR/target/sonance-server.jar ==="
