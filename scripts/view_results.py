import os
import requests
import json
from dotenv import load_dotenv

load_dotenv("/home/ubuntu/agentmanager/workspace/history-synthesizer/.env")

url = f"{os.getenv('SUPABASE_URL')}/rest/v1/company_events"
headers = {
    "apikey": os.getenv("SUPABASE_SERVICE_KEY"),
    "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_KEY')}"
}

print("--- History Synthesizer: Current Data in Supabase ---")
try:
    response = requests.get(url, headers=headers, params={"select": "*", "order": "event_date.desc"})
    response.raise_for_status()
    data = response.json()
    
    if not data:
        print("📭 Data table is still empty.")
    else:
        print(f"✅ Found {len(data)} events:\n")
        print(f"{'DATE':<12} | {'COMPANY':<10} | {'DESCRIPTION'}")
        print("-" * 80)
        for row in data:
            date = row.get('event_date') or "Unknown"
            company = row.get('company_name') or "Unknown"
            desc = (row.get('description')[:60] + '...') if len(row.get('description')) > 60 else row.get('description')
            print(f"{date:<12} | {company:<10} | {desc}")

except Exception as e:
    print(f"❌ Error fetching data: {e}")
