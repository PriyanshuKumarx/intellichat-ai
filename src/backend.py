from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)  

genai.configure(api_key="AIzaSyAduahel7ty22gC3OUtmP67KWvPt0ZSYWQ")  

model = genai.GenerativeModel('gemini-2.0-flash')

@app.route("/")
def home():
    return render_template("App.jsx")  

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message", "")

    try:
        
        response = model.generate_content(user_message)
        
        reply = response.text
        return jsonify({"response": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)