# CaviaJS Demo

Here is the implementation of the hotel reservation example, that you can find on the official event modeling website, [here](https://eventmodeling.org/posts/what-is-event-modeling/blueprint_large.jpg).

To make it run, you'll need an eventstore and a redis. 

You can get an eventstore by using this docker image:
```bash
# With X86 archs
docker run --name esdb-node -it -p 2113:2113 -p 1113:1113 \
    eventstore/eventstore:latest --insecure --run-projections=All

# On neww M1 apple silicone
docker run -d --name hotel-example-eventstore -it \
    -p 2113:2113 -p 1113:1113 ghcr.io/eventstore/eventstore:21.10.0-alpha-arm64v8 \
    --insecure --run-projections=All --enable-atom-pub-over-http
```

For the redis, you'll have it [the official way](https://hub.docker.com/_/redis) : 
```bash
docker run --name some-redis -d redis
```

Then you can run the example :
```bash
# Install dependencies
yarn

# Run the example
yarn start:example
```

Once the server is started, you have access to a swagger api on [http://localhost:3000/api](http://localhost:3000/api). You'll find here every thing you need to play with the example you can find [here](https://eventmodeling.org/posts/what-is-event-modeling/).

You also can trigger commands by using the redis for the one listenning on it.

Note that you have a CLI : 
```bash
# Print CLI documentation
yarn cli -- -- -h

# trigger command TotoCommand with arg 123 and { name: 'C3PO' }
yarn cli -- -- -c TotoCommand -p 123 -p {name:'C3PO'}
```
The CLI will trigger the method in the command TotoCommand that own the @Cli() property. Only one @CLI() per command is allowed.

You can find the entire documentation on this page : [https://doc.cavia-js.com/](https://doc.cavia-js.com/)
