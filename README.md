# CaviaJS

NestJS-CQRS is a paine for making event sourcing and especially event modeling on NestJS ecosystem.  The aim of this framework is to give tools for easily implement backends with the event-modeling methodology.
In order to develop easily and as fast as possible a backend project using event-modeling, here is CaviaJS. This framework is on top of NestJS, and get ride of the CQRS lib. 

The book says "UX -> Command -> event ->  ViewModel -> UX", and so does CaviaJS.

You can play with the example given in the app folder for a better understanding of what is it all about.

You can run the unit tests by running : 
```typescript
yarn test
```

And the e2e tests by running : 
```typescript
yarn test:e2e
```

You can build the lib by running : 
```typescript
yarn build:lib
```

Note that the way it's wired, you do not have to build, export or update anything to see a change you made in the lib folder being handled in the app folder. It will act exactly like if you have made a `yarn add cavia-js` in the app folder.

You can find the entire documentation on this page : [https://doc.cavia-js.com/](https://doc.cavia-js.com/)
