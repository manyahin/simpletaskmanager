# Task manager

Simple task manager with sub-tasks support. Builded on top of Loopback and Vue. Dockerized.

## Development

```bash
# make link for db hostname to localhost
echo '127.0.0.1 db' >> /etc/hosts

# start database
docker-compose up -d db

# start api loopback
npm install
npm run dev

# start client part (in new terminal)
cd client
npm install
npm run dev
```

## Production

```bash
# clone repo
git clone https://github.com/manyahin/simpletaskmanager.git
cd simpletaskmanager

# start project
docker-compose -f production.yml up -d
```