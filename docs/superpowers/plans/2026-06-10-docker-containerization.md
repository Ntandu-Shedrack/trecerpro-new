# Docker Containerization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Containerize the Next.js frontend and Laravel backend into a single unified Docker container managed by Supervisor and served behind Nginx.

**Architecture:** A multi-stage build compiles the Next.js standalone server and composer dependencies. The final runtime uses `php:8.3-fpm` with Nginx, Node.js, and Supervisor installed. Nginx reverse proxies API traffic to Laravel (PHP-FPM) and frontend traffic to Next.js.

**Tech Stack:** Docker, Nginx, PHP-FPM, Node.js, Supervisor, PostgreSQL

---

### Task 1: Enable Standalone Build in Next.js Config

**Files:**
- Modify: `tracerpro-new/next.config.ts`

- [ ] **Step 1: Modify next.config.ts to output standalone build**
  Add `output: "standalone"` to the Next.js configuration object.
  ```typescript
  import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    output: "standalone",
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
      ],
    },
  };

  export default nextConfig;
  ```

- [ ] **Step 2: Commit Next.js configuration changes**
  Run: `git add tracerpro-new/next.config.ts && git commit -m "feat(frontend): configure standalone build output"`

---

### Task 2: Create Nginx Configuration

**Files:**
- Create: `tracepro-laravel/docker/nginx.conf`

- [ ] **Step 1: Write nginx.conf**
  Create the Nginx configuration file routing `/api`, `/sanctum`, and `/vendor` to PHP-FPM and fallback to Next.js on port 3000.
  ```nginx
  server {
      listen 80;
      server_name localhost;
      root /var/www/html/backend/public;

      add_header X-Frame-Options "SAMEORIGIN";
      add_header X-Content-Type-Options "nosniff";

      index index.php;
      charset utf-8;

      # Direct backend API endpoints to Laravel front controller
      location ~ ^/(api|sanctum|vendor) {
          try_files $uri $uri/ /index.php?$query_string;
      }

      # Handle PHP execution via fastcgi (PHP-FPM)
      location ~ \.php$ {
          fastcgi_pass 127.0.0.1:9000;
          fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
          include fastcgi_params;
      }

      # Proxy all other requests to Next.js server on port 3000
      location / {
          proxy_pass http://127.0.0.1:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }

      location = /favicon.ico { access_log off; log_not_found off; }
      location = /robots.txt  { access_log off; log_not_found off; }

      error_page 404 /index.php;

      location ~ /\.(?!well-known).* {
          deny all;
      }
  }
  ```

---

### Task 3: Create Supervisor Configuration

**Files:**
- Create: `tracepro-laravel/docker/supervisord.conf`

- [ ] **Step 1: Write supervisord.conf**
  Create the configuration to monitor and run php-fpm, nginx, and node server.
  ```ini
  [supervisord]
  nodaemon=true
  logfile=/dev/null
  logfile_maxbytes=0
  pidfile=/var/run/supervisord.pid
  user=root

  [program:php-fpm]
  command=php-fpm -F
  stdout_logfile=/dev/stdout
  stdout_logfile_maxbytes=0
  stderr_logfile=/dev/stderr
  stderr_logfile_maxbytes=0
  autorestart=true

  [program:nginx]
  command=nginx -g "daemon off;"
  stdout_logfile=/dev/stdout
  stdout_logfile_maxbytes=0
  stderr_logfile=/dev/stderr
  stderr_logfile_maxbytes=0
  autorestart=true

  [program:nextjs]
  command=node /var/www/html/frontend/server.js
  directory=/var/www/html/frontend
  stdout_logfile=/dev/stdout
  stdout_logfile_maxbytes=0
  stderr_logfile=/dev/stderr
  stderr_logfile_maxbytes=0
  autorestart=true
  ```

---

### Task 4: Create Entrypoint Script

**Files:**
- Create: `tracepro-laravel/docker/entrypoint.sh`

