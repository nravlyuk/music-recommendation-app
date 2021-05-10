import flask
import db_config
import mysql.connector


def custom_json(mycursor):
    r = [
        dict((mycursor.description[i][0], value)
             for i, value in enumerate(row)) for row in mycursor.fetchall()
    ]
    return r


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
            mycursor.execute("Insert INTO user(userId) values(%s)",
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
            mycursor.execute("SELECT userId FROM user WHERE userId = %s",
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
                "SELECT playlist.playlistId, playlist.name, playlist.description, song.songId, song.title\
                  FROM playlist\
                  LEFT JOIN playlist_song\
                    ON playlist.playlistId = playlist_song.playlistId\
                  LEFT JOIN song\
                    ON song.songId = playlist_song.songId\
                  WHERE playlist.userId = %s;", (user_id, ))
        except:
            mycursor.close()
            return False
        myresult = custom_json(mycursor)
        mycursor.close()
        if len(myresult):
            return myresult
        return False
