# Ride app
This is an app for tracking our riding history

## Setup

1. Ensure `node (>8.6 and <= 10)` and `npm` are installed
2. Run `npm install`
3. Run `npm test`
4. Run `npm start`
5. Hit the server to test health `curl localhost:8010/health` and expect a `200` response 

## Doc

Link to the [Documentation](Doc.md)
## Stacks

- Http Server: Express
- DB : Sqlite 


## Apis
The app will response with http status code `200`. If there are any errors the server will return object
```json
{
    "error_code": "RIDES_NOT_FOUND_ERROR",
    "message": "Could not find any rides"
}

```

## Error code definitions
- RIDES_NOT_FOUND_ERROR : The ride that you are looking for is not available
- VALIDATION_ERROR: There's validation error with the input that you send
- SERVER_ERROR: There's internal server app

## Online OpenApi Doc
For more indepth api documentation, I suggest you read the openapi doc.

For running the openapi doc:
- Setup the app like the instruction above
- go to `localhost:8010/api-docs`
