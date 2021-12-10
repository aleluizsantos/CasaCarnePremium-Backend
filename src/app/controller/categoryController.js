const express = require("express");
const path = require("path");
const fs = require("fs");

const authMiddleware = require("../middleware/auth");
const upload = require("../../config/upload");
const connection = require("../../database/connection");
const router = express.Router();

// Listar todas as categorias dos produtos
// http://dominio/category
router.get("/", async (req, res) => {
  const category = await connection("category")
    .where("categoryVisible", "=", true)
    .orderBy("name", "asc")
    .select("*");
  const serialezeCategory = category.map((cat) => {
    return {
      id: cat.id,
      name: cat.name,
      image_url: `${process.env.HOST}/uploads/${cat.image}`,
    };
  });

  return res.json(serialezeCategory);
});
// Lista uma categori específica
// http://dominio/category/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const category = await connection("category").where("id", id).select("*");
  const serialezecategory = category.map((cat) => {
    return {
      id: cat.id,
      name: cat.name,
      image_url: `${process.env.HOST}/uploads/${cat.image}`,
    };
  });
  return res.json(serialezecategory);
});

router.use(authMiddleware);
// Criar uma categoria
// http://dominio/category/create
router.post("/create", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  const requestImage = req.file;

  // Verificar se existe um tipo de categoria
  if (!name) return res.json({ error: "Nome é obrigatório" });

  let pathImage;
  if (!!requestImage) {
    pathImage = requestImage.filename;
  } else {
    pathImage = "default.jpg";
  }

  try {
    const trx = await connection.transaction();
    const categoryData = {
      name,
      image: pathImage,
    };
    // Inserir categoria
    const categoryId = await trx("category").insert(categoryData, "id");
    await trx.commit();

    req.io.emit("Update", { update: categoryData });

    return res.json({
      categoryId: categoryId[0],
      TotalProduct: 0,
      categoryVisible: true,
      name: categoryData.name,
      image: pathImage,
      image_url: `${process.env.HOST}/uploads/${categoryData.image}`,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
// Excluir uma categoria
// http://dominio/category/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Excluir a image do servidor, pesquisando dados completos da categoria
  const dataCategory = await connection("category")
    .where("id", "=", id)
    .first();

  // Categoria localizada
  if (typeof dataCategory !== "undefined") {
    //Capturando o path do arquivo
    const pathFile = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      dataCategory.image
    );

    //Checar se o aquivo existe no servidor
    if (fs.existsSync(pathFile)) {
      dataCategory.image !== "default.jpg" && fs.unlinkSync(pathFile);
    }
  }
  // Excluir dados da categoria do banco de dados
  const category = await connection("category").where("id", "=", id).delete();
  req.io.emit("Update", { update: category });
  return res.json({
    message: category ? "Excluído com sucesso" : "Falha na exclusão.",
  });
});
// Atualizar uma categoria
// http://dominio/category/visible/:name
router.put("/visible/:name", async (req, res) => {
  const { name } = req.params;

  const category = await connection("category")
    .where("name", "=", name)
    .first();

  const upgrade = await connection("category").where("name", "=", name).update({
    categoryVisible: !category.categoryVisible,
  });

  // Emimitr sinal de atualização no banco novo produto
  req.io.emit("Update", { update: Date.now() });

  return res.json({ success: Boolean(upgrade) });
});
// Atualizar uma categoria
// http://dominio/category/:id
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, nameImageCurrent } = req.body;
  const requestImage = req.file;

  let nameImage;
  if (!!requestImage) {
    // Existe uma image sendo enviada
    nameImage = requestImage.filename;
    // Exluir imagem antiga
    const pathFileOld = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      nameImageCurrent
    );
    // Checar se o arquivo existe no servidor
    if (fs.existsSync(pathFileOld)) {
      // Excluir o arquivo da imagem antiga
      fs.unlinkSync(pathFileOld);
    }
  } else {
    nameImage = nameImageCurrent;
  }

  try {
    const categoryUpdate = {
      name,
      image: nameImage,
    };

    await connection("category").where("id", "=", id).update(categoryUpdate);

    req.io.emit("Update", { update: categoryUpdate });

    return res.json({ message: "Atualização realizada com sucesso" });
  } catch (error) {
    return res.json({ message: "Erro", typeErro: error });
  }
});

module.exports = (app) => app.use("/category", router);
