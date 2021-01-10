const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  ValidationCoupon,
  GenerateCoupon,
} = require("../utils/validationCupon");

const router = express.Router();

router.use(authMiddleware);

// Listar um cupom específico
// http://dominio/coupon
router.get("/validation/:coupon", async (req, res) => {
  const { payment } = req.headers;
  const { coupon } = req.params;

  const validateCoupon = await ValidationCoupon(coupon.toUpperCase(), payment);

  return res.json(validateCoupon);
});

// Criar lista todos cupons
// http://dominio/coupon
router.get("/", async (req, res) => {
  const coupons = await connection("coupon")
    .orderBy("dataExpireCoupon", "desc")
    .select("*");

  return res.json(coupons);
});

// Criar um cupom de desconto apenas adminstrador
// http://dominio/coupon
router.post("/create", async (req, res) => {
  const user_id = req.userId; //Id do usuário recebido no token
  const { paymentType, dataExpireCoupon, amount, discountAmount } = req.body;

  // Buscar o tipo de usuário
  const user = await connection("users")
    .where("id", user_id)
    .first()
    .select("*");

  if (user.typeUser != "admin")
    return res.json({ Message: "Acesso negado, usuário sem permissão" });

  const coupon = await GenerateCoupon();

  const dataCoupon = {
    number: coupon,
    paymentType,
    amount,
    dataExpireCoupon: Date(dataExpireCoupon),
    discountAmount,
  };

  await connection("coupon").insert(dataCoupon);

  return res.json(dataCoupon);
  
});
// Excluir um cupom de desconto apenas adminstrador
// http://dominio/coupon/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const coupon = await connection("coupon").where("id", id).delete();

  return res.json({ message: coupon ? "Excluído com sucesso" : "Erro" });
});

module.exports = (app) => app.use("/coupon", router);
