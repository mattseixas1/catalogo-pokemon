const express = require("express");
const rotas = require("./rotas");
const app = express();


app.use(express.json());
app.use(rotas)





app.listen(3000, () => {
    console.log(`server is running on the port 3000 \nhttp://localhost:3000`)
})