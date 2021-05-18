import flask
import db_config
import mysql.connector


def custom_json(mycursor):
    r = [
        dict((mycursor.description[i][0], value)
             for i, value in enumerate(row)) for row in mycursor.fetchall()
    ]
    return r


def playlist_json(playlist_id, name, description='', songs=[]):
    return {
        "id": playlist_id,
        "name": name,
        "description": description,
        "songs": songs
    }


class PlaylistDB:
    def playlists_db_remote_connection(self):
        username, password, host, database = db_config.get_config()
        mydb = mysql.connector.connect(username=username,
                                       password=password,
                                       host=host,
                                       database=database)
        return mydb

    def add_user(self, user_id):
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        try:
            mycursor.execute("Insert INTO user(user_id) values(%s);",
                             (user_id, ))
            mydb.commit()
        except:
            mycursor.close()
            return False
        mycursor.close()
        return True

    def check_user(self, user_id):
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        try:
            mycursor.execute("SELECT user_id FROM user WHERE user_id = %s;",
                             (user_id, ))
        except:
            mycursor.close()
            return False
        myresult = custom_json(mycursor)
        mycursor.close()
        if len(myresult):
            return True
        return False

    def find_playlists(self, user_id):
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        try:
            mycursor.execute(
                "SELECT playlist.playlist_id, playlist.name, playlist.description, song.song_id, song.full_title\
                  FROM playlist\
                  LEFT JOIN playlist_song\
                    ON playlist.playlist_id = playlist_song.playlist_id\
                  LEFT JOIN song\
                    ON song.song_id = playlist_song.song_id\
                  WHERE playlist.user_id = %s;", (user_id, ))
        except:
            mycursor.close()
            return False
        myresult = custom_json(mycursor)
        mycursor.close()
        if len(myresult):
            return myresult
        return False

    def add_playlist(self, playlist, user_id, playlist_id):
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        name, description = playlist["name"], playlist["description"]
        try:
            mycursor.execute(
                "INSERT INTO playlist (playlist_id, user_id, name, description)\
                VALUES (%s, %s, %s, %s);",
                (playlist_id, user_id, name, description))
            mydb.commit()
        except:
            mycursor.close()
            return False
        mycursor.close()
        return playlist_json(playlist_id, name, description)

    def delete_playlist(self, user_id, playlist_id):
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()

        try:
            mycursor.execute(
                "DELETE FROM playlist\
                  WHERE playlist_id = %s\
                  AND user_id = %s;", (playlist_id, user_id))
            mydb.commit()
        except:
            mycursor.close()
            return False
        mycursor.close()
        return True

    def find_song(self, song_id):  # Maybe redundant
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        try:
            mycursor.execute("SELECT * FROM song WHERE song_id = %s;",
                             (song_id, ))
            mydb.commit()
        except:
            mycursor.close()
            return False
        myresult = custom_json(mycursor)
        mycursor.close()
        if len(myresult):  #TODO: Test this
            return True
        return False

    def add_song(self, song):  # Possibly redundant
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        song_id, full_title, title, primary_artist_name, header_image_url = song["id"],\
            song["full_title"], song["title"], song["primary_artist_name"], song["header_image_url"]
        try:
            mycursor.execute(
                "INSERT IGNORE INTO song (song_id, title, full_title, primary_artist_name, header_image_url)\
                VALUES (%s, %s, %s, %s, %s);",
                (song_id, title, full_title, primary_artist_name,
                 header_image_url))
            mydb.commit()
        except:
            mycursor.close()
            return False
        mycursor.close()
        return True

    def delete_song(self, song_id):  # Possibly redundant
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        try:
            mycursor.execute(
                "DELETE FROM song WHERE \
                song_id = %s;", (song_id, ))
            mydb.commit()
        except:
            mycursor.close()
            return False
        mycursor.close()
        return True

    def add_song_to_playlist(self, playlist_id, song_id):
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        try:
            mycursor.execute(
                "INSERT INTO playlist_song (playlist_id, song_id)\
          VALUES (%s, %s);", (playlist_id, song_id))
            mydb.commit()
        except:
            mycursor.close()
            return False
        mycursor.close()
        return True

    def delete_song_from_playlist(self, playlist_id, song_id):
        mydb = self.playlists_db_remote_connection()
        mycursor = mydb.cursor()
        try:
            mycursor.execute(
                "DELETE FROM playlist_song WHERE\
          playlist_id = %s AND song_id = %s;", (playlist_id, song_id))
            mydb.commit()
        except:
            mycursor.close()
            return False
        mycursor.close()
        return True
