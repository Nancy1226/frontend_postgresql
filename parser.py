import ply.yacc as yacc
from lexer import tokens

def p_statements(p):
    '''statements : statement
                  | statements statement'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[2]]

def p_statement(p):
    '''statement : create_database
                 | drop_database
                 | alter_database
                 | create_table
                 | insert_into
                 | select_from'''
    p[0] = p[1]

def p_create_database(p):
    '''create_database : SQL_KEYWORD SQL_KEYWORD IDENTIFIER SEMICOLON'''
    p[0] = {
        'command': 'CREATE DATABASE',
        'databaseName': p[3]
    }

def p_drop_database(p):
    '''drop_database : SQL_KEYWORD SQL_KEYWORD IDENTIFIER SEMICOLON'''
    p[0] = {
        'command': 'DROP DATABASE',
        'databaseName': p[3]
    }

def p_alter_database(p):
    '''alter_database : SQL_KEYWORD SQL_KEYWORD IDENTIFIER SQL_KEYWORD SQL_KEYWORD IDENTIFIER SEMICOLON'''
    p[0] = {
        'command': 'ALTER DATABASE',
        'oldName': p[3],
        'newName': p[6]
    }

def p_create_table(p):
    '''create_table : SQL_KEYWORD SQL_KEYWORD IDENTIFIER LPAREN column_definitions RPAREN SEMICOLON'''
    p[0] = {
        'command': 'CREATE TABLE',
        'tableName': p[3],
        'columns': p[5]
    }

def p_column_definitions(p):
    '''column_definitions : column_definition
                          | column_definitions COMMA column_definition'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[3]]

def p_column_definition(p):
    '''column_definition : IDENTIFIER column_type
                         | IDENTIFIER column_type SQL_KEYWORD'''
    column_def = {
        'name': p[1],
        'type': p[2]
    }
    if len(p) == 4 and p[3].upper() == 'NULL':
        column_def['nullable'] = False
    else:
        column_def['nullable'] = True
    p[0] = column_def

def p_column_type(p):
    '''column_type : INT
                   | VARCHAR LPAREN NUMBER RPAREN
                   | SQL_KEYWORD'''
    if len(p) == 2:
        p[0] = p[1]
    else:
        p[0] = f"VARCHAR({p[3]})"

def p_insert_into(p):
    '''insert_into : SQL_KEYWORD SQL_KEYWORD IDENTIFIER LPAREN column_list RPAREN SQL_KEYWORD LPAREN value_list RPAREN SEMICOLON'''
    p[0] = {
        'command': 'INSERT INTO',
        'tableName': p[3],
        'columns': p[5],
        'values': p[9]
    }

def p_column_list(p):
    '''column_list : IDENTIFIER
                   | column_list COMMA IDENTIFIER'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[3]]

def p_value_list(p):
    '''value_list : value
                  | value_list COMMA value'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[3]]

def p_value(p):
    '''value : STRING
             | NUMBER'''
    p[0] = p[1]

def p_select_from(p):
    '''select_from : SQL_KEYWORD SQL_KEYWORD SQL_KEYWORD IDENTIFIER SEMICOLON'''
    p[0] = {
        'command': 'SELECT * FROM',
        'tableName': p[4]
    }

def p_error(p):
    print(f"Syntax error at '{p.value}'")

parser = yacc.yacc()

def pg_parser(data):
    return parser.parse(data)
