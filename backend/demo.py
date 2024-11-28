import google.generativeai as genai

genai.configure(api_key="AIzaSyCQMT7VhTZYvQf6rEWt2U-bs7mmMA7aMyo")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Explain how AI works")
print(response.text)