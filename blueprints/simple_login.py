import hashlib
import flask
from flask import Blueprint
from flask import request
from flask import session
from utils.db_connection import mysql

simple_login = Blueprint("simple_login", __name__)

@simple_login.route("/login", methods=["POST"])
def login():
    login_user = request.json
    cursor = mysql.get_db().cursor()
    lozinka = hashlib.md5(login_user["password"].encode())

    cursor.execute("SELECT id FROM korisnik WHERE korisnicko_ime=%s AND lozinka=%s", (login_user["username"], lozinka.hexdigest()))
    user = cursor.fetchone()

    if user is not None:
        session["user"] = user
        return flask.jsonify({"success": True})

    return flask.jsonify({"success": False})

@simple_login.route("/autorizovan", methods=["POST"])
def autorizovan():
    login_user = request.json
    cursor = mysql.get_db().cursor()
    cursor.execute("SELECT korisnik.id FROM korisnik LEFT JOIN grupa ON grupa_id = grupa.id WHERE korisnik.id=%s AND grupa.skracenica=%s", (login_user["id"], login_user["skracenica"]))
    admin = cursor.fetchone()

    if admin is not None:
        return flask.jsonify({"success": True})

    return flask.jsonify({"success": False})

@simple_login.route("/loggedInUser", methods=["GET"])
def logged_in_user():
    if session.get("user") is not None:
        login_user = request.json
        cursor = mysql.get_db().cursor()
        cursor.execute("SELECT * FROM korisnik LEFT JOIN grupa ON grupa.id = grupa_id WHERE korisnik.id=%s", (session.get("user")["id"]))
        user = cursor.fetchone()

        return flask.jsonify(user)
    else:
        return "Access denied!", 401

@simple_login.route("/isLoggedin", methods=["GET"])
def is_loggedin():
    return flask.jsonify(session.get("user") is not None)

@simple_login.route("/logout", methods=["GET"])
def logout():
    session.pop("user", None)
    return flask.jsonify({"success": True})

@simple_login.route("/registracija", methods=["POST"])
def registracija():
    data = request.json
    db = mysql.get_db()
    cursor = db.cursor()
    
    q = ''' INSERT INTO korpa(id) VALUES (null)'''
    cursor.execute(q)

    korpa_id = cursor.lastrowid

    q = ''' INSERT INTO adresa(id) VALUES (null)'''
    cursor.execute(q)
    
    adresa_id = cursor.lastrowid
    
    q = '''INSERT INTO korisnik(korisnicko_ime, email, lozinka, korpa_id, adresa_id)
            VALUES(%s, %s, %s, %s, %s)'''

    lozinka = hashlib.md5(data["lozinka"].encode())

    cursor.execute(q, (data["korisnicko"], data["email"], lozinka.hexdigest(), korpa_id, adresa_id))
    db.commit()

    return flask.jsonify({"status": "done"}), 201