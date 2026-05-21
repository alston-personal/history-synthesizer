import os
import json
import requests
import google.generativeai as genai
from dotenv import load_dotenv

# Hardcoded keys for demo since .env is missing or hard to find
SERPAPI_KEY = "1e20ae6397bae5b68d24f10e7774792d8729e8405ac64764ec590e6095351ec3"
GEMINI_API_KEY = "AIzaSyA6n1nXt2VaEmIi_c3UFNPn3i-79QWwWSs"

def search_news(query):
    print(f"🔍 Searching for: '{query}'...")
    params = {
        "q": query,
        # "tbm": "nws", # Remove news filter to get more history
        "api_key": SERPAPI_KEY,
        "num": 10
    }
    try:
        response = requests.get("https://serpapi.com/search", params=params)
        response.raise_for_status()
        data = response.json()
        return data.get("organic_results", []) + data.get("news_results", [])
    except Exception as e:
        print(f"❌ Search Error: {e}")
        return []

def extract_events(news_results):
    print(f"🧠 AI is analyzing {len(news_results)} snippets via REST API...")
    
    all_text = "\n\n".join([f"Source {i+1}: {r.get('title')}. {r.get('snippet')}" for i, r in enumerate(news_results)])
    
    prompt = f"""你是歷史學家。請從以下多個來源中抽取該公司的重要歷史里程碑或事件。
輸出必須是一個 JSON 數組，每個對象包含：
{{
  "date": "YYYY-MM-DD (or YYYY)",
  "event": "事件描述"
}}
如果沒有發現具體事件，請返回空數組 []。

來源文字：
{all_text}"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        result_text = result['candidates'][0]['content']['parts'][0]['text']
        result_text = result_text.replace("```json", "").replace("```", "").strip()
        print(f"     -> AI Output received.")
        events = json.loads(result_text)
        return events
    except Exception as e:
        print(f"     -> AI Error: {e}")
        if 'response' in locals():
            print(f"        Response: {response.text}")
        return []

if __name__ == "__main__":
    print("--- History Synthesizer: Demo Run ---")
    query = "NVIDIA history milestones news"
    results = search_news(query)
    
    if results:
        synthesized_events = extract_events(results)
        print("\n✨ Synthesized Historical Events:")
        print("=" * 80)
        if not synthesized_events:
            print("⚠️ No specific milestones extracted from the snippets.")
        for ev in synthesized_events:
            print(f"📅 {ev.get('date')}")
            print(f"📝 {ev.get('event')}")
            print(f"🔗 Source: {ev.get('source')}")
            print("-" * 80)
    else:
        print("❌ No results found to analyze.")
