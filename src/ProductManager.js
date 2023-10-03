const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.productIdCounter = 1;
  }

  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios.");
    }
    const products = await getJSONFromFile(this.path);
    if (products.some((p) => p.code === code)) {
      console.log(`Ya se encuentra agregado ese code: ${code}`);
    } else {
      const id = this.productIdCounter++;
      const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id,
      };
      products.push(newProduct);
      return saveJSONToFile(this.path, products);
    }
  }

  async getProducts() {
    return await getJSONFromFile(this.path);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const productById = products.find((p) => p.id === id);
    if (!productById) {
      console.log("Product not found");
      return null;
    } else {
      console.log("Product found", productById);
      return productById;
    }
  }

  async updateProduct(
    newTitle,
    newDescription,
    newPrice,
    newThumbnail,
    newCode,
    newStock,
    id
  ) {
    try {
      if (
        !newTitle ||
        !newDescription ||
        !newPrice ||
        !newThumbnail ||
        !newCode ||
        !newStock ||
        !id
      ) {
        throw new Error(
          "Todos los campos son obligatorios para actualizar el producto."
        );
      }

      const products = await getJSONFromFile(this.path);
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        return { error: `Producto no encontrado, ID: ${id}` };
      } else {
        products[index] = {
          title: newTitle,
          description: newDescription,
          price: newPrice,
          thumbnail: newThumbnail,
          code: newCode,
          stock: newStock,
          id: id,
        };

        await saveJSONToFile(this.path, products);

        return products[index];
      }
    } catch (error) {
      console.error(error);
      return { error: "Ocurrió un error al actualizar el producto." };
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    let index = products.findIndex((p) => p.id === id);
    if (index > -1) {
      products.splice(index, 1);
      await saveJSONToFile(this.path, products);
      console.log("Se ha borrado correctamente el producto");
    } else {
      console.log("No se ha podido borrar el producto");
    }
  }
}

const existFile = async (path) => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

const getJSONFromFile = async (path) => {
  if (!(await existFile(path))) {
    return [];
  }

  let content;

  try {
    content = await fs.promises.readFile(path, "utf-8");
  } catch (error) {
    throw new Error(`El archivo ${path} no pudo ser leído.`);
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
  }
};

const saveJSONToFile = async (path, data) => {
  const content = JSON.stringify(data, null, "\t");
  try {
    await fs.promises.writeFile(path, content, "utf-8");
  } catch (error) {
    throw new Error(`El archivo ${path} no pudo ser escrito.`);
  }
};

const desafio = async () => {
  try {
    const productManager = new ProductManager("./products.json");
    await productManager.addProduct({
      title: "Martillo",
      description: "Herramienta contundente",
      price: "1500",
      thumbnail: "*",
      code: "1",
      stock: "5",
    });
    await productManager.addProduct({
      title: "Sierra",
      description: "Herramienta cortante",
      price: "750",
      thumbnail: "*",
      code: "2",
      stock: "3",
    });
    await productManager.addProduct({
      title: "Destornillador",
      description: "Herramienta para desatornillar",
      price: "1100",
      thumbnail: "*",
      code: "3",
      stock: "5",
    });
    await productManager.addProduct({
      title: "Pinzas",
      description: "Herramienta cortante",
      price: "950",
      thumbnail: "*",
      code: "1",
      stock: "4",
    });
    const products = await productManager.getProducts();
    console.log("Acá los productos:", products);

    const productId = 2;
    await productManager.getProductById(productId);

    // await productManager.deleteProduct(productId);

    await productManager.updateProduct(
      "Motosierrap",
      "Herramienta cortante",
      "12000",
      "*",
      "1",
      "5",
      1
    );
  } catch (error) {
    console.error(" Ha ocurrido un error: ", error.message);
  }
};

desafio();

module.exports = ProductManager;
