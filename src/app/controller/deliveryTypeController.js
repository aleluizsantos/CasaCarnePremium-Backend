const express = require("express");

const connection = require("../../database/connection");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// Listar todas tipos de entregas
// http://dominio/deliverytype
router.get("/", async (req, res) => {
  const deliveryTyper = await connection("deliveryType").select("*");
  return res.json(deliveryTyper);
});
// Lista uma um tipo de entrega específico
// http://dominio/deliverytype/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const deliveryType = await connection("deliveryType")
    .where("id", "=", id)
    .select("*");
  return res.json(deliveryType);
});
// Criar um tipo de entrega
// http://dominio/deliveryType/create
router.post("/create", async (req, res) => {
  const { description } = req.body;

  try {
    await connection("deliveryType").insert({ description });

    return res.json({ Message: "success", description });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});
// Atualizar uma tipo de entrega
// http://dominio/deliveryType/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    await connection("deliveryType").where("id", "=", id).update({
      description,
    });

    return res.json({ message: "Atualização realizada com sucesso" });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});
// Excluir uma tipo de entrega
// http://dominio/deliveryType/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const delDelivery = await connection("deliveryType")
      .where("id", "=", id)
      .delete();

    return res.json({
      Message: delDelivery
        ? "Exclusão concluída com sucesso"
        : "Nenhuma exclusão foi realizada",
    });
  } catch (error) {
    return res.json({ erro: error });
  }
});
module.exports = (app) => app.use("/deliveryType", router);
