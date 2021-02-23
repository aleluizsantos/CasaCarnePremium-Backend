const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");

const uploadConfig = require("../../config/upload");
const connection = require("../../database/connection");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const upload = multer(uploadConfig);

/**
 * Middleware interceptador verificar autenticidade do usuário
 * logado no sistema
 */
router.use(authMiddleware);

/**
 * Listar todos os produtos, pela categoria
 * http://dominio/product
 * @param category_id id da categoria
 */
router.get("/all", async (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;
  let totalProducts = 0;

  const products = await connection("product")
    .join("category", "product.category_id", "category.id")
    .join("measureUnid", "product.measureUnid_id", "measureUnid.id")
    .limit(limit)
    .offset(skip)
    .select(
      "product.*",
      "category.name as category",
      "measureUnid.unid as measureUnid"
    )
    .orderBy("product.name", "asc");

  await connection("product")
    .count("id as count")
    .then(function (total) {
      totalProducts = total[0].count;
    });

  const serialezeProduct = products.map((product) => {
    return {
      ...product,
      image_url: `${process.env.HOST}/uploads/${product.image}`,
    };
  });

  res.header("X-total-Count", totalProducts);

  return res.status(200).json({
    countProducts: totalProducts,
    products: serialezeProduct,
  });
});

/**
 * Listar todos os produtos, pela categoria
 * http://dominio/product
 * @param category_id id da categoria
 */
router.get("/", async (req, res) => {
  const { category_id } = req.query;
  let totalProducts = 0;

  const categorys = category_id.split(",").map((cat) => Number(cat.trim()));

  const products = await connection("product")
    .whereIn("product.category_id", categorys)
    .join("category", "product.category_id", "category.id")
    .join("measureUnid", "product.measureUnid_id", "measureUnid.id")
    .select(
      "product.*",
      "category.name as category",
      "measureUnid.unid as measureUnid"
    )
    .orderBy("product.name", "asc");

  totalProducts = products.length;

  const serialezeProduct = products.map((product) => {
    return {
      ...product,
      image_url: `${process.env.HOST}/uploads/${product.image}`,
    };
  });

  return res.status(200).json({
    countProducts: totalProducts,
    products: serialezeProduct,
  });
});

/**
 * Exibir lista de quantidade produtos por categorias
 * http://dominio/product/group
 */
