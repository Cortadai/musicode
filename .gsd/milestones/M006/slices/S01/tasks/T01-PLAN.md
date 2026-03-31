---
estimated_steps: 6
estimated_files: 3
skills_used: []
---

# T01: Add SpringDoc dependency + Security config

1. Add springdoc-openapi-starter-webmvc-ui dependency to pom.xml
2. Configure SecurityConfig to permit /swagger-ui/**, /v3/api-docs/**, /swagger-ui.html
3. Add OpenAPI configuration bean with app title, version, description
4. Configure cookie-based auth scheme in OpenAPI config so try-it-out sends cookies
5. Verify Spring Boot starts with springdoc on classpath
6. Verify /swagger-ui.html is accessible

## Inputs

- `musicode-server/pom.xml`
- `musicode-server/src/main/java/com/musicode/config/SecurityConfig.java`

## Expected Output

- `musicode-server/src/main/java/com/musicode/config/OpenApiConfig.java`
- `Updated pom.xml with springdoc dependency`
- `Updated SecurityConfig with swagger paths permitted`

## Verification

mvn spring-boot:run, then curl -s http://localhost:8080/swagger-ui.html returns 200 or redirect. curl -s http://localhost:8080/v3/api-docs returns JSON.
