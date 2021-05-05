import os
import time

import flask
from flask import jsonify
from flask import request
import logging
import requests

blueprint = flask.Blueprint('mock_recommended', __name__, url_prefix="/api")


@blueprint.route("/recommended", methods=['POST'])
def mock():
    # Return all the songs in playlists back
    content = request.get_json()
    songs = []
    for playlist in content:
        for song in playlist['songs']:
            songs.append(song)

    return jsonify(songs)
