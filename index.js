const express = require("express");
const app = express();
const pool = require("./db");
const shortid = require("shortid");

app.use(express.json());

// ROTAS
// Todas as URL
app.get("/url", async (req, res) => {
 
    try {
      const urls = await pool.query("SELECT * FROM tb_url");
      res.json(urls.rows);
    } catch (error) {}
  });

// Busca URL por Id
app.get("/url/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const url = await pool.query("SELECT * FROM tb_url WHERE id = $1", [
      id,
    ]);
    res.json(url.rows[0]);
  } catch (error) {}
});

// Busca URLs por Data
app.get("/url/pordata/:data", async (req, res) => {
    const { data } = req.params;
  
    try {
      const url = await pool.query("SELECT * FROM tb_url WHERE encurtada_em = $1", [data]);
      res.json(url.rows);
    } catch (error) {}
  });


// Encurta a URL e adiciona
app.post("/url", async (req, res) => {
  try {
    const { url_longa, encurtada_em } = req.body;
    const url_curta = "unyUrl.com/" + shortid.generate();

    const novaUrl = await pool.query(
      "INSERT INTO tb_url (url_longa, url_curta, encurtada_em) VALUES ($1, $2, $3) RETURNING *",
      [url_longa, url_curta, encurtada_em]
    );

    res.json(novaUrl.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// Deletar a URL
app.delete("/url/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const novaUrl = await pool.query(
        "DELETE FROM tb_url WHERE id = $1", [id]);
  
      res.json("Url deletada com sucesso");
    } catch (error) {
      console.error(error);
    }
  });

app.listen(3000, () => {
  console.log("servidor sendo ouvido na porta 3000");
});
