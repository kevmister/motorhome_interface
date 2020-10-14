# motorhome_interface

This is the main interface for the Motorhome

There are several services running to handle any control from a higher level
Low level controls and safety will be handled by the individual units

## Services
### HTTP Server
HTTP Server will be running through NodeJS
This will provide a web based UI through which control signals are sent and information is received
Communication through the browser will be handled through a persistent websocket connection
### MQTT Server
MQTT will handle the majority of communication to all devices on the network
### Plex Server
There will also be a plex server running on the device to allow for remote access to moves and music
The server will have authorization disabled so it can be accessed locally through the web browser