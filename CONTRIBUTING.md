# Contributing to Naturebismo

### Requirements

First you will need Python 3.5 and Docker:

```
# apt-get install python3.5-venv docker-engine
```

### How to run everything locally

#### 1 - Clone both the backend and frontend repositories:
```
$ mkdir naturebismo
$ git clone git@github.com:naturebismo/frontend.git
$ git clone git@github.com:naturebismo/backend.git
```

#### 2 - Install backend's 3rd-party requirements:

```
$ cd backend
$ pyvenv-3.5 ../env
$ source ../env/bin/activate
$ pip install -r requirements.txt
```

#### 3 - Export schema.json from the backend to frontend's directory

```
$ python manage.py graphql_schema --out ../frontend/schema.json
```

#### 4 - Run backend's development server

```
$ python manage.py runserver localhost:9090 --traceback
```

#### 5 - Run frontend's development server using Docker

Start a new terminal session, because we need the backend's server runing, then:
```
$ cd naturebismo/frontend
$ docker pull naturebismo/frontend
$ docker run -it --rm --net="host" -v .:/app naturebismo/frontend
```
