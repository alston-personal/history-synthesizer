import os
import sys
import json
import requests
from urllib.parse import urlparse

# Hardcoded API keys for instant out-of-the-box execution
SERPAPI_KEY = "1e20ae6397bae5b68d24f10e7774792d8729e8405ac64764ec590e6095351ec3"
GEMINI_API_KEY = "AIzaSyA6n1nXt2VaEmIi_c3UFNPn3i-79QWwWSs"

def search_history(query):
    print(f"🔍 Crawling live web & news data for: '{query}'...")
    params = {
        "q": f"{query} history milestones company timeline news key events",
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

def synthesize_history(results, query):
    print(f"🧠 Extracting relational entities ('人事時地物') via Gemini...")
    if not results:
        return []
        
    snippets = []
    for i, r in enumerate(results):
        title = r.get("title", "")
        snippet = r.get("snippet", "")
        link = r.get("link", "")
        snippets.append(f"[{i+1}] Title: {title}\nSnippet: {snippet}\nLink: {link}")
        
    all_text = "\n\n".join(snippets)
    
    prompt = f"""You are an elite corporate historian and graph data synthesizer.
Analyze the following web search snippets related to '{query}' and extract a chronological timeline of the most significant company milestones or events.

For each milestone, you MUST extract structured entities based on the "人事時地物" framework:
- who (Strictly ONLY key historical figures, founders, executives, or core parent/partner organizations involved. Never put products, software, technical concepts, stock exchanges, or general events here. E.g. ["Jensen Huang", "NVIDIA"])
- what (Core products, technologies, software, stock tickers, or specific event names - e.g. ["GeForce 256", "GPU", "TWSE: 3454", "VORTEX"])
- where (Locations - as an array of strings, e.g. ["San Jose"])
- when (The clean YYYY-MM-DD or YYYY date)
- why (Consequential reasons or business context)

Additionally, extract a "relationships" list connecting these entities together.

Return a JSON array of objects. Each object MUST have exactly these fields:
- "date": "YYYY-MM-DD" or "YYYY" (matching the 'when' entity)
- "event": "A concise, detailed summary of the milestone (1-2 sentences)"
- "entities": {{
    "who": ["Entity 1", "Entity 2"],
    "what": ["Product 1", "Tech 1"],
    "where": ["Location 1"],
    "when": "YYYY-MM-DD or YYYY",
    "why": "Context summary"
  }}
- "relationships": [
    {{"source": "Entity 1", "target": "Entity 2", "label": "A short relationship description in Traditional Chinese (Taiwan), e.g. 創辦人, 收購, 旗下產品, 技術合作"}}
  ]
- "sources": [
    {{"url": "The exact source URL validating this event from the provided snippets"}}
  ]

Follow these strict rules:
1. Extract ONLY highly significant milestones (e.g. founding, IPO, major product releases, acquisitions, market caps).
2. If multiple search snippets validate or add detail to the SAME milestone, group them together in the "sources" list.
3. Ensure dates are chronological.
4. Output ONLY valid JSON. Do not write markdown tags or extra explanations.

Search snippets:
{all_text}"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
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
        
        # Clean markdown wrappers
        result_text = result_text.replace("```json", "").replace("```", "").strip()
        events = json.loads(result_text)
        
        # Sort chronologically by date
        try:
            events.sort(key=lambda x: x.get('date', ''))
        except Exception:
            pass
            
        return events
    except Exception as e:
        print(f"❌ Gemini Error: {e}")
        return []

def calculate_dynamic_confidence(events):
    """
    Applies the probability combination formula:
    Confidence = 1 - (1 - s_1) * (1 - s_2) * ...
    Trust scores are assigned based on domain authority.
    """
    print("🧮 Calculating dynamic confidence scores based on source authorities...")
    for ev in events:
        sources = ev.get("sources", [])
        if not sources:
            ev["confidence"] = 0.5
            continue
            
        prob_untrusted = 1.0
        for s in sources:
            url = s.get("url", "").lower()
            parsed_url = urlparse(url)
            domain = parsed_url.netloc
            
            # Domain-based authority scoring
            trust = 0.5 # Default trust
            if any(kw in domain for kw in ["nvidia.com", "vivotek.com", "openai.com", "apple.com"]):
                trust = 0.95 # Official Primary Site
                s["authority"] = "Official Brand Site"
            elif "wikipedia.org" in domain:
                trust = 0.85 # Community Wiki
                s["authority"] = "Crowdsourced Reference"
            elif any(kw in domain for kw in ["reuters.com", "bloomberg.com", "britannica.com", "nytimes.com", "wsj.com"]):
                trust = 0.80 # Premium Press / Encyclopedia
                s["authority"] = "Premium Press"
            elif any(kw in domain for kw in ["techcrunch.com", "verge.com", "engadget.com", "venturebeat.com"]):
                trust = 0.70 # Tech Media
                s["authority"] = "Tech Media"
            else:
                s["authority"] = "General Source"
                
            s["trust"] = trust
            prob_untrusted *= (1.0 - trust)
            
        # Combine probabilities and round to 2 decimal places
        combined_confidence = round(1.0 - prob_untrusted, 2)
        ev["confidence"] = combined_confidence
        
    return events

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 synthesize.py <company_name>")
        sys.exit(1)
        
    query = sys.argv[1]
    results = search_history(query)
    
    if not results:
        print("❌ No search results obtained.")
        sys.exit(1)
        
    events = synthesize_history(results, query)
    
    if not events:
        print("❌ Failed to synthesize historical events.")
        sys.exit(1)
        
    # Calculate Dynamic Confidence
    events = calculate_dynamic_confidence(events)
    
    # Save results directly to Vite public folder
    public_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../viewer/public")
    os.makedirs(public_dir, exist_ok=True)
    
    output_path = os.path.join(public_dir, "timeline_data.json")
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(events, f, ensure_ascii=False, indent=2)
        print(f"✨ SUCCESS! Synthesized {len(events)} events saved to {output_path}")
    except Exception as e:
        print(f"❌ File Save Error: {e}")

if __name__ == "__main__":
    main()
