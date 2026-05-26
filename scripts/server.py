import os
import sys
import json
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 8087

class SynthesizeServerHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/synthesize':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                query = payload.get('query', '').strip()
                
                if not query:
                    self.send_response(400)
                    self._set_cors_headers()
                    self.end_headers()
                    self.wfile.write(b'{"error": "Query cannot be empty"}')
                    return
                
                print(f"📡 API Triggered: Synthesizing real-world facts for '{query}'...")
                
                # Execute synthesize.py in a subprocess securely
                script_dir = os.path.dirname(os.path.abspath(__file__))
                synthesize_script = os.path.join(script_dir, "synthesize.py")
                
                # Run CLI script
                process = subprocess.run(
                    ["python3", synthesize_script, query],
                    capture_output=True,
                    text=True
                )
                
                if process.returncode != 0:
                    print(f"❌ Subprocess Error: {process.stderr}")
                    self.send_response(500)
                    self._set_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Synthesis backend error", "details": process.stderr}).encode('utf-8'))
                    return
                
                # Read the newly generated JSON file
                timeline_data_path = os.path.join(script_dir, "../viewer/public/timeline_data.json")
                if os.path.exists(timeline_data_path):
                    with open(timeline_data_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self._set_cors_headers()
                    self.end_headers()
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                else:
                    self.send_response(500)
                    self._set_cors_headers()
                    self.end_headers()
                    self.wfile.write(b'{"error": "Failed to locate generated data"}')
                    
            except Exception as e:
                print(f"❌ Server Error: {e}")
                self.send_response(500)
                self._set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(b'{"error": "Not Found"}')

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, SynthesizeServerHandler)
    print(f"✨ Chronos API Synthesis Server running on port {PORT}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping API server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
