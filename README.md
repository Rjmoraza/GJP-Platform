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

### NodeJS

NodeJS packages are supported by default on Ubuntu 22.04

```bash
apt install nodejs npm
```

## Environment Configuration

### Backend

Create a `.env` file in the backend root folder with the following variables:

```bash
EMAIL=[email address of the system]
EMAILPASSWORD=[email password of the system]
PORT=[IP Address of the system]
```

### Frontend





