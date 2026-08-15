# SP Talkies — Complete Node 24 Demo

A full cinematic SP Talkies website with:
- Premium responsive public site
- Films / productions catalogue
- Featured titles
- Movie detail modal
- About, services, news and contact sections
- Admin login
- Add / Edit / Delete productions
- Poster uploads
- Trailer URL
- Featured toggle
- JSON persistent data
- Express 5 compatible with Node.js 24
- No SQLite, better-sqlite3, Python or node-gyp

## Run
Open PowerShell in this folder:

npm install
npm start

Open http://localhost:3000

Admin: http://localhost:3000/admin.html

Demo credentials:
Username: admin
Password: SPTalkies@123

Data:
data/movies.json
Posters:
public/uploads/

## Production note
For a public production deployment, set ADMIN_USER, ADMIN_PASSWORD and SESSION_SECRET as environment variables and replace JSON/local uploads with persistent managed storage/database.
