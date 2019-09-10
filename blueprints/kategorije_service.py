import flask
from flask import request
from flask import Blueprint
from utils.db_connection import mysql

kategorije_service = Blueprint("kategorije", __name__)

@kategorije_service.route("/dodajKategoriju/<string:naziv_kategorije>", methods=["POST"])
def dodaj_kategoriju(naziv_kategorije):
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''INSERT INTO kategorija(naziv) VALUES(%s)'''
    cursor.execute(q, (naziv_kategorije))
    db.commit()

    return flask.jsonify({"status": "done"}), 201

@kategorije_service.route("/kategorije", methods=["GET"])
def sve_kategorije():
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM kategorija")
    rows = cursor.fetchall()

    return flask.jsonify(rows)
