
Start db (this will drop DB on finishing process)
```bash
docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -p 5432:5432 --rm postgres
```