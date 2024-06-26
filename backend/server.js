const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase=require("./config/database")

//Handling Uncaught Exception
process.on("uncaughtException",(err)=>
{
  console.log(`Error: ${err.message}`);
  console.log(`Shutting Down the server Uncaught rejection`);
  process.exit(1);

})

//config
dotenv.config({ path: "backend/config/config.env" });

//connect to databse
connectDatabase();

const server=app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
  console.log(`Error:${err.message}`);
  console.log(`Shutting Down the server Unhadnled promise rejection`)
  server.close(()=>{
    process.exit(1); 
  });
})
