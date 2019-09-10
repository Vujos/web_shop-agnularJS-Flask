import flask
import json
import os
import fnmatch
from flask import request
from flask import Blueprint
from utils.db_connection import mysql

proizvodi_service = Blueprint("proizvodi", __name__)

@proizvodi_service.route("/proizvodi", methods=["GET"])
def proizvodi():
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM proizvod WHERE postoji=1 AND kolicina > 0")
    rows = cursor.fetchall()

    for x in range(0, len(rows)):
        files = os.listdir("static/proizvodi")
        slika = fnmatch.filter(files, "proizvod_{0}.*".format(rows[x]["id"]))
        if slika != []:
            rows[x]["slika"] = slika[0]

    return flask.jsonify(rows)

@proizvodi_service.route("/proizvodi/<int:id_kategorije>", methods=["GET"])
def proizvodi_kategorije(id_kategorije):
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM proizvod WHERE postoji=1 AND kolicina > 0 AND kategorija_id=%s", id_kategorije)
    rows = cursor.fetchall()

    for x in range(0, len(rows)):
        files = os.listdir("static/proizvodi")
        slika = fnmatch.filter(files, "proizvod_{0}.*".format(rows[x]["id"]))
        if slika != []:
            rows[x]["slika"] = slika[0]

    return flask.jsonify(rows)

@proizvodi_service.route("/ukloniProizvod/<int:proizvod_id>", methods=["PUT"])
def izbrisi_proizvod(proizvod_id):
    db = mysql.get_db()
    cursor = db.cursor()

    cursor.execute("UPDATE proizvod SET postoji=0 WHERE id=%s", proizvod_id)
    db.commit()

    return flask.jsonify({"status": "done"}), 201

@proizvodi_service.route("/proizvod/<int:proizvod_id>", methods=["GET"])
def proizvod(proizvod_id):
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM proizvod LEFT JOIN merna_jedinica ON proizvod.merna_jedinica_id = merna_jedinica.id LEFT JOIN kategorija ON proizvod.kategorija_id = kategorija.id WHERE proizvod.id=%s", proizvod_id)
    row = cursor.fetchone()

    
    files = os.listdir("static/proizvodi")
    slika = fnmatch.filter(files, "proizvod_{0}.*".format(proizvod_id))
    if slika != []:
        row["slika"] = slika[0]

    return flask.jsonify(row)

@proizvodi_service.route("/sortiranje/<string:obrnuto>/<string:tip>", methods=["GET"])
def sortiraj(obrnuto, tip):
    if obrnuto == "da":
        obrnuto = " DESC"
    else:
        obrnuto = ""

    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM proizvod WHERE postoji=1 AND kolicina > 0 order by " + tip + obrnuto)
    rows = cursor.fetchall()

    for x in range(0, len(rows)):
        files = os.listdir("static/proizvodi")
        slika = fnmatch.filter(files, "proizvod_{0}.*".format(rows[x]["id"]))
        if slika != []:
            rows[x]["slika"] = slika[0]

    return flask.jsonify(rows)

@proizvodi_service.route("/sortiranje/<string:obrnuto>/<string:tip>/<int:id_kategorije>", methods=["GET"])
def sortiraj_po_kategoriji(obrnuto, tip, id_kategorije):
    if obrnuto == "da":
        obrnuto = " DESC"
    else:
        obrnuto = ""

    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM proizvod WHERE postoji=1 AND kolicina > 0 AND kategorija_id = %s order by " + tip + obrnuto, id_kategorije)
    rows = cursor.fetchall()

    for x in range(0, len(rows)):
        files = os.listdir("static/proizvodi")
        slika = fnmatch.filter(files, "proizvod_{0}.*".format(rows[x]["id"]))
        if slika != []:
            rows[x]["slika"] = slika[0]

    return flask.jsonify(rows)

@proizvodi_service.route("/izmeniProizvod/<int:proizvod_id>", methods=["PUT"])
def izmena_proizvoda(proizvod_id):
    data = json.loads(request.form.to_dict()["podaciOProizvodu"])
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''UPDATE proizvod SET naziv=%s, cena=%s, kolicina=%s, opis=%s, 
    merna_jedinica_id=%s, kategorija_id=%s, proizvodjac_id=%s WHERE id=%s'''
    cursor.execute(q, (data["naziv"], data["cena"], data["kolicina"], data["opis"], 
    data["merna_jedinica_id"],  data["kategorija_id"], data["proizvodjac_id"], proizvod_id))
    db.commit()

    if request.files.get("slika") is not None:
        uploaded_file = request.files.get("slika")
        ext = os.path.splitext(uploaded_file.filename)[1]

        uploaded_file.save("static/proizvodi/proizvod_{0}{1}".format(data["id"], ext))

        files = os.listdir("static/proizvodi")
        slike = fnmatch.filter(files, "proizvod_{0}.*".format(data["id"]))
        for slika in slike:
            if os.path.splitext(slika)[1] != ext:
                os.remove(os.path.join("static/proizvodi", slika))
        

    return flask.jsonify({"status": "done"}), 201

@proizvodi_service.route("/dodajProizvod", methods=["POST"])
def dodavanje_proizvoda():
    data = json.loads(request.form.to_dict()["podaciOProizvodu"])
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''INSERT INTO proizvod (naziv, cena, kolicina, opis, merna_jedinica_id, 
    kategorija_id, proizvodjac_id) VALUES (%s, %s, %s, %s, %s, %s, %s)'''
    cursor.execute(q, (data["naziv"], data["cena"], data["kolicina"], data["opis"], 
    data["merna_jedinica_id"],  data["kategorija_id"], data["proizvodjac_id"]))
    db.commit()

    id = cursor.lastrowid

    if request.files.get("slika") is not None:
        uploaded_file = request.files.get("slika")
        ext = os.path.splitext(uploaded_file.filename)[1]

        uploaded_file.save("static/proizvodi/proizvod_{0}{1}".format(id, ext))

        files = os.listdir("static/proizvodi")
        slike = fnmatch.filter(files, "proizvod_{0}.*".format(id))
        for slika in slike:
            if os.path.splitext(slika)[1] != ext:
                os.remove(os.path.join("static/proizvodi", slika))
        

    return flask.jsonify({"status": "done"}), 201