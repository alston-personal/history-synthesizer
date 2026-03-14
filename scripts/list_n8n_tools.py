import requests
import os
import json
from dotenv import load_dotenv

# Load env from current project
env_path = "/home/ubuntu/agentmanager/workspace/history-synthesizer/.env"
load_dotenv(env_path)

N8N_MCP_ENDPOINT = os.getenv("N8N_MCP_ENDPOINT")
ACCESS_TOKEN = os.getenv("N8N_API_KEY")

def list_n8n_tools():
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
    }
    
    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "tools/list"
    }

    try:
        print(f"Connecting to {N8N_MCP_ENDPOINT}...")
        response = requests.post(N8N_MCP_ENDPOINT, headers=headers, json=payload, stream=True, timeout=15)
        
        if response.status_code != 200:
            print(f"Error: Status code {response.status_code}")
            print(response.text)
            return

        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                # If it's SSE
                if decoded_line.startswith('data:'):
                    try:
                        data = json.loads(decoded_line[5:].strip())
                        if 'result' in data:
                            tools = data['result'].get('tools', [])
                            print("\n[Available Tools in n8n]")
                            if not tools:
                                print("No tools found. Check 'Available in MCP' in n8n.")
                            for tool in tools:
                                print(f"- {tool['name']}: {tool.get('description', 'No description')}")
                            # After first result we might be done
                            return
                    except:
                        continue
                # Direct JSON
                try:
                    data = json.loads(decoded_line)
                    if 'result' in data:
                        tools = data['result'].get('tools', [])
                        print("\n[Available Tools in n8n]")
                        for tool in tools:
                                print(f"- {tool['name']}: {tool.get('description', 'No description')}")
                        return
                except:
                    continue

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_n8n_tools()
