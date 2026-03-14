import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load env
env_path = "/home/ubuntu/agentmanager/workspace/history-synthesizer/.env"
load_dotenv(env_path)

gemini_key = os.getenv("GEMINI_API_KEY")
serpapi_key = os.getenv("SERPAPI_KEY")
supabase_url = os.getenv("SUPABASE_URL")

print(f"--- Environment Check ---")
print(f"Gemini Key: {'✅ Found' if gemini_key else '❌ Missing'}")
print(f"SerpAPI Key: {'✅ Found' if serpapi_key else '❌ Missing'}")
print(f"Supabase URL: {'✅ Found' if supabase_url else '❌ Missing'}")

if gemini_key:
    try:
        print("\n--- Testing Gemini API ---")
        genai.configure(api_key=gemini_key)
        
        print("Available models:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
        
        # Try gemini-2.0-flash as it's definitely in the list
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Hello! Say 'Ready to synthesize history!'")
        print(f"\nResponse: {response.text.strip()}")
    except Exception as e:
        print(f"❌ Gemini Error: {e}")