- [ ] **Step 1: Write entrypoint.sh**
  Create the startup script that runs migrations, links storage, caches configs, and starts supervisor.
  ```bash
  #!/bin/sh
  set -e

  # Verify and wait for PostgreSQL database connection
  if [ -n "$DB_HOST" ]; then
    echo "Verifying database connection at $DB_HOST:$DB_PORT..."
    php -r "
    \$connected = false;
    for (\$i = 0; \$i < 30; \$i++) {
        try {
            \$db = new PDO('pgsql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
            \$connected = true;
            break;
        } catch (Exception \$e) {
            echo 'Waiting for database connection...' . PHP_EOL;
            sleep(2);
        }
    }
    if (!\$connected) {
        echo 'Database connection failed!' . PHP_EOL;
        exit(1);
    }
    "
    echo "Database is up and reachable!"
  fi

  # Change to Laravel project root directory
  cd /var/www/html/backend

  # Run DB migrations
  echo "Running database migrations..."
  php artisan migrate --force

  # Ensure storage directories and symlinks are set up
  echo "Creating storage symlink..."
  php artisan storage:link --force

  # Cache configurations and routes for production speed
  echo "Caching configurations and routes..."
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache

  # Start supervisor daemon
  echo "Starting Supervisor..."
  exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
  ```

---

### Task 5: Populate Dockerfile

**Files:**
- Modify: `tracepro-laravel/Dockerfile`

- [ ] **Step 1: Populate Dockerfile**
  Add the multi-stage build steps to compile Next.js standalone files, install Composer dependencies, and produce the final runtime image.
  ```dockerfile
  # ==========================================
  # Stage 1: Build the Next.js frontend
  # ==========================================
  FROM node:20-slim AS frontend-builder
  WORKDIR /app
  RUN npm install -g pnpm
  COPY tracerpro-new/package.json tracerpro-new/pnpm-lock.yaml ./
  RUN pnpm install --frozen-lockfile
  COPY tracerpro-new/ ./
  ENV NEXT_TELEMETRY_DISABLED 1
  RUN pnpm build

  # ==========================================
  # Stage 2: Build Laravel backend dependencies
  # ==========================================
  FROM php:8.3-cli AS backend-builder
  WORKDIR /app
  COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
  RUN apt-get update && apt-get install -y git unzip libpq-dev && rm -rf /var/lib/apt/lists/*
  COPY tracepro-laravel/composer.json tracepro-laravel/composer.lock ./
  RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist
  COPY tracepro-laravel/ ./
  RUN composer dump-autoload --no-dev --optimize

  # ==========================================
  # Stage 3: Final Production Image
  # ==========================================
  FROM php:8.3-fpm AS runtime
  WORKDIR /var/www/html

  # Install Nginx, Supervisor, Curl, gnupg, Postgres dev libs
  RUN apt-get update && apt-get install -y \
      nginx \
      supervisor \
      curl \
      gnupg \
      libpq-dev \
      && rm -rf /var/lib/apt/lists/*

  # Install Node.js runtime for Next.js server
  RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
      && apt-get install -y nodejs \
      && rm -rf /var/lib/apt/lists/*

  # Install PHP pgsql extensions and bcmath for Laravel
  RUN docker-php-ext-install pdo pdo_pgsql pgsql bcmath

  # Copy backend codebase
  COPY --from=backend-builder /app /var/www/html/backend
  RUN chown -R www-data:www-data /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache

  # Copy frontend standalone files and assets
  COPY --from=frontend-builder /app/.next/standalone /var/www/html/frontend
  COPY --from=frontend-builder /app/public /var/www/html/frontend/public
  COPY --from=frontend-builder /app/.next/static /var/www/html/frontend/.next/static

  # Copy docker setup configurations
  COPY tracepro-laravel/docker/nginx.conf /etc/nginx/sites-available/default
  COPY tracepro-laravel/docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
  COPY tracepro-laravel/docker/entrypoint.sh /usr/local/bin/entrypoint.sh
  RUN chmod +x /usr/local/bin/entrypoint.sh

  EXPOSE 80

  ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
  ```
