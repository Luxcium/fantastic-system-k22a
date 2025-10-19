---
description: "This file contains the Docker Compose configuration for the development environment."
applyTo: "**/docker-compose.yml"
---

# Docker Compose Configuration for Development Environment

This file contains the Docker Compose configuration for the development environment. It defines the services, networks, and volumes required to run the application in a containerized setup.

> [!IMPORTANT] > `WARN[0000]:` for any docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it, YOU MUST NOW DO, to avoid potential confusion!
>
> ```yaml
> version: "3.8" # `WARN[0000]:` for any docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it, to avoid potential confusion!
> ```

Please investigate any failures and resolve problems one at a time until all issues are resolved.
