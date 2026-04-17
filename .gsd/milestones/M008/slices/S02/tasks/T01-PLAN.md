---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: ScrobbleControllerTest — MockMvc for all 4 endpoints

WebMvcTest for ScrobbleController. GET /settings returns masked tokens. PUT /settings connects LB (token), LF (username+password → mock authenticate). PUT with blank token disconnects. PUT with bad LF creds → 400. DELETE /settings/lastfm and /settings/listenbrainz disconnect and return updated response. Use @WithMockUser + Principal pattern (Knowledge #9). Mock UserRepository and LastfmService.

## Inputs

- `ScrobbleController.java — 4 endpoints, Principal auth, LastfmService.authenticate mock`
- `ScrobbleSettingsResponse.java — response DTO with mask()`
- `ScrobbleSettingsRequest.java — record with 3 nullable fields`
- `Pattern from PlayControllerTest, AuthControllerTest — @WebMvcTest + @MockBean + @WithMockUser`

## Expected Output

- `ScrobbleControllerTest.java with ~10 test methods covering happy paths and error cases for all 4 endpoints`

## Verification

mvn test -pl musicode-server -Dtest=ScrobbleControllerTest — all tests green
