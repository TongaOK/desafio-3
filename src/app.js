const fs = require("fs");
const express = require("express");
const ProductManager = require("./ProductManager");
const productos = new ProductManager();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

function readProductsFromFile() {
  try {
    const data = fs.readFileSync("products.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo products.json:", error);
    return [];
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    let products = await readProductsFromFile();

    if (limit && !isNaN(parseInt(limit, 10))) {
      const limitNumber = parseInt(limit, 10);
      products = products.slice(0, limitNumber);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const products = await readProductsFromFile();

    const product = products.find((p) => p.id === parseInt(productId, 10));

    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// La app se puede inicializar usando el comando "npm start" desde la terminal
