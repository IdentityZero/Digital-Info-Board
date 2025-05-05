# Deployment Steps

## Notes
1. ### Variables (things you can change its value) will have a format of `<UPPERCASE>`
    But you should take note about them and remember.
2. ### If using nano to edit files, press `ctrl + x` then `y` to confirm.

## Set up OS using Raspberry PI Imager

1. ### Download Raspberry Pi Imager and download os image
2. ### Set up User and password for the raspberry pi in the Imager
3. ### (Optional) Set up Wifi to connect to or use ethernet in the Imager
4. ### Start the imaging
5. ### (Optional) Download Putty and RealVNC Viewer
   You don't have to if you can connect keyboard and mouse to the rpi

## (Optional) Use putty or Real VNC to connect to RPI
  You can watch youtube on how to do it.

## Deployment
1. ### Enable VNC and set WLAN Country to PH
       sudo raspi-config
     1. #### Choose Interface Options
        Choose VNC then enable
     2. #### Choose Localisation Options
        Select WLAN Country then choose PH
        
2. ### Restart
       sudo reboot
     You can now connect using VNC.

4. ### Remove not needed softwares
       sudo apt purge -y code-the-classics firefox libreoffice* kicad* vlc wolfram-engine mu-editor scratch scratch3 nuscratch
   These are some of the apps to remove. To remove more, go to Menu -> Preferences -> Recommended Software.
   Remove and Add Apps that you think you need.

5. ### Update OS Packages
       sudo apt update

6. ### Upgrade OS Packages
       sudo apt upgrade
       sudo apt autoremove

7. ### Create Access Point
       sudo nmcli device wifi hotspot ssid <SSID> password <PASSWORD> ifname wlan0
     Change `<SSID`> and `<PASSWORD>`.

8. ### Set Access Point Auto Start
       sudo nmcli connection modify Hotspot connection.autoconnect yes connection.autoconnect-priority 100

9. ### Setup Local DNS
       sudo touch /etc/NetworkManager/dnsmasq-shared.d/hosts.conf
       echo "address=/.local/10.42.0.1" | sudo tee /etc/NetworkManager/dnsmasq-shared.d/hosts.conf
       echo "10.42.0.1       dib.local" | sudo tee -a /etc/hosts
    10.42.0.1 is the default IP (Gateway) of the Access Point.

10. ### Restart
        sudo reboot
    Once it reboots, you can now connect to the Access Point.
    If you are using a computer with access to a terminal like cmd, try to `ping dib.local`. It should be reachable by now.

12. ### Install Nginx
        sudo apt install nginx

13. ### Configure App Configurations
        sudo nano /etc/nginx/sites-available/dib
    #### Then copy and paste the configurations
        upstream daphne-server {
        server localhost:8000;
        }

        server {
        	listen 80;
        	
        	root /var/www/frontend-dib;
        	index index.html;
        	
        	location /static/ {
        	        root /home/admin/Digital-Info-Board/server/backend;
        	}
        
        	location /media/ {
        		root /home/admin/Digital-Info-Board/server/backend;
        	}
        
        	location /api/ {
        		proxy_pass http://daphne-server;
        
        	        proxy_http_version 1.1;
        	        proxy_set_header Upgrade $http_upgrade;
        	        proxy_set_header Connection "upgrade";
        
        	        proxy_redirect off;
        	        proxy_set_header Host $host;
        		proxy_set_header X-Real-IP $remote_addr;
        		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        		proxy_set_header X-Forwarded-Host $server_name;
        	}
        
        
        	location / {
        		try_files $uri /index.html;
        	}
        	
        }
    Then save.

14. ### Update Nginx configs
        sudo nano /etc/nginx/nginx.conf
    1. #### Usually on the top part. Change the value of user to your user.
           user `<USER>`;
        ##### Change the `<USER>`. This value was set during the imaging process.
       
    2. #### Set Max upload content size.
       ##### Find http
           http {...contents here}
       ##### Copy this to the bottom of the http, inside the brackets
           client_max_body_size 200M;
        Then save.
    3. #### Then run this to link app to nginx
           sudo unlink /etc/nginx/sites-enabled/default
           sudo ln -s /etc/nginx/sites-available/dib /etc/nginx/sites-enabled/
           sudo nginx -t
           sudo systemctl reload nginx

15. ### Install Redis
        sudo apt install redis

16. ### Configure Redis
        sudo nano /etc/redis/redis.conf
    #### Find supervised auto. Uncomment and change to
    ##### You can use `ctrl + w` to find faster.
        supervised systemd
    Then save.
    ##### Restart Redis
        sudo systemctl restart redis

