## About DNC Standard Plugin

It is a REST API, designed to enable the user to use the DNC features for accessing their device data from the data server. It process all requestes through DNC engine, make queries with device specific and then send back the response to the user.

## Release History

- v1.1.1 has the following changes:
  - Update the status code [#12](https://github.com/mcci-catena/DNC-Std-Plugin/commit/feb93806c7ef869bf26fa69da5e932a4bd1f3df8)
  - Add Token validation [#13](https://github.com/mcci-catena/DNC-Std-Plugin/commit/1d869cf7457528a949d3486aefb0c4018c459f1c)

- v1.1.0 has the following changes:
  - Hour selector included in the data read Endpoint
  - Data read Endpoint updated
  - Device list Endpoint updated with DNC devie mapping
  - Make all request specific to client 
  - Removed unwanted modules

- v1.0.0 Initial release:
  - Login Endpoint
  - Device database and measurement and field Endpoints
  - Device list Endpoint
  - Data read Endpoint
