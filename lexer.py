import ply.lex as lex

tokens = (
    'SQL_KEYWORD',
    'IDENTIFIER',
    'SEMICOLON',
    'COMMA',
    'LPAREN',
    'RPAREN',
    'INT',
    'VARCHAR',
    'STRING',
    'NUMBER',
    'DIGIT',    # Añadir token para dígito
    'ID',       # Añadir token para id
    'ILLEGAL'   # Añadir un token para caracteres ilegales
)

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
    'VALUES': 'SQL_KEYWORD',
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
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    t.type = reserved.get(t.value.upper(), 'ID')  # Cambiar IDENTIFIER a ID
    return t

t_SEMICOLON = r';'
t_COMMA = r','
t_LPAREN = r'\('
t_RPAREN = r'\)'
t_STRING = r'\'[^\']*\''

def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    if len(str(t.value)) == 1:  # Si el número tiene un solo dígito
        t.type = 'DIGIT'
    else:
        t.type = 'NUMBER'
    return t

# Define un token para caracteres ilegales
def t_ILLEGAL(t):
    r'.'
    t.type = 'ILLEGAL'
    return t

t_ignore = ' \t\n'

def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)

lexer = lex.lex()

def pg_lexer(data):
    lexer.input(data)
    tokens = []
    while True:
        tok = lexer.token()
        if not tok:
            break
        tokens.append(tok)
    return tokens
