const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Listar todas tipos de pagamentos ativos
// http://dominio/payment
router.get("/", async (req, res) => {
  const payment = await connection("payment")
    .where("active", "=", true)
    .select("*");

  const serialezePayment = payment.map((pay) => {
    return {
      id: pay.id,
      type: pay.type,
      image_url: `${process.env.HOST}/uploads/${pay.image}`,
    };
  });

  return res.json(serialezePayment);
});
// Listar todas tipos de pagamentos ativos e desativados
// http://dominio/payment/all
router.get("/all", async (req, res) => {
  const payment = await connection("payment").select("*");
  return res.json(payment);
});
// Lista uma um pagamento específico
// http://dominio/payment/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const payment = await connection("payment").where("id", "=", id).select("*");
  return res.json(payment);
});

router.use(authMiddleware);
// Criar um tipo de pagamento
// http://dominio/payment/create
router.post("/create", async (req, res) => {
  const { type } = req.body;

  try {
    await connection("payment").insert({ type });

    return res.json({ Message: "success", type });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});
// Atualizar uma tipo de pagamento
// http://dominio/payment/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    await connection("payment").where("id", "=", id).update({
      type,
    });

    return res.json({ message: "Atualização realizada com sucesso" });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});
// Atualizar uma tipo de pagamento como Ativado ou Desativado
// http://dominio/payment/active/:id
router.put("/active/:id", async (req, res) => {
  const { id } = req.params;

  const active = await connection("payment").where("id", "=", id).select("*");

  try {
    await connection("payment").where("id", "=", id).update({
      active: !active[0].active,
    });

    return res.json({ message: "Atualização realizada com sucesso" });
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const delTypePayment = await connection("payment")
      .where("id", "=", id)
      .delete();

    return res.json({
      Message: delTypePayment
        ? "Exclusão concluída com sucesso"
        : "Nenhuma exclusão foi realizada",
    });
  } catch (error) {
    return res.json({ error: "Falha na exclusão." });
  }
});
module.exports = (app) => app.use("/payment", router);
