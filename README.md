This is [nodejs](https://nodejs.org)  + [NestJS](https://nestjs.com/) implementation of backend
For more details about project read frontend [README.md](https://github.com/KonradOliwer/yana-fe-react/)
Make sure to use same tag version for frontend and backend to ensure compatibility.

## Using app
### Requirements
- [nodejs](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [docker](https://www.docker.com/)

### Running the app
Start db (this will drop DB on finishing process)
```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -p 5432:5432 --rm postgres
```
Start app
```bash
npm start
```

### Running tests
Start db (this will drop DB on finishing process)
```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -p 5432:5432 --rm postgres
```
Run tests
```bash
npm test:e2e
```