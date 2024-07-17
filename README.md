# GJ-Platform

## Dependencies Installation

Instructions for **Ubuntu Linux 22.04 Minimal** on a production environment

### MongoDB

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

Download the GPG Key for the MongoDB repository

```bash
sudo apt install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
```

Create the repository list file `/etc/apt/sources.list.d./mongodb-org-7.0.list`

```
deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse
```

Update the APT repository list and install the MongoDB packages

```bash
sudo apt update
sudo apt install mongodb-org-database mongodb-org-database-tools-extra
```

Enable and start the MongoDB service

```bash
sudo systemctl enable mongod
sudo systemctl start mongod
```

### NodeJS

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04 

NodeJS packages supported by the default repositories in Ubuntu 22.04 are obsolete. To install a newer version of NodeJS a new repository must be added. First make sure that curl is installed

```bash
sudo apt install curl
```

Then download the installer for the NodeJS repository

```bash
cd ~
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
chmod a+x nodesource_setup.sh
sudo ./nodesource_setup.sh
```

This will add the new repository into the repository lists in Ubuntu. The new repository will be installed in `/etc/apt/sources.list.d/nodesource.list`. If everything is correct, now NodeJS can be installed normally with APT:

```bash
apt install nodejs npm
```

## Environment Configuration

### Backend

Download the code into a folder in your system. This folder will be referred to as `[PLATFORM_ROOT]`

Run the following command in the `[PLATFORM_ROOT]` folder:

```bash
sudo npm install
```

This will install all the packages and dependencies required by the project. Then create a file with the route  `[PLATFORM_ROOT].env` with the following values:

```bash
EMAIL=[email address for the SMTP service]
EMAILPASSWORD=[email password for the SMTP service]
URL=[Full URL of the system]
TARGET=[DEV|PROD]
```

The system requires a functioning email account to send files through SMTP.

The `TARGET` value defines if the system is in production (uses static frontend) or in development (uses dynamic frontend).

### Frontend

Find the file `[PLATFORM_ROOT]/dist/browser/main-[Serial].js`. Within it find and replace the only instance of `localhost` by the server's IP or FQDN.

### Service

Create a file in `/etc/systemd/system` called `gjp-platform.service` with the following content:

```bash
[Unit]
Description=Service for the GameJam+ platform
After=network.target

[Service]
Type=simple
Restart=always
User=ubuntu
RestartSec=3
WorkingDirectory=[PLATFORM_ROOT]
ExecStart=/usr/bin/node [PLATFORM_ROOT]/index.js

[Install]
WantedBy=multi-user.target
```

Make sure to replace `[PLATFORM_ROOT]` for the absolute path where the platform is installed. After the service unit is create, run the following lines:

```bash
sudo systemctl enable gjp-platform.service
sudo systemctl start gjp-platform.service
```

This will create a self-starting service that will boot with the system and run independent from any terminal.
