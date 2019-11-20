# posts-apirest
APIRest in nodejs with mongodb 

We must install Mongodb and edit the connection string on `index.ts` 
> Install Mongo with brew for Mac https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

## Run the API
- First on the dir, we execute the command `tsc -w` to compile all the typescript to Javascript
- After we execute the command `nodemon dist` to watch & run the javascript files previously compiled

> Note: Probably, we must manually copy the `uploads` and `assets` dir into `dist/` to had the app running correctly 

