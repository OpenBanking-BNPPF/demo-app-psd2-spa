# OPEN BANK - DEMO APP
===========

This node js app can be used in order to interact with the open bank sandbox.

## How to install it ?

We'll consider you already have Node.js installed.  

- install npm packages

```bash
npm install 
```
## How to use it ?
run the application using
```bash
npm run dev
```
this will:
- start the server by default on port 8090. (127.0.0.1:8090)
- webpack dev server will proxy by default all the '/api/*' calls to 'http://localhost:8081/api'. 
That means you have to start your node js application
