const fs = require("fs");
const express = require("express");
const { productManager } = require("./ProductManager");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    console.log("Solicitud GET a /products recibida");
    let products = await productManager.getProducts();
    console.log(products);

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
    const product = await productManager.getProductById(parseInt(productId));

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

// La app se puede inicializar usando el comando "npm start" desde la terminal!
