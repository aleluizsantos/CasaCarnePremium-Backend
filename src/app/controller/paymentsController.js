const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// Listar todas tipos de pagamentos ativos
// http://dominio/payment
router.get("/", async (req, res) => {
    const payment = await connection("payment").where("active", true).select("*");
    return res.json(payment);
});
// Listar todas tipos de pagamentos ativos e desativados
// http://dominio/payment/all
router.get("/all", async (req, res) => {
    const payment = await connection("payment").select("*");
    return res.json(payment);
});
// Lista uma um pagamento específico
// http://dominio/payment/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const payment = await connection('payment').where("id", id).select("*");
    return res.json(payment);
});
// Criar um tipo de pagamento
// http://dominio/payment/create
router.post("/create", async (req, res) => {
    const { type } = req.body;

    try {
        await connection('payment').insert({ type });

        return res.json({ Message: "success", type });

    } catch (error) {
        return res.json({ Message: "Erro", typeErro: error });
    }
});
// Atualizar uma tipo de pagamento
// http://dominio/payment/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    try {
        await connection('payment').where("id", id).update({
            type
        });

        return res.json({ message: "Atualização realizada com sucesso" });

    } catch (error) {
        return res.json({ Message: "Erro", typeErro: error });
    }
});
// Atualizar uma tipo de pagamento como Ativado ou Desativado
// http://dominio/payment/active/:id
router.put('/active/:id', async (req, res) => {
    const { id } = req.params;

    const active = await connection("payment").where("id", id).select("*");

    try {
        await connection('payment').where("id", id).update({
            active: active[0].active ? false : true
        });

        return res.json({ message: "Atualização realizada com sucesso" });

    } catch (error) {
        return res.json({ Message: "Erro", typeErro: error });
    }
});
module.exports = (app) => app.use("/payment", router);