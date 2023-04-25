# web-educational-game-for-kids

## Getting Started
Please check port 3000 and 5000 are not used by other applications. I changed the port number in docker-compose.yml file. If you want to change the port number, please change the port number in docker-compose.yml file.  <br>

Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows. [Docker Compose](https://docs.docker.com/compose) will be automatically installed. On Linux, make sure you have the latest version of [Compose](https://docs.docker.com/compose/install/).

---------------

### Linux Containers

Create a local copy of this repository and run:

```
docker-compose build
```

This sets Compose and builds a local development environment according to specifications in docker-compose. Note that this settings for development, and not production.

After the containers have been built (this may take a few minutes), run:

```
docker-compose up
```

This one command boots up a local server for Flask (on port 5000) and React (on port 3000). Go to:

```
http://localhost:3000/ 
```

If you want to stop running local servers, run

```
docker-compose down
```

Note: If the setup does not work please mail to tunalim@mef.edu.tr
