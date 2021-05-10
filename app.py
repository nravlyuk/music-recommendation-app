import os

import flask
import flask_cors
from dotenv import load_dotenv

import example
import mock_playlists
import mock_recommended
#import genius_api
from db_service import PlaylistDB
import uuid

load_dotenv()

# Set up the static folder to serve our angular client resources (*.js, *.css)
app = flask.Flask(__name__,
                  static_folder='dist/client',
                  static_url_path='/client/')
app.register_blueprint(example.blueprint)
app.register_blueprint(mock_playlists.blueprint)
app.register_blueprint(mock_recommended.blueprint)
#app.register_blueprint(genius_api.blueprint)

# If we're running in debug, defer to the typescript development server
# This gets us things like live reload and better sourcemaps.
if app.config['DEBUG']:
    app.config['API_URL'] = os.getenv(
        'DEBUG_API_URL') or 'http://localhost:5000'
    app.config['ORIGIN'] = os.getenv('DEBUG_ORIGIN') or 'http://localhost:4200'

    flask_cors.CORS(app,
                    allow_headers='*',
                    origins=[app.config['ORIGIN']],
                    supports_credentials=True)
else:
    app.config['API_URL'] = os.getenv('PROD_API_URL')

# Set the secret key to enable access to session data.
app.secret_key = os.urandom(24)


# Set a cookie.
@app.route('/cookie/')
def cookie():
    res = flask.make_response("Setting a cookie")
    cookie = flask.request.cookies.get('userID')
    print(cookie)
    if not cookie:
        res.set_cookie('userID',
                       uuid.uuid4().hex,
                       max_age=60 * 60 * 24 * 365 * 2)
    return res


# A catch-all route to serve the angular app.
# If no other routes match (such as /example) this will be called, and the
# angular app will take over routing.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_angular(path):
    if flask.current_app.config['DEBUG']:
        target = '/'.join([
            flask.current_app.config['ORIGIN'].rstrip('/'),
            app.static_url_path.strip('/'),
            path.lstrip('/')
        ])

        res = flask.redirect(target)

    else:
        res = flask.send_file('dist/client/index.html')

    cookie_id = flask.request.cookies.get('userID')
    if not cookie_id:
        cookie_id = uuid.uuid4().hex
        #res = flask.redirect('api/genius')
        if not PlaylistDB().add_user(cookie_id):
            flask.abort(401, description="DB is unreachable")
    else:
        if not PlaylistDB().check_user(cookie_id):
            flask.abort(401, description="Error in user checking")
    res.set_cookie('userID', cookie_id, max_age=60 * 60 * 24 * 365 * 2)
    flask.session['userID'] = cookie_id

    return res