17. ### Install Node JS
        curl -sL https://deb.nodesource.com/setup_20.x | sudo bash -
    #### Wait for it to install. Then run
        sudo apt install nodejs

18. ### Install git
        sudo apt install git

19. ### Clone the Repository
        cd ~
        git clone https://github.com/IdentityZero/Digital-Info-Board.git

20. ### Create and Copy Scripts to Update app
        mkdir dib_scripts
      1. #### Create File to update frontend
             touch dib_scripts/update_frontend.sh
      2. #### Edit and Copy script
             nano dib_scripts/update_frontend.sh
           ##### Copy this to the file
             #!/bin/bash

             # Define the directory where your front-end repository is located
             FRONTEND_DIR="/home/admin/Digital-Info-Board/client"
              
             # Change to the front-end directory
             cd $FRONTEND_DIR
              
             # Pull the latest updates from the repository
             echo "Pulling the latest updates from git..."
             git pull origin main  # or the branch you want
              
             # Run the build command (assuming you're using a typical front-end build system like React)
             echo "Building the front-end..."
             npm run build  # or your build command (e.g., yarn build)
              
             # Delete contents of /var/www/frontend-dib/
             sudo rm -rf /var/www/frontend-dib/*
              
             # Copy the build output to /var/www
             echo "Copying the build output to /var/www/frontend-dib/..."
             sudo cp -r dist/* /var/www/frontend-dib
              
             echo "Front-end updated successfully!"
          Then save.
         
      3. #### Make script executable
             chmod +x dib_scripts/update_frontend.sh

      4. #### Create File to Update Backend
             touch dib_scripts/update_backend.sh

      5. #### Edit and Copy script
             nano dib_scripts/update_backend.sh
           ##### Copy this to the file
             #!/bin/bash

             # Define the directory where your Django backend repository is located
             DJANGO_DIR="/home/admin/Digital-Info-Board/server/backend"
             REQUIREMENTS_DIR="/home/admin/Digital-Info-Board/server"
              
             # Define your virtual environment path (if using a virtual environment)
             VENV_DIR="/home/admin/Digital-Info-Board/server/.venv"
              
             # Define the service name for your Django app (if using systemd)
             DJANGO_SERVICE="daphne"  # E.g., daphne or another service name
              
             # Change to the Django project directory
             cd $DJANGO_DIR
              
             # Pull the latest updates from the repository
             echo "Pulling the latest updates from git..."
             git pull origin main  # Replace with the branch you're using
              
             # Activate the virtual environment (if you're using one)
             echo "Activating virtual environment..."
             source $VENV_DIR/bin/activate  # Adjust the path to your virtualenv
              
             # Install any new dependencies (if necessary)
             cd $REQUIREMENTS_DIR
             echo "Installing dependencies..."
             pip install -r requirements.txt
              
             # Apply any database migrations
             cd $DJANGO_DIR
             echo "Applying database migrations..."
             python manage.py migrate
              
             # Collect static files (optional but recommended)
             echo "Collecting static files..."
             python manage.py collectstatic --noinput
             
             # Restart the Django service (if using systemd)
             echo "Restarting the Django application service..."
             sudo systemctl restart $DJANGO_SERVICE  # Replace with your service name (e.g., gunicorn)
              
             echo "Django backend updated successfully!"
          Then save.
      6. #### Make the file executable
             chmod +x dib_scripts/update_backend.sh

21. ### Setup Frontend
        nano Digital-Info-Board/client/.env.production
      #### Copy environment variables
        VITE_API_BASE_URL=
        VITE_SHOW_API_ERROR=false
      Then save.
      #### Install Dependencies
        cd Digital-Info-Board/client
        npm install
      Wait for this. It may take long
      #### Create Directories to store the built app
        cd ~
        sudo mkdir /var/www/frontend-dib
        sudo chmod 755 -R /var/www/frontend-dib
        sudo chown -R admin:www-data /var/www/frontend-dib
      #### Update the frontend
        ./dib_scripts/update_frontend.sh
      By now, when you visit dib.local, you should be able to see the app but without data and errors.

22. ### Install Mysql
        sudo apt install mariadb-server
    #### After installing, config mysql
        sudo mysql_secure_installation
      This is a series of steps. Read it properly and make sure you set the password and remember it. You can say no to everything except, the last 2 (Remove test database and reload privilege tables)
    #### Login to MySql, you will input your password here.
        sudo mysql -u root -p
    #### Create Database
        CREATE DATABASE `<DATABASE_NAME>`;
        quit;

23. ### Install MySql dependencies to work with the app
        sudo apt-get install python3-dev default-libmysqlclient-dev build-essential pkg-config

24. ### Create, copy and paste environment variables
        nano Digital-Info-Board/server/.env
      #### Copy this template and populate accordingly
        DEBUG=False
        DB_NAME=<DATABASE_NAME>
        DB_USER=root 
        DB_PASSWORD=<MYSQL_PASSWORD>
        DB_HOST=localhost
        DB_PORT=3306
        SECRET_KEY=                         # Any string value here. Make sure its secure
        EMAIL_HOST_USER=<GMAIL_HOST>
        EMAIL_HOST_PASSWORD=<GMAIL_APP_PASSWORD>
        GAPI_JSON_CREDENTIALS_LOC=          # set this to empty. Not using Google anymore
        CALENDAR_ID=                        # set this to empty. Not using google anymore
        FRONTEND_DOMAIN=http://dib.local
        VITE_WEATHER_API_KEY=<WEATHER_API_KEY>
        DJANGO_SETTINGS_MODULE=core.settings

25. ### Download Backend dependencies
        cd Digital-Info-Board/server
        python -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
    This will take a while.

26. ### Populate database and collect static files
        cd backend
        python manage.py migrate
        python manage.py collectstatic
        deactivate
        cd ~

## Create Services
1. ### Service to automatically run backend
       sudo nano /etc/systemd/system/daphne.service
     #### Copy this to the file
       [Unit]
       Description=Run DIB Backend Service
       After=network.target
        
       [Service]
       StandardOutput=journal
       StandardError=journal
       Type=simple
       User=admin
       Group=www-data
       Environment=DJANGO_SETTINGS_MODULE=core.settings
       WorkingDirectory=/home/admin/Digital-Info-Board/server/backend
       ExecStart=/home/admin/Digital-Info-Board/server/.venv/bin/python /home/admin/Digital-Info-Board/server/.venv/bin/daphne -b 0.0.0.0 -p 8000 core.asgi:application
       Restart=on-failure
        
       [Install]
       WantedBy=multi-user.target
      Then save.
     #### Start and Enable Service
       sudo systemctl start daphne.service
       sudo systemctl enable daphne.service
     #### You should be able to see the app without errors now.
2. ### Services to listen to shutdown, and reboot commands
       sudo nano /etc/systemd/system/ws_shutdown.service
     #### Copy this to the file
       [Unit]
       Description=Shutdown Device WebSocket Listener
       After=network.target
        
       [Service]
       ExecStart=/usr/bin/python "/home/admin/Digital-Info-Board/server/backend/client scripts/shutdown.py"
       WorkingDirectory=/home/admin/Digital-Info-Board/server/backend/client scripts
       User=admin
       Restart=on-failure
       RestartSec=5
        
       [Install]
       WantedBy=multi-user.target
     Then save.
    #### Start and Enable Service
       sudo systemctl start ws_shutdown.service
       sudo systemctl enable ws_shutdown.service
    #### Download Service dependencies
       sudo apt install python3-websockets

4. ### Create script to auto start Display
       sudo nano /usr/local/bin/kiosk.sh
     #### Copy this to the file
       #!/bin/bash
       sleep 120
        
       # Launch browser in kiosk mode
       /usr/bin/chromium-browser --kiosk http://localhost/kiosk --ozone-platform=wayland --no-first-run --noerrdialogs --disable-infobars --incognito --autoplay-policy=no-user-gesture-required --disable-gesture-requirement-for-media-playback
      Then save.
     #### Make the file executable
       sudo chmod 755 /usr/local/bin/kiosk.sh

5. ### Create Service to auto start Display
       mkdir -p ~/.config/systemd/user
       sudo nano ~/.config/systemd/user/kiosk.service
     #### Copy this to the file
       [Unit]
       Description=Chromium with Wayland (Ozone)
       After=graphical-session.target
        
       [Service]
       ExecStart=/usr/local/bin/kiosk.sh
       Environment=MOZ_ENABLE_WAYLAND=1
       Restart=on-failure
        
       [Install]
       WantedBy=default.target
     Then save.
    #### Enable and start service
       systemctl --user daemon-reexec
       systemctl --user daemon-reload
       systemctl --user enable kiosk.service
       systemctl --user start kiosk.service

7. ### Shutdown RPI at 5pm
       sudo crontab -e
     #### Copy and Paste this to the bottom
       0 17 * * * /sbin/shutdown -h now
     Then save.

## Others
1. ### Increase GPU memory
       sudo nano /boot/firmware/config.txt
     #### Copy this to the bottom of the file
       ppu_mem=512
