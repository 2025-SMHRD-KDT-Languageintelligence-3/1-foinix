from flask import Flask, jsonify
import mysql.connector
import os

app = Flask(__name__)

db_config = {
    'host': 'project-db-campus.smhrd.com',
    'port': 3312,
    'user': 'mp_25K_LI3_p2_1',
    'password': 'smhrd1',
    'database': 'mp_25K_LI3_p2_1'
}

def get_db_connection():
    connection = mysql.connector.connect(
        host=db_config['host'],
        port=db_config['port'],
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database']
    )
    return connection

@app.route('/test_db')
def test_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES;")
    tables = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tables)

@app.route("/")
def home():
    return "Flask 서버 실행 중"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
