#!/bin/bash

# Make script executable with: chmod +x docker.sh

case "$1" in
  start)
    echo "Starting Sif App containers..."
    docker-compose up -d
    echo "Containers started. Frontend available at http://localhost:3000"
    ;;
  stop)
    echo "Stopping Sif App containers..."
    docker-compose down
    echo "Containers stopped."
    ;;
  restart)
    echo "Restarting Sif App containers..."
    docker-compose down
    docker-compose up -d
    echo "Containers restarted. Frontend available at http://localhost:3000"
    ;;
  logs)
    if [ "$2" ]; then
      echo "Showing logs for $2 service..."
      docker-compose logs -f "$2"
    else
      echo "Showing logs for all services..."
      docker-compose logs -f
    fi
    ;;
  build)
    echo "Building Sif App containers..."
    docker-compose build
    echo "Build completed."
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|build}"
    echo "  start   - Start all containers"
    echo "  stop    - Stop all containers"
    echo "  restart - Restart all containers"
    echo "  logs    - Show logs (optionally specify service name)"
    echo "  build   - Rebuild all containers"
    exit 1
esac

exit 0
