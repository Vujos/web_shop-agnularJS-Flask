import flask
import json
import time
from flask import request
from flask import Blueprint
from utils.db_connection import mysql

racun_service = Blueprint("racuni", __name__)

@racun_service.route("/napraviRacun/<int:korisnik_id>", methods=["POST"])
def napraviRacun(korisnik_id):
    db = mysql.get_db()
    cursor = db.cursor()
    datum = time.strftime('%Y-%m-%d %H:%M:%S')

    cursor.execute("INSERT INTO racun(datum) VALUES(%s)", (datum))
    racun_id = cursor.lastrowid

    cursor.execute("INSERT INTO korisnik_racun(korisnik_id, racun_id) VALUES(%s, %s)", (korisnik_id, racun_id))
    db.commit()
    return flask.jsonify({"status": "done"}), 201

@racun_service.route("/kupiProizvod", methods=["POST"])
def kupiProizvod():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id FROM racun ORDER BY id DESC LIMIT 1")
    id_racuna = cursor.fetchone()

    cursor.execute("SELECT cena FROM proizvod WHERE id=%s", data["id"])
    cena = cursor.fetchone()

    q = '''INSERT INTO racun_proizvod(racun_id, proizvod_id, cena, kolicina) VALUES(%s, %s, %s, %s)'''

    cursor.execute(q, (id_racuna["id"], data["id"], cena["cena"], data["kolicina"]))

    db.commit()
    return flask.jsonify({"status": "done"}), 201

@racun_service.route("/kupljeniProizvod", methods=["PUT"])
def kupljeni_proizvod():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''UPDATE proizvod SET kolicina = kolicina - %s WHERE id=%s'''
    cursor.execute(q, (data["kolicina"], data["id"]))
    db.commit()

    return flask.jsonify({"status": "done"}), 201

@racun_service.route("/kupiProizvode", methods=["POST"])
def kupiProizvode():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id FROM racun ORDER BY id DESC LIMIT 1")
    id_racuna = cursor.fetchone()

    q = '''INSERT INTO racun_proizvod(racun_id, proizvod_id, cena, kolicina) VALUES(%s, %s, %s, %s)'''

    print(data)

    for x in data:
        print(x)
        cursor.execute("SELECT cena FROM proizvod WHERE id=%s", x["proizvod_id"])
        cena = cursor.fetchone()

        cursor.execute(q, (id_racuna["id"], x["proizvod_id"], cena["cena"], x["kolicina"]))

    db.commit()
    return flask.jsonify({"status": "done"}), 201

@racun_service.route("/kupljeniProizvodi", methods=["PUT"])
def kupljeni_proizvodi():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''UPDATE proizvod SET kolicina = kolicina - %s WHERE id=%s'''

    for x in data:
        cursor.execute(q, (x["kolicina"], x["id"]))
    db.commit()

    return flask.jsonify({"status": "done"}), 201