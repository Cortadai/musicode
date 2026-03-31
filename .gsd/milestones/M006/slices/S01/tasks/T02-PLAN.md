---
estimated_steps: 5
estimated_files: 8
skills_used: []
---

# T02: Annotate controllers with OpenAPI descriptions

1. Add @Tag annotations to each controller with name and description
2. Add @Operation annotations to key endpoints with summary and description
3. Add @ApiResponse annotations for error codes (400, 401, 404, 409, 500)
4. Ensure DTOs (Records) are properly documented via @Schema where needed
5. Verify Swagger UI shows descriptions and schemas for all endpoints

## Inputs

- `All controller files`

## Expected Output

- `Annotated controller files`

## Verification

Start server, open /swagger-ui.html in browser, verify all controllers and endpoints visible with descriptions. mvn clean verify passes.
