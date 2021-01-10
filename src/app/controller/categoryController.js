const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// Listar todas as categorias dos produtos
// http://dominio/category
router.get("/", async (req, res) => {
  const category = await connection("category").select("*");
  const serialezecategory = category.map((cat) => {
    return {
      id: cat.id,
      name: cat.name,
      image_url: `${process.env.HOST}/uploads/${cat.image}`,
    };
  });

  return res.json(serialezecategory);
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
// Criar uma categoria
// http://dominio/category/create
router.post("/create", async (req, res) => {
  const { name, image } = req.body;
  
  try {
    const trx = await connection.transaction();
    const category = {
      name,
      image: image === undefined || image === "" ? "default.png" : image,
    };

    await trx("category").insert(category);
    await trx.commit();
   
    req.io.emit("Update", { update: category } );

    return res.json({ Message: "success", category });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});
// Excluir uma categoria
// http://dominio/category/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const category = await connection("category").where("id", id).delete();
  
  req.io.emit("Update", { update: category });

  return res.json({ message: category ? "Excluído com sucesso" : "Erro" });
});
// Atualizar uma categoria
// http://dominio/category/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    const categoryUpdate = {
      name,
      image: image === undefined || image === "" ? "default.png" : image,
    };

    await connection("category").where("id", id).update(categoryUpdate);

    req.io.emit("Update", { update: categoryUpdate });

    return res.json({ message: "Atualização realizada com sucesso" });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});

module.exports = (app) => app.use("/category", router);
