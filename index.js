const express = require("express");
const app = express();
const pool = require("./db");
const shortid = require("shortid");

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Encurtador de URL',
      description: 'Encurtador de URL feito na disciplina de desenvolvimento backend UNYLEYA',
      contact: {
        name: 'Pablo Araújo'
      }, 
      servers: ['http://localhost:3000']
    },
  },
  apis: ['index.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(express.json());

/**
 * @swagger
 * /url:
 *  get:
 *    summary: Busca todas as Urls
 *    responses:
 *      200:
 *        description: Suceso ao buscar Urls
 */
app.get("/url", async (req, res) => {
 
    try {
      const urls = await pool.query("SELECT * FROM tb_url");
      res.json(urls.rows);
    } catch (error) {}
  });

// Busca URL por Id
/**
 * @swagger
 * /url/{id}:
 *  get:
 *    summary: Busca todas as Urls d
 *    parameters:
 *      - in: path
 *        name: id 
 *        schema:
 *          type: int
 *        required: true
 *        description: Url id
 */
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
/**
 * @swagger
 * /url/pordata/{data}:
 *  get:
 *    description: Busca todas as Urls por data
 *    parameters:
 *      - in: path
 *        name: data 
 *        schema:
 *          type: date
 *        required: true
 *        description: Url data
 */
app.get("/url/pordata/:data", async (req, res) => {
    const { data } = req.params;
  
    try {
      const url = await pool.query("SELECT * FROM tb_url WHERE encurtada_em = $1", [data]);
      res.json(url.rows);
    } catch (error) {}
  });

/**
 * @swagger
 * /url:
 *  post:
 *    description: Cria uma url curta
 *    parameters:
 *    - name: url_longa
 *      description: Url longa
 *      in: formData
 *      required: true
 *      type: string
 *    - name: encurtada_em
 *      description: Data de encurtação
 *      in: formData
 *      required: true
 *      type: string
 *      responses:
 *        201:
 *          description: Sucesso ao gravar a url
 */
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

/**
 * @swagger
 * /url/{id}:
 *  delete:
 *    summary: deleta url pelo id
 *    parameters:
 *      - in: path
 *        name: id 
 *        schema:
 *          type: int
 *        required: true
 *        description: Url id
 */
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
