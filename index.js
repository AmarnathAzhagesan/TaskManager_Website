import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "amar1234",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/",async (req, res) => {
  const result=await db.query('SELECT * from items');
  console.log(result.rows);
  const items=result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  console.log(item);
  await db.query('INSERT INTO items(title) values ($1)',[item]);
  
 // items.push({ title: item });
  res.redirect("/");
});

app.post("/edit",async (req, res) => {

   let title=req.body.updatedItemTitle;
   console.log(req.body);
   let id=req.body.updatedItemId;
   await db.query("UPDATE items set title=($1) WHERE id=($2)",[title,id]) ;
  res.redirect("/");
});

app.post("/delete",async (req, res) => {
    console.log(req.body.deleteItemId);
    let id=req.body.deleteItemId;
    
    await db.query("DELETE FROM items WHERE id=($1)",[id]) ;
    res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
