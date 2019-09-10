import flask
from flask import request
from flask import Blueprint
from utils.db_connection import mysql

admin_service = Blueprint("admin", __name__)

@admin_service.route("/proizvodjaci", methods=["GET"])
def dobavi_proizvodjace():
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM proizvodjac")
    rows = cursor.fetchall()

    return flask.jsonify(rows)

@admin_service.route("/dodajProizvodjaca/<string:naziv>", methods=["POST"])
def dodaj_proizvodjaca(naziv):
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''INSERT INTO proizvodjac(naziv) VALUES(%s)'''
    cursor.execute(q, (naziv))
    db.commit()

    return flask.jsonify({"status": "done"}), 201

@admin_service.route("/merneJedinice", methods=["GET"])
def merne_jedinice():
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM merna_jedinica")
    rows = cursor.fetchall()

    return flask.jsonify(rows)

@admin_service.route("/dodajMernu", methods=["POST"])
def dodaj_mernu_jedinicu():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''INSERT INTO merna_jedinica(naziv_jedinice, skracenica) VALUES(%s, %s)'''
    cursor.execute(q, (data["naziv"], data["skracenica"]))
    db.commit()

    return flask.jsonify({"status": "done"}), 201