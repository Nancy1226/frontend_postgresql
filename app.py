from flask import Flask, request, jsonify
from flask_cors import CORS
from lexer import pg_lexer

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json['query']
    tokens = pg_lexer(data)
    token_list = [{'token': tok.value, 'type': tok.type} for tok in tokens]
    return jsonify({'tokens': token_list})

if __name__ == '__main__':
    app.run(debug=True)
