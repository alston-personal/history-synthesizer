import requests
import os
import json
from dotenv import load_dotenv

env_path = "/home/ubuntu/agentmanager/workspace/history-synthesizer/.env"
load_dotenv(env_path)

N8N_MCP_ENDPOINT = os.getenv("N8N_MCP_ENDPOINT")
ACCESS_TOKEN = os.getenv("N8N_API_KEY")

def call_mcp_tool(tool_name, arguments={}):
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
    }
    
    payload = {
        "jsonrpc": "2.0",
        "id": "1",
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments
        }
    }

    try:
        response = requests.post(N8N_MCP_ENDPOINT, headers=headers, json=payload, stream=True, timeout=30)
        for line in response.iter_lines():
            if line:
                decoded_line = line.decode('utf-8')
                if decoded_line.startswith('data:'):
                    data = json.loads(decoded_line[5:].strip())
                    if 'result' in data:
                        return data['result']
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    print("Listing all workflows...")
    result = call_mcp_tool("search_workflows", {})
    if result:
        print(json.dumps(result, indent=2))
    else:
        print("No result or error.")
