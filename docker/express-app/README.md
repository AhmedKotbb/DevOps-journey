## Create a distroless image for NodeJS Application

A distroless Docker image is a container image that contains only the application and its runtime dependencies, and nothing else.

Specifically, distroless images do not include:
- A Linux distribution (no Debian, Alpine, Ubuntu, etc.)
- A package manager (apt, apk, yum)
- A shell (/bin/sh, /bash)
- Debugging or userland utilities (ls, ps, curl, etc.)

The term “distroless” was popularized by Google through the gcr.io/distroless/* image family.

Official definition (Google):
“Distroless images contain only your application and its runtime dependencies.”