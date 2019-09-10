import flask
import json
import os
import fnmatch
import time
from flask import request
from flask import Blueprint
from utils.db_connection import mysql



korpa_service = Blueprint("korpa", __name__)

@korpa_service.route("/dodajUkorpu/<int:id_proizvoda>", methods=["POST"])
def dodajUKorpu(id_proizvoda):
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()

    q = '''INSERT INTO korpa_proizvod(korpa_id, kolicina, proizvod_id)
            VALUES(%s, %s, %s)'''
    cursor.execute(q, (data["korpa_id"], data["kolicina"], id_proizvoda))
    db.commit()
    
    return flask.jsonify({"status": "done"}), 201

@korpa_service.route("/dobaviIzKorpe/<int:id_korpe>", methods=["GET"])
def dobaviIzKorpe(id_korpe):
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM korpa_proizvod LEFT JOIN proizvod ON proizvod_id = proizvod.id WHERE korpa_id = %s AND proizvod.postoji = 1", id_korpe)
    rows = cursor.fetchall()

    for x in range(0, len(rows)):
        files = os.listdir("static/proizvodi")
        slika = fnmatch.filter(files, "proizvod_{0}.*".format(rows[x]["id"]))
        if slika != []:
            rows[x]["slika"] = slika[0]

    return flask.jsonify(rows)

@korpa_service.route("/dobaviSaRacuna/<int:id_korisnika>", methods=["GET"])
def dobaviSaRacuna(id_korisnika):
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT racun_id FROM korisnik_racun WHERE korisnik_id = %s", id_korisnika)
    id_racuna = cursor.fetchall()
    rows = []
    for x in range(0, len(id_racuna)):
        q = '''SELECT * FROM racun_proizvod LEFT JOIN proizvod ON proizvod_id = proizvod.id 
            LEFT JOIN racun ON racun_id = racun.id WHERE racun_id = %s'''
        cursor.execute(q, id_racuna[x]["racun_id"])
        row = cursor.fetchall()
        if row is not None:
            for x in row:
                rows.append(x)

    for x in range(0, len(rows)):
        files = os.listdir("static/proizvodi")
        slika = fnmatch.filter(files, "proizvod_{0}.*".format(rows[x]["id"]))
        if slika != []:
            rows[x]["slika"] = slika[0]

    return flask.jsonify(rows)

@korpa_service.route("/izmeniKorpu/<int:id_korpe>", methods=["PUT"])
def izmeni_korpu():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''UPDATE korpa_proizvod SET kolicina=%s WHERE korpa_id=%s AND proizvod_id = %s'''
    cursor.execute(q, (data["kolicina"], data["korpa_id"], data["proizvod_id"]))
    db.commit()

    return flask.jsonify({"status": "done"}), 201

@korpa_service.route("/ukloniIzKorpe/<int:id_korpe>/<int:id_proizvoda>", methods=["DELETE"])
def ukloni(id_korpe, id_proizvoda):
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''DELETE FROM korpa_proizvod WHERE korpa_id=%s AND proizvod_id = %s'''
    cursor.execute(q, (id_korpe, id_proizvoda))
    db.commit()

    return flask.jsonify({"status": "done"}), 201

@korpa_service.route("/ukloniSveIzKorpe/<int:id_korpe>", methods=["DELETE"])
def ukloniSveIzKorpe(id_korpe):
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''DELETE FROM korpa_proizvod WHERE korpa_id=%s'''
    cursor.execute(q, (id_korpe))
    db.commit()

    return flask.jsonify({"status": "done"}), 201