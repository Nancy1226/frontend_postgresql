import ply.yacc as yacc
from lexer import tokens

# Reglas de la gramática
def p_start(p):
    '''start : statements'''
    p[0] = p[1]

def p_statements(p):
    '''statements : statement
                  | statement statements'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[2]

def p_statement(p):
    '''statement : create_database
                 | drop_database
                 | alter_database
                 | create_table
                 | insert_into
                 | select_statement'''
    p[0] = p[1]

def p_create_database(p):
    '''create_database : SQL_KEYWORD SQL_KEYWORD IDENTIFIER SEMICOLON'''
    p[0] = ('CREATE_DATABASE', p[3])

def p_drop_database(p):
    '''drop_database : SQL_KEYWORD SQL_KEYWORD IDENTIFIER SEMICOLON'''
    p[0] = ('DROP_DATABASE', p[3])

def p_alter_database(p):
    '''alter_database : SQL_KEYWORD SQL_KEYWORD IDENTIFIER SQL_KEYWORD SQL_KEYWORD IDENTIFIER SEMICOLON'''
    p[0] = ('ALTER_DATABASE', p[3], p[6])

def p_create_table(p):
    '''create_table : SQL_KEYWORD SQL_KEYWORD IDENTIFIER LPAREN columns RPAREN SEMICOLON'''
    p[0] = ('CREATE_TABLE', p[3], p[5])

def p_columns(p):
    '''columns : column
               | column COMMA columns'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[3]

def p_column(p):
    '''column : IDENTIFIER column_type constraints'''
    p[0] = (p[1], p[2], p[3])

def p_column_type(p):
    '''column_type : INT
                   | VARCHAR LPAREN NUMBER RPAREN
                   | SQL_KEYWORD'''
    if len(p) == 2:
        p[0] = p[1]
    else:
        p[0] = f'{p[1]}({p[3]})'

def p_constraints(p):
    '''constraints : constraint
                   | constraint constraints
                   | empty'''
    if len(p) == 2:
        p[0] = [p[1]]
    elif len(p) == 3:
        p[0] = [p[1]] + p[2]
    else:
        p[0] = []

def p_constraint(p):
    '''constraint : SQL_KEYWORD SQL_KEYWORD
                  | SQL_KEYWORD'''
    if len(p) == 3:
        p[0] = f'{p[1]} {p[2]}'
    else:
        p[0] = p[1]

def p_insert_into(p):
    '''insert_into : SQL_KEYWORD SQL_KEYWORD IDENTIFIER LPAREN identifiers RPAREN SQL_KEYWORD LPAREN values RPAREN SEMICOLON'''
    p[0] = ('INSERT_INTO', p[3], p[5], p[9])

def p_identifiers(p):
    '''identifiers : IDENTIFIER
                   | IDENTIFIER COMMA identifiers'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[3]

def p_values(p):
    '''values : value
              | value COMMA values'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = [p[1]] + p[3]

def p_value(p):
    '''value : STRING
             | NUMBER'''
    p[0] = p[1]

def p_select_statement(p):
    '''select_statement : SQL_KEYWORD SQL_KEYWORD IDENTIFIER SQL_KEYWORD IDENTIFIER SEMICOLON
                        | SQL_KEYWORD SQL_KEYWORD identifiers SQL_KEYWORD IDENTIFIER SEMICOLON'''
    if len(p) == 6:
        p[0] = ('SELECT', '*', p[3])
    else:
        p[0] = ('SELECT', p[3], p[5])

def p_empty(p):
    'empty :'
    p[0] = None

def p_error(p):
    print(f"Syntax error at '{p.value}'")

parser = yacc.yacc()

def pg_parser(tokens, page):
    parser.error = 0
    result = parser.parse(tokens)
    return result
