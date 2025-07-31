# k-multiset-combinations

A REST API service for generating combinatorial selections (k-combinations) from [multisets](https://en.wikipedia.org/wiki/Multiset) with results persisted in a database.

This project was developed as part of a [technical assignment](./resources/assets/task.pdf).

The task of finding combinations of length
![\ k](https://latex.codecogs.com/svg.latex?%5C%5C%20k)
from a multiset is reduced to finding all type combinations of size
![\ k](https://latex.codecogs.com/svg.latex?%5C%5C%20k)
and multiplying their multiplicities.

### Problem Statement

Given a multiset:

<div align="center">

![\ M = { \underbrace{a\_1, \dots, a\_1}{c\_1}, \underbrace{a\_2, \dots, a\_2}{c\_2}, \dots, \underbrace{a\_n, \dots, a\_n}\_{c\_n} },](https://latex.codecogs.com/svg.latex?%5C%5C%20M%20%3D%20%5C%7B%20%5Cunderbrace%7Ba_1%2C%20%5Cdots%2C%20a_1%7D_%7Bc_1%7D%2C%20%5Cunderbrace%7Ba_2%2C%20%5Cdots%2C%20a_2%7D_%7Bc_2%7D%2C%20%5Cdots%2C%20%5Cunderbrace%7Ba_n%2C%20%5Cdots%2C%20a_n%7D_%7Bc_n%7D%20%5C%7D%2C)

</div>

where
![\ c\_i](https://latex.codecogs.com/svg.latex?%5C%5C%20c_i)
is the number of elements of type
![\ a\_i](https://latex.codecogs.com/svg.latex?%5C%5C%20a_i).

**Goal**: Find all subsets
![\ S \subseteq M](https://latex.codecogs.com/svg.latex?%5C%5C%20S%20%5Csubseteq%20M)
of size
![\ k](https://latex.codecogs.com/svg.latex?%5C%5C%20k)
where all elements in
![\ S](https://latex.codecogs.com/svg.latex?%5C%5C%20S)
are of **distinct types**.

### Example

For `[1, 2, 1]` (types `A, B, C`):

* ![\ M = {A\_1, B\_1, B\_2, C\_1},](https://latex.codecogs.com/svg.latex?%5C%5C%20M%20%3D%20%5C%7BA_1%2C%20B_1%2C%20B_2%2C%20C_1%5C%7D%2C)
* ![\ k = 2:](https://latex.codecogs.com/svg.latex?%5C%5C%20k%20%3D%202%3A)

<div align="center">

![\ {\[A\_1, B\_1\], \[A\_1, B\_2\], \[A\_1, C\_1\], \[B\_1, C\_1\], \[B\_2, C\_1\]}. \  \ ](https://latex.codecogs.com/svg.latex?%5C%5C%20%7B%5BA_1%2C%20B_1%5D%2C%20%5BA_1%2C%20B_2%5D%2C%20%5BA_1%2C%20C_1%5D%2C%20%5BB_1%2C%20C_1%5D%2C%20%5BB_2%2C%20C_1%5D%7D.%20%5C%5C%20%20%5C%5C%20)

</div>

## Key Features

* Efficient depth-first search (DFS) algorithm.
* Transactional bulk insertion into MySQL with adjustable `BATCH_SIZE`.
* Clean architecture with modular isolation and unit test coverage.
* Ready-to-use containerization, CI/CD pipeline, and Helm charts for Kubernetes deployment.

## Potential Improvements

* Deferred database writes for large result sets to respond faster to the client.
* Database worker pipeline based on status transitions (finite state machine).
* Use of streaming (e.g., `node:stream`, `rxjs`) to reduce runtime memory usage with large combinations.
* Lazy evaluation (generators, `yield`) for on-demand combination generation.

## Running the App

### Local Setup

#### 1. Environment setup

1.1. Define environment variables:

```bash
cat <<EOF > .env
export APP_PORT=3000
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=user52
export DB_PASSWORD=13131313
export DB_NAME=mydb
EOF

source .env
```

1.2. Start a MySQL instance:

```bash
docker run \
-e MYSQL_ROOT_PASSWORD=root \
-e MYSQL_DATABASE=${DB_NAME} \
-e MYSQL_USER=${DB_USER} \
-e MYSQL_PASSWORD=${DB_PASSWORD} \
-v ${PWD}/mysql_data:/var/lib/mysql \
-p ${DB_PORT}:3306 -d mysql:8.0
```

(or use any other preferred method)

#### 2. Start the service

2.1. Install dependencies:

````bash
npm install```

2.2. Transpile to JS (build):
```bash
npm run build```

2.3. Run DB migrations:
```bash
npm run migrate up```

2.4. Start the service:
```bash
npm run start```

### Run with Docker

```bash
source .env && docker compose up -d
````

## Folder Structure

```bash
k-multiset-combinations/
├── __tests__/              # Test scenarios
├── db/migrations/          # SQL migrations
├── deployments/helm/       # Helm charts for Kubernetes
├── src/
│   ├── app/                # Entry point: main service function
│   ├── dtos/               # Data transfer objects with validation
│   ├── gateways/           # API controllers
│   ├── library/            # Pure logic functions
│   ├── repositories/       # Database access layer
│   └── services/           # Core application logic
│
├── scripts/
│   └── migration.ts        # DB migration runner
│
├── .env.test               # Env vars for testing
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Compose file for full stack
├── start.sh                # Entrypoint script
├── .gitlab-ci.yml          # GitLab CI/CD pipeline config
├── jest.config.ts          # Jest test configuration
├── package.json            # Project metadata & dependencies
└── tsconfig.json           # TypeScript configuration
```

## Database Design

<center>

![Database Schema](./resources/assets/schema.png)

</center>

## API Documentation

### POST /api/v1/generate

Generate a new combination set

#### Request Parameters (JSON):

| Field    | Type      | Required | Description               |
| -------- | --------- | -------- | ------------------------- |
| `items`  | number\[] | yes      | The input multiset        |
| `length` | number    | yes      | Length of the combination |

#### Sample Request:

```http
POST /api/v1/generate HTTP/1.1
Content-Type: application/json
{
  "items": [1, 2, 1],
  "length": 2
}
```

#### Sample Response:

```json
{
    "id": 1,
    "combination": [
        ["A1","B1"],
        ["A1","B2"],
        ["A1","C1"],
        ["B1","C1"],
        ["B2","C1"]
    ]
}
```

### GET /api/v1/status

Retrieve service health/status

#### Sample Request:

```http
GET /api/v1/status HTTP/1.1
```

#### Sample Response:

```json
{
    "status": "ok",
    "uptime": 41686.426413128,
    "hostname": "k-multiset-combinations-55dc657d57-qwpvc",
    "timestamp": "2025-04-25T07:49:59.226Z",
    "commitHash": "283d431cf2f50eb7f2944607545751d8c827db0c"
}
```

### Swagger

Swagger is available at `/swagger`

## Tags

* \#nestjs
* \#typescript
* \#mysql2
* \#docker
* \#k8s