router.get("/group", async (req, res) => {
  try {
    const product = await connection("product")
      .count("category_id as TotalProduct")
      .groupBy("category_id", "category.name")
      .join("category", "product.category_id", "category.id")
      .select("category.name");
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

/**
 * Listar todos os produto mediante criterio de pesquisa
 * http://dominio/product/${text}
 * @param search String critério de pesquisa
 */
router.get("/all/:search", async (req, res) => {
  const { search } = req.params;
  let totalProducts = 0;

  const products = await connection("product")
    .where("product.name", "~*", `.*${search}`)
    .join("category", "product.category_id", "category.id")
    .join("measureUnid", "product.measureUnid_id", "measureUnid.id")
    .select(
      "product.*",
      "category.name as category",
      "measureUnid.unid as measureUnid"
    );

  totalProducts = products.length;

  const serialezeProduct = products.map((product) => {
    return {
      ...product,
      image_url: `${process.env.HOST}/uploads/${product.image}`,
    };
  });

  return res.status(200).json({
    countProducts: totalProducts,
    products: serialezeProduct,
  });
});

/**
 * Listar todos produtos em promoção
 * http://dominio/product/promotion
 */
router.get("/promotion", async (req, res) => {
  const products = await connection("product")
    .join("category", "product.category_id", "category.id")
    .join("measureUnid", "product.measureUnid_id", "measureUnid.id")
    .where("promotion", "=", true)
    .select(
      "product.*",
      "category.name as Category",
      "measureUnid.unid as measureUnid"
    );

  const serialezeProduct = products.map((product) => {
    return {
      ...product,
      image_url: `${process.env.HOST}/uploads/${product.image}`,
    };
  });

  return res.json(serialezeProduct);
});

/**
 * Lista um produto específico
 * http://dominio/product/:id
 * @param id number identificação do produto
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const products = await connection("product").where("id", "=", id).select("*");
  const serialezeProduct = products.map((product) => {
    return {
      ...product,
      image_url: `${process.env.HOST}/uploads/${product.image}`,
    };
  });
  return res.json(serialezeProduct);
});

/**
 * Criar um Produto
 * http://dominio/produto/create
 */
router.post("/create", upload.single("image"), async (req, res) => {
  const requestImage = req.file;

  let nameImage;
  if (!!requestImage) {
    nameImage = requestImage.filename;
  } else {
    nameImage = "default.png";
  }

  const pathFile = !!nameImage
    ? path.resolve(__dirname, "..", "..", "..", "uploads", nameImage)
    : null;

  const {
    name,
    description,
    price,
    promotion,
    pricePromotion,
    category_id,
    measureUnid_id,
  } = req.body;

  try {
    const product = {
      name,
      description,
      price: Number(price),
      image: nameImage,
      promotion: promotion === "true" || promotion === true ? true : false,
      pricePromotion:
        promotion === "true" || promotion === true ? Number(pricePromotion) : 0,
      category_id: Number(category_id),
      measureUnid_id: Number(measureUnid_id),
    };

    const trx = await connection.transaction();
    // Inserir produto
    await trx("product").insert(product);
    // Efetivar inserção
    await trx.commit();

    // Emimitr sinal de atualização no banco novo produto
    req.io.emit("Update", { update: product });

    return res.json({ success: true, product });
  } catch (error) {
    // Exluir o arquivo
    if (fs.existsSync(pathFile)) {
      // Excluir somente se o arquivo não foi "default.png"
      nameImage !== "default.png" && fs.unlinkSync(pathFile);
    }
  }
});

/**
 * Excluir uma Produto
 * http://dominio/product/:id
 * @param id number identificação do produto
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await connection("product").where("id", "=", id).first();

    if (!!!product)
      return res.json({ error: "Identificação do produto inexistente." });

    const pathFile = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      product.image
    );

    if (fs.existsSync(pathFile)) {
      product.image !== "default.png" && fs.unlinkSync(pathFile);
    }

    const productBD = await connection("product").where("id", id).delete();

    req.io.emit("Update", { update: productBD });

    return res.json({ message: productBD ? "Excluído com sucesso" : "Erro" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/**
 * Atualizar uma Produto
 * http://dominio/cproduct/:id
 * @param id Number identificação do produto
 */
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    promotion,
    pricePromotion,
    category_id,
    measureUnid_id,
  } = req.body;

  const requestImage = req.file;

  const dataProductOld = await connection("product")
    .where("id", "=", id)
    .first();

  let pathFileOld = null;
  let nameImage;
  // Checar se foi enviada uma nova imgage
  if (!!requestImage) {
    // Nome da image nova
    nameImage = requestImage.filename;
    // Path da imagem antiga para Exluir
    pathFileOld = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      dataProductOld.image
    );
  } else {
    // Nome da image antiga não houve atualização na image
    nameImage = dataProductOld.image;
  }
  try {
    const productUpdate = {
      name,
      description,
      price: Number(price),
      image: nameImage,
      promotion: promotion === "true" || promotion === true ? true : false,
      pricePromotion:
        promotion === "true" || promotion === true ? Number(pricePromotion) : 0,
      category_id: Number(category_id),
      measureUnid_id: Number(measureUnid_id),
    };
    // Excluir o arquivo do produto antigo
    if (pathFileOld !== null) {
      if (fs.existsSync(pathFileOld)) {
        dataProductOld.image !== "default.png" && fs.unlinkSync(pathFileOld);
      }
    }

    await connection("product").where("id", "=", id).update(productUpdate);

    req.io.emit("Update", { update: Date.now() });

    return res.json({
      success: true,
      message: "Atualização realizada com sucesso",
    });
  } catch (error) {
    return res.json({ success: false, message: "Erro", typeErro: error });
  }
});

module.exports = (app) => app.use("/product", router);
