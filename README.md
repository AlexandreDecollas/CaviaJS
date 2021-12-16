# Event modeling the empirical way

The aim is to implement the [event modeling example](https://eventmodeling.org/posts/what-is-event-modeling/blueprint_large.jpg).

It uses an eventstore. You can get on by using this docker image : 
```
docker run -d --name hotel-example-eventstore -it -p 21135:2113 -p 11135:1113 ghcr.io/eventstore/eventstore:21.10.0-alpha-arm64v8 --insecure --run-projections=All --enable-atom-pub-over-http
```
