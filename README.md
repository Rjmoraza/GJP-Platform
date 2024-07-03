# GJ-Platform
## Dependencies Installation

This installation manual assumes the system will be installed in a Oracle Linux OS. Steps might vary for other operating systems.

Oracle Linux is based on RHEL. Default package manager is DNF.

### MongoDB

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/ 

RHEL systems don't have a default MongoDB repository. To add the official MongoDB repository in the system, create a file `/etc/yum.repos.d/mongodb-org-7.0.repo`

```bash
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
```

Once the repository is installed, run 

```bash
sudo dnf install -y mongodb-org
```

### NodeJS

Install NodeJS through the Node Version Manager (NVM) by running:



