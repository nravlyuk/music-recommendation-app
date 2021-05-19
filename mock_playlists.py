import os
import time

import flask
from flask import jsonify
import logging
import requests

blueprint = flask.Blueprint('mock_playlists',
                            __name__,
                            url_prefix="/api/playlists")


@blueprint.route("/")
def mock():
    mock_playlists = [{
        "id":
        11,
        "name":
        "Kendrick Lamar Playlist",
        "description":
        "This playlist consists of Kendrick Lamar songs",
        "songs": [{
            "id": 3039923,
            "title": "HUMBLE. by Kendrick Lamar"
        }, {
            "id": 90478,
            "title": "​m.A.A.d city by Kendrick Lamar (Ft. MC Eiht)"
        }, {
            "id": 81159,
            "title": "Swimming Pools (Drank) by Kendrick Lamar"
        }]
    }, {
        "id":
        12,
        "name":
        "Adele",
        "description":
        "Best Adele songs",
        "songs": [{
            "id": 2332455,
            "title": "Hello by Adele"
        }, {
            "id": 51294,
            "title": "Someone Like You by Adele"
        }, {
            "id": 2336628,
            "title": "When We Were Young by Adele"
        }]
    }]

    return jsonify(mock_playlists)
