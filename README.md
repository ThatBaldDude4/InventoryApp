This project requires a postgresql database

## Stack
- Database: Postgresql
- Backend: Node.js and Express
- Frontend: HTML and CSS

```mermaid
flowchart TD

App --> Root["/"]

Root --> Index["/home"]
Root --> Products["/products"]

Index --> I1["GET /home"]
Index --> I2["GET /home/category/new"]
Index --> I3["POST /home/category/new"]
Index --> I4["POST /home/category/delete"]
Index --> I5["POST /home/category/edit"]

Products --> P1["GET /new"]
Products --> P2["POST /new"]
Products --> P3["GET /:id"]
Products --> P4["GET /:id/edit"]
Products --> P5["POST /:id/edit"]
Products --> P6["POST /:id/delete"]  

```

flowchart LR

Client --> Server

Server --> Root["/"]

Root --> Index["/index"]
Root --> Products["/products"]

db folder is for setting up the database and making sure
the database is as expected.

pool is used to query said data based off the app's needs.

see .env.sample to see expected .env setup

App follows the MVC pattern

Uses express 5.xx automatic error handling for controllers.

flowchart TD

App["Express App"]

App --> Root["/"]
App --> Products["/products"]
App --> Categories["/categories"]

Root --> Home["GET /"]
