This is [nodejs](https://nodejs.org) + [Flask](https://flask.palletsprojects.com/) + [NestJS](https://nestjs.com/) implementation of backend
For more details about project read frontend [README.md](https://github.com/KonradOliwer/yana-fe-react/)

## Using app
### Requirements
- [nodejs](https://nodejs.org/)
- [npm](https://www.npmjs.com/), 
- [docker](https://www.docker.com/)

### Running the app
Start db (this will drop DB on finishing process)
```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -p 5432:5432 --rm postgres
```

```bash
npm start
```

### Running tests
```bash
npm test:e2e
```