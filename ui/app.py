
from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
import time

from response_generator import generate_stream  

app = Flask(__name__)
CORS(app)

conv_hist = []

@app.post("/generate")
def generate():
    prompt = request.json.get("prompt", "")
    def token_stream():
        for token in generate_stream(prompt, conv_hist):
            time.sleep(0.2)
            yield token
    return Response(stream_with_context(token_stream()), mimetype="text/plain")

if __name__ == "__main__":
    app.run(debug=True)
