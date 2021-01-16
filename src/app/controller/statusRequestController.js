const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// Listar todas as status do pedido
// http://dominio/status
router.get("/", async (req, res) => {
  const status = await connection("statusRequest").select("*");
  return res.json(status);
});
// Lista uma status específica
// http://dominio/status/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const status = await connection("statusRequest")
    .where("id", "=", id)
    .select("*");
  return res.json(status);
});
// Criar uma Status
// http://dominio/status/create
router.post("/create", async (req, res) => {
  const { description, BGcolor } = req.body;

  try {
    await connection("statusRequest").insert({ description, BGcolor });

    return res.json({ Message: "success", description });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});
// Excluir uma Status
// http://dominio/status/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const status = await connection("statusRequest")
    .where("id", "=", id)
    .delete();

  return res.json({ message: status ? "Excluído com sucesso" : "Erro" });
});
// Atualizar uma Status
// http://dominio/status/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { description, BGcolor } = req.body;

  try {
    await connection("statusRequest").where("id", "=", id).update({
      description,
      BGcolor,
    });

    return res.json({ message: "Atualização realizada com sucesso" });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});

module.exports = (app) => app.use("/status", router);
