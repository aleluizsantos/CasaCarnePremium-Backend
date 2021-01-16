const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// Listar todas as unidades de medidas
// http://dominio/measureUnid
router.get("/", async (req, res) => {
  const measureUnid = await connection("measureUnid").select("*");
  return res.json(measureUnid);
});
// Lista uma unidade de medida específica
// http://dominio/measureUnid/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const measureUnid = await connection("measureUnid")
    .where("id", "=", id)
    .select("*");
  return res.json(measureUnid);
});
// Criar uma unidade de medida
// http://dominio/measureUnid/create
router.post("/create", async (req, res) => {
  const { unid, description } = req.body;

  try {
    await connection("measureUnid").insert({ unid, description });

    return res.json({ Message: "success", description });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});
// Atualizar uma unidade de medidas
// http://dominio/measureUnid/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { unid, description } = req.body;

  try {
    await connection("measureUnid").where("id", "=", id).update({
      unid,
      description,
    });

    return res.json({ message: "Atualização realizada com sucesso" });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const delMeasure = await connection("measureUnid")
      .where("id", "=", id)
      .delete();

    return res.json({
      Message: delMeasure
        ? "Exclusão concluída com sucesso"
        : "Nenhuma exclusão foi realizada",
    });
  } catch (error) {
    return res.json({ error: "Falha na exclusão." });
  }
});
module.exports = (app) => app.use("/measureunid", router);
