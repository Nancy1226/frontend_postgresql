import ply.lex as lex

tokens = (
    'IP',
    'USERNAME',
    'PASSWORD',
    'PORT',
    'SQL_KEYWORD',
    'IDENTIFIER',
    'SEMICOLON',
    'COMMA',
    'LPAREN',
    'RPAREN',
    'INT',
    'VARCHAR',
    'VALUES',
    'STRING',
    'NUMBER'
)

# Definir reglas de tokens para cada página
def t_IP(t):
    r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'
    return t

def t_USERNAME(t):
    r'\b[a-zA-Z0-9_]+\b'
    return t

def t_PASSWORD(t):
    r'\b[a-zA-Z0-9_]+\b'
    return t

def t_PORT(t):
    r'\b\d+\b'
    return t

# Palabras reservadas de SQL
reserved = {
    'CREATE': 'SQL_KEYWORD',
    'DATABASE': 'SQL_KEYWORD',
    'DROP': 'SQL_KEYWORD',
    'ALTER': 'SQL_KEYWORD',
    'RENAME': 'SQL_KEYWORD',
    'TO': 'SQL_KEYWORD',
    'TABLE': 'SQL_KEYWORD',
    'INSERT': 'SQL_KEYWORD',
    'INTO': 'SQL_KEYWORD',
    'VALUES': 'VALUES',
    'SELECT': 'SQL_KEYWORD',
    'FROM': 'SQL_KEYWORD',
    'INT': 'INT',
    'VARCHAR': 'VARCHAR',
    'SERIAL': 'SQL_KEYWORD',
    'PRIMARY': 'SQL_KEYWORD',
    'KEY': 'SQL_KEYWORD',
    'NOT': 'SQL_KEYWORD',
    'NULL': 'SQL_KEYWORD'
}

def t_IDENTIFIER(t):
    r'\b[a-zA-Z_][a-zA-Z0-9_]*\b'
    t.type = reserved.get(t.value, 'IDENTIFIER')
    return t

t_SEMICOLON = r';'
t_COMMA = r','
t_LPAREN = r'\('
t_RPAREN = r'\)'
t_STRING = r'\'[^\']*\''

def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

t_ignore = ' \t\n'

def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)

lexer = lex.lex()

def pg_lexer(data, page):
    lexer.input(data)
    tokens = []
    while True:
        tok = lexer.token()
        if not tok:
            break
        tokens.append(tok)
    return tokens
