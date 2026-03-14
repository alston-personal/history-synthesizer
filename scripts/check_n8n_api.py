import requests
import os
import json

base_url = "https://n8n.milkcat.org/api/v1"
api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzQxNmM4NC1mYjJkLTRmNmEtYTRkZS05OTc3N2MxMTU2MjMiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6ImMwYzQ3OTJkLTQ2MzAtNDIxZS04ZmZjLTY2ZTBlMWUwNWJmYyIsImlhdCI6MTc3MDU5Nzk4MX0.ldFXm9eO7L5TPWjpEOC3rkOKSJBI5JCz4cZnkGRB1ls"

def check_n8n():
    headers = {
        "X-N8N-API-KEY": api_key,
        "Accept": "application/json"
    }
    try:
        # Check workflows
        print("Checking /workflows...")
        response = requests.get(f"{base_url}/workflows", headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Found workflows:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"Error: {response.text}")
            
        # Check active workflows
        print("\nChecking /workflows?active=true...")
        response = requests.get(f"{base_url}/workflows?active=true", headers=headers)
        print(f"Status: {response.status_code}")
        
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    check_n8n()
