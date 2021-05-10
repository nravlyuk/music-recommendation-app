import os
import time

import flask
from flask import jsonify, request, abort
import mysql.connector
import logging
import requests
from rauth import OAuth2Service
import genius_config

import mydb

blueprint = flask.Blueprint('genius', __name__, url_prefix="/api")
#if flask.current_app.config['DEBUG']:
redirect_uri = 'http://localhost:5000/api/genius/success'
#else:
#redirect_uri = 'https://striped-guard-312322.wl.r.appspot.com/api/genius/success'


@blueprint.route("/genius", methods=['GET'])
def register():
    if 'userID' in flask.session:
        userid = flask.session['userID']
    else:
        abort(401, description="Missing Cookie")

    genius = genius_config.get_rauth()

    params = {
        'scope': 'me',
        'response_type': 'code',
        'redirect_uri': redirect_uri
    }

    url = genius.get_authorize_url(**params)

    return flask.redirect(url)


@blueprint.route("/genius/success", methods=['GET'])
def success():
    genius = genius_config.get_rauth()
    session = genius.get_auth_session(data={
        'code': 'foo',
        'redirect_uri': redirect_uri
    })

    print(session.get('me').json()['username'])

    return "Genius success"
