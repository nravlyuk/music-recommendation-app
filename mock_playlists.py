import os
import time

import flask
from flask import jsonify
import logging
import requests

blueprint = flask.Blueprint('mock_playlists', __name__, url_prefix="/api")


@blueprint.route("/playlists", methods=['GET', 'DELETE'])
def mock():
    mock_playlists = {
        "playlists": [{
            "id":
            11,
            "name":
            "Playlist 1",
            "description":
            "This is a playlist 1 description",
            "songs": [{
                "id": 1,
                "title": "Song 1"
            }, {
                "id": 2,
                "title": "Song 2"
            }, {
                "id": 3,
                "title": "Song 3"
            }]
        }, {
            "id":
            12,
            "name":
            "Playlist 2",
            "description":
            "Playlist 3 has no description",
            "songs": [{
                "id": 4,
                "title": "Song 4"
            }, {
                "id": 5,
                "title": "Song 5"
            }, {
                "id": 6,
                "title": "Song 6"
            }]
        }, {
            "id":
            13,
            "name":
            "Playlist 3",
            "songs": [{
                "id": 7,
                "title": "Song 7"
            }, {
                "id": 8,
                "title": "Song 8"
            }, {
                "id": 9,
                "title": "Song 9"
            }]
        }],
        "ignored": [{
            "id": 7,
            "title": "Song 10"
        }, {
            "id": 8,
            "title": "Song 11"
        }, {
            "id": 9,
            "title": "Song 12"
        }]
    }

    return jsonify(mock_playlists)
