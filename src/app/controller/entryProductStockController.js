const express = require("express");
const Yup = require("yup");

const connection = require("../../database/connection");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;
  let totalentryProduct = 0;

  await connection("entryProductStock")
    .count("id as count")
    .first()
    .then(function (total) {
      totalentryProduct = total.count;
    });

  const productStock = await connection("entryProductStock")
    .join("product", "entryProductStock.product_id", "product.id")
    .join("provider", "entryProductStock.provider_id", "provider.id")
    .orderBy("data_entry", "desc")
    .limit(limit)
    .offset(skip)
    .select(
      "provider.*",
      "entryProductStock.*",
      "product.name",
      "product.image",
      "product.price",
      "product.inventory as inventoryCurrent"
    );

  return res.json({ totalentryProduct, productStock });
});

router.post("/create", async (req, res) => {
  const entryStock = req.body;
  // Checar se o objeto é um array
  if (Array.isArray(entryStock)) {
    // Percorrer todos os produtos alterando o estoque deles
    entryStock.forEach(async (element) => {
      const product = await connection("product")
        .where("id", "=", element.product_id)
        .first();
      // calculando o estoque para o produto
      const newProduct = {
        ...product,
        inventory: Number(product.inventory) - Number(element.amount),
      };
      // Atualizar o banco
      await connection("product")
        .where("id", "=", element.product_id)
        .update(newProduct);
    });
  } else {
    const { amount, product_id } = entryStock;
    // Atualizar o Estoque
    const product = await connection("product")
      .where("id", "=", product_id)
      .first();
    //Criar o produto com o novo Estoque
    const newProduct = {
      ...product,
      inventory: Number(product.inventory) - Number(amount),
    };
    // Atualizar o banco
    await connection("product").where("id", "=", product_id).update(newProduct);
  }
  // Inserir dados na table entrada de produtos
  await connection("entryProductStock").insert(entryStock);

  return res.json(entryStock);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const isDelete = await connection("entryProductStock")
    .where("id", "=", id)
    .delete();

  if (!isDelete) return res.json({ error: "Falha ao excluir o registro." });

  return res.json({ message: "Exclusão realizada com sucesso" });
});

module.exports = (app) => app.use("/entryStock", router);
