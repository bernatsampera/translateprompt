#!/usr/bin/env python3
"""Minimal ngrok proxy for already running backend."""

import signal
import subprocess
import sys
import time

import requests

from config import config


def get_ngrok_url():
    """Get the ngrok public URL."""
    try:
        response = requests.get("http://localhost:4040/api/tunnels", timeout=5)
        tunnels = response.json()
        if tunnels.get("tunnels"):
            return tunnels["tunnels"][0]["public_url"]
    except:
        pass
    return None


def main():
    print("🌐 Starting ngrok proxy...")
    print(
        f"📍 Assuming backend is running on http://{config.API_HOST}:{config.API_PORT}"
    )

    # Start ngrok
    ngrok_process = subprocess.Popen(
        ["ngrok", "http", str(config.API_PORT)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    def cleanup():
        print("\n🧹 Stopping ngrok...")
        ngrok_process.terminate()
        try:
            ngrok_process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            ngrok_process.kill()
        print("✅ Done")
        sys.exit(0)

    signal.signal(signal.SIGINT, lambda s, f: cleanup())

    # Wait for ngrok to start
    print("⏳ Waiting for ngrok to start...")
    time.sleep(3)

    # Get URL
    ngrok_url = get_ngrok_url()
    if ngrok_url:
        print(f"✅ Ngrok tunnel ready: {ngrok_url}")
        print("📊 Dashboard: http://localhost:4040")
        print("\n🔍 Test endpoints:")
        print(f"   • {ngrok_url}/health")
        print(f"   • {ngrok_url}/pricing/tiers")
        print(f"   • {ngrok_url}/pricing/plans")
        print("\n💡 Press Ctrl+C to stop\n")

        # Keep running
        try:
            ngrok_process.wait()
        except KeyboardInterrupt:
            cleanup()
    else:
        print("❌ Failed to get ngrok URL")
        cleanup()


if __name__ == "__main__":
    main()
