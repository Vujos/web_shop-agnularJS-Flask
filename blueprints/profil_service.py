import flask
from flask import Blueprint
from flask import request
from utils.db_connection import mysql

profil_service = Blueprint("profil_service", __name__)

@profil_service.route("/dobaviAdresu/<int:id_korisnika>", methods=["GET"])
def dobaviAdresu(id_korisnika):
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * FROM korisnik LEFT JOIN adresa ON adresa.id = adresa_id LEFT JOIN grad ON grad.id = adresa.grad_id LEFT JOIN drzava ON drzava.id = grad.drzava_id WHERE korisnik.id=%s", id_korisnika)
    row = cursor.fetchone()

    return flask.jsonify(row)

@profil_service.route("/dobaviDrzave", methods=["GET"])
def dobaviDrzave():
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * from drzava")
    row = cursor.fetchall()

    return flask.jsonify(row)

@profil_service.route("/dobaviGradove/<int:id_drzave>", methods=["GET"])
def dobaviGradove(id_drzave):
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT * from grad WHERE drzava_id = %s", id_drzave)
    row = cursor.fetchall()

    return flask.jsonify(row)

@profil_service.route("/izmeniProfil", methods=["PUT"])
def izmeni_profil():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''UPDATE korisnik SET email=%s, telefon=%s, ime=%s, prezime=%s WHERE id=%s'''
    cursor.execute(q, (data["email"], data["telefon"], data["ime"], data["prezime"], data["id"]))
    db.commit()

    return flask.jsonify({"status": "done"}), 201
    
@profil_service.route("/izmeniAdresu", methods=["PUT"])
def izmeni_adresu():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()
    q = '''UPDATE adresa SET postanski_broj=%s, ulica=%s,
    broj=%s, grad_id=%s WHERE id=%s'''
    cursor.execute(q, (data["postanski_broj"], data["ulica"], data["broj"],
    data["grad_id"], data["adresa_id"]))
    db.commit()

    return flask.jsonify({"status": "done"}), 201
