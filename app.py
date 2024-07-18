from flask import Flask, request, jsonify
from lexer import pg_lexer
from parser import pg_parser
from semantic import semantic_analyze

app = Flask(__name__)

@app.route('/analyze/page1', methods=['POST'])
def analyze_page1():
    data = request.json
    tokens = pg_lexer(data, page=1)
    syntax_tree = pg_parser(tokens, page=1)
    semantic_result = semantic_analyze(syntax_tree, page=1)
    return jsonify(semantic_result)

@app.route('/analyze/page2', methods=['POST'])
def analyze_page2():
    data = request.json
    tokens = pg_lexer(data, page=2)
    syntax_tree = pg_parser(tokens, page=2)
    semantic_result = semantic_analyze(syntax_tree, page=2)
    return jsonify(semantic_result)

if __name__ == '__main__':
    app.run(debug=True)
