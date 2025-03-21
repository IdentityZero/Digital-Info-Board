# Digital-Info-Board
## Dependencies: 
  - Nodejs (v20.15.1 version if possible or newer)
  - Python (Python 3.12.4 version if possible or newer)
---
## How to Start
  1. ### Download this repository and unzip the file
  2. ### Traverse the folder until you can see the files
      - README.md
      - client (folder)
      - server (folder)
  3. ### Start a terminal or cmd (windows) inside that folder proceed instructions on ['Initializing the Backend'](.#initializing-the-backend)
---
## Initializing the Backend
  1. ### If you are already inside the folder where you can see the 3 files, cd to server
          cd server
  2. ### Create a python virtual environment
         python -m venv .venv
  3. ### Use that virtual environment
          .venv\Scripts\activate
  4. ### Install the dependencies
           pip install -r requirements.txt
  5. ### Inside the 'server' folder create a '.env' file
       - For mac `touch .env`
       - For windows `echo. > .env`
  6. ### Populate your .env with the following data (You can use your code editor for this)
       - #### Create an empty database first then set the DB_NAME in your .env
       ```
        DB_NAME= # Database name
        DB_USER=root
        DB_PASSWORD= # This can be empty
        DB_HOST=localhost
        DB_PORT=3306
        SECRET_KEY= # This cannot be empty, put any large string value
        EMAIL_HOST_USER=
        EMAIL_HOST_PASSWORD=
        GAPI_JSON_CREDENTIALS_LOC=
        CALENDAR_ID=
        VITE_WEATHER_API_KEY=
  7. ### CD to 'backend'
         cd backend
  8. ### Create database tables
         python manage.py migrate
  10. ### Run server
          python manage.py runserver
  11. ### Setup is done
## Starting the Frontend
  1. ### Go back inside the folder where you can see the 3 files, cd to client
          cd client
  2. ### Install dependencies (Make sure that you already have Nodejs installed)
          npm install
  3. ### Start the frontend server
          npm run dev
  4. ### Go to browser and enter 'http://localhost:5173/'
  5. ### Create an account.

