import os
import time

import flask
from flask import jsonify, request, abort
from db_service import PlaylistDB
import mysql.connector
import logging
import requests
from genius_config import get_access_token
import uuid
import json

import mydb

blueprint = flask.Blueprint('mock_playlists',
                            __name__,
                            url_prefix="/api/playlists")


def custom_json(mycursor):
    r = [dict((mycursor.description[i][0], value) \
              for i, value in enumerate(row)) for row in mycursor.fetchall()]
    return r


def assert_playlists(playlists_json):
    playlists = dict()
    for item in playlists_json:
        if item['playlist_id'] not in playlists:
            playlists[item['playlist_id']] = {
                'id': item['playlist_id'],
                'name': item['name'],
                'description': item['description'],
                'songs': []
            }
        if item['song_id'] is not None:
            playlists[item['playlist_id']]['songs'].append({
                'id':
                item['song_id'],
                'full_title':
                item['full_title']
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


@blueprint.route("/", defaults={'path': ''}, methods=['GET', 'POST', 'DELETE'])
@blueprint.route('/<path:path>', methods=['DELETE'])
def mock(path):
    if 'userID' in flask.session:
        userid = flask.session['userID']
    else:
        abort(401, description="Missing Cookie")

    if request.method == "GET":
        myresult = PlaylistDB().find_playlists(userid)
        if not myresult:
            return jsonify({})

        return jsonify(assert_playlists(myresult))

    # Create a playlist
    if request.method == "POST":
        playlist = list(request.form.keys())[0]
        playlist = json.loads(playlist)
        playlist_id = uuid.uuid4().hex
        myresult = PlaylistDB().add_playlist(playlist, userid, playlist_id)
        if myresult:
            return jsonify(myresult)
        abort(400, description="Couldn't add a playlist")

    if request.method == "DELETE":
        playlist_id = path
        if 'userID' in flask.session:
            userid = flask.session['userID']
        else:
            abort(401, description="Missing Cookie")

        # Delete a playlist
        myresult = PlaylistDB().delete_playlist(userid, playlist_id)
        if myresult:
            return jsonify(myresult)
        abort(400, description="Couldn't delete a playlist")


@blueprint.route("/ignored", methods=['POST'])
def ignore():
    return request.get_json()


@blueprint.route("/song", methods=['POST'])
def add_song_to_playlist():
    song_at_playlist = list(request.form.keys())[0]
    song_at_playlist = json.loads(song_at_playlist)
    PlaylistDB().add_song(song_at_playlist["song"])
    playlist_id = song_at_playlist["playlist"]["id"]
    song_id = song_at_playlist["song"]["id"]
    my_result = PlaylistDB().add_song_to_playlist(playlist_id, song_id)
    return {}


@blueprint.route("/remove", methods=['POST'])
def remove_song_from_playlist():
    song_at_playlist = list(request.form.keys())[0]
    song_at_playlist = json.loads(song_at_playlist)
    playlist_id = song_at_playlist["playlist"]["id"]
    song_id = song_at_playlist["song"]["id"]
    my_result = PlaylistDB().delete_song_from_playlist(playlist_id, song_id)
    return {}
