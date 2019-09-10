import datetime
import flask
from flask import Flask
from utils.db_connection import mysql
from flask import request
from flask import session

from blueprints.simple_login import simple_login
from blueprints.proizvodi_service import proizvodi_service
from blueprints.profil_service import profil_service
from blueprints.korpa_service import korpa_service
from blueprints.admin_service import admin_service
from blueprints.kategorije_service import kategorije_service
from blueprints.racun_service import racun_service

app = Flask(__name__, static_url_path="")

app.secret_key = "NEKI_RANDOM_STRING"

app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "mysql2acc"
app.config["MYSQL_DATABASE_DB"] = "web_shop"
app.config["MYSQL_DATABASE_HOST"] = "localhost"

mysql.init_app(app)

app.register_blueprint(simple_login)
app.register_blueprint(profil_service)
app.register_blueprint(proizvodi_service)
app.register_blueprint(korpa_service)
app.register_blueprint(admin_service)
app.register_blueprint(kategorije_service)
app.register_blueprint(racun_service)

@app.route("/")
@app.route("/index")
@app.route("/index.html")
def home():
    return app.send_static_file("index.html")
app.run("0.0.0.0", 8000, threaded=True)