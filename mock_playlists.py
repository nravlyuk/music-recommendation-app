import os
import time

import flask
from flask import jsonify, request, abort
from db_service import PlaylistDB
import mysql.connector
import logging
import requests
from genius_config import get_access_token

import mydb

blueprint = flask.Blueprint('mock_playlists', __name__, url_prefix="/api")


def custom_json(mycursor):
    r = [dict((mycursor.description[i][0], value) \
              for i, value in enumerate(row)) for row in mycursor.fetchall()]
    return r


def assert_playlists(playlists_json):
    playlists = dict()
    for item in playlists_json:
        if item['playlistId'] not in playlists:
            playlists[item['playlistId']] = {
                'playlistId': item['playlistId'],
                'name': item['name'],
                'songs': []
            }
        if item['songId'] is not None:
            playlists[item['playlistId']]['songs'].append({
                'id':
                item['songId'],
                'title':
                item['title']
            })

    playlists_arr = list(playlists.values())

    response = {
        "playlists":
        playlists_arr,
        "ignored": [{
            "id": 7,
            "title": "Song 10"
        }, {
            "id": 8,
            "title": "Song 11"
        }, {
            "id": 9,
            "title": "Song 12"
        }],
        "access_token":
        get_access_token()
    }

    return response


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

    if 'userID' in flask.session:
        userid = flask.session['userID']
    else:
        abort(401, description="Missing Cookie")

    if request.method == "GET":
        myresult = PlaylistDB().find_playlists(userid)

        return jsonify(assert_playlists(myresult))


@blueprint.route("/ignored", methods=['POST'])
def ignore():
    return request.get_json()
