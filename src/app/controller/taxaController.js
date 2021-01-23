const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// Lista a taxa de entrega
// http://dominio/taxa
router.get("/", async (req, res) => {
  const taxa = await connection("taxaDelivery").select("*").first();

  if (taxa === undefined) {
    return res.json({ vMinTaxa: 0, taxa: 0 });
  }
  return res.json(taxa);
});
// Atualizar a taxa de entrega
// http://dominio/taxa/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { vMinTaxa, taxa } = req.body;
  try {
    await connection("taxaDelivery").where("id", "=", id).update({
      vMinTaxa,
      taxa,
    });
    return res.json({ message: "Atualização realizada com sucesso" });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});

module.exports = (app) => app.use("/taxa", router);
