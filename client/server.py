import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time

PORT = 8080

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Suppress noise, log requests cleanly
        sys.stderr.write("%s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))

def open_browser(port):
    time.sleep(1.2)
    url = f"http://localhost:{port}/app.html#/dashboard"
    print(f"[ALUGRADE BMS] Opening application in browser: {url}")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"[ALUGRADE BMS] Browser auto-open note: {e}")

def run_server():
    global PORT
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)
    
    handler = NoCacheHTTPRequestHandler
    httpd = None
    for try_port in range(PORT, PORT + 20):
        try:
            httpd = socketserver.TCPServer(("", try_port), handler)
            PORT = try_port
            break
        except OSError:
            continue
            
    if not httpd:
        print("Error: Could not bind to any port in range 8080-8100.")
        sys.exit(1)

    print(f"\n=======================================================")
    print(f"  ALUGRADE BMS Development Server Running")
    print(f"  Project Root: {project_dir}")
    print(f"  Local URL:    http://localhost:{PORT}/app.html#/dashboard")
    print(f"=======================================================\n")

    # Launch browser automatically
    threading.Thread(target=open_browser, args=(PORT,), daemon=True).start()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[ALUGRADE BMS] Development server stopped.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
