import os
import json
import requests
from dotenv import load_dotenv

# Load env
env_path = "/home/ubuntu/agentmanager/workspace/history-synthesizer/.env"
load_dotenv(env_path)

serpapi_key = os.getenv("SERPAPI_KEY")

def test_search(query):
    print(f"--- Testing SerpAPI Search: '{query}' ---")
    if not serpapi_key:
        print("❌ Error: SERPAPI_KEY not found in .env")
        return

    params = {
        "q": query,
        "tbm": "nws", # News search
        "api_key": serpapi_key,
        "num": 5
    }

    try:
        response = requests.get("https://serpapi.com/search", params=params)
        response.raise_for_status()
        data = response.json()
        
        news_results = data.get("news_results", [])
        if news_results:
            print(f"✅ Success! Found {len(news_results)} news results:")
            for i, result in enumerate(news_results, 1):
                print(f"{i}. {result.get('title')} ({result.get('source')})")
                print(f"   Link: {result.get('link')}\n")
        else:
            print("⚠️ No news results found, but API call succeeded.")
            print(f"Full response: {json.dumps(data, indent=2)[:500]}...")
            
    except Exception as e:
        print(f"❌ SerpAPI Error: {e}")

if __name__ == "__main__":
    test_search("NVIDIA history")
