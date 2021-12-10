const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Listar Operação Aberto / Fechado
// http://dominio/status
router.get("/", async (req, res) => {
  const taxaDelivery = await connection("taxaDelivery").first().select("*");
  const deliveryTyper = await connection("deliveryType").select("*");
  const operation = await connection("operation").first().select("*");

  return res.json({
    open_close: operation.open_close,
    taxaDelivery,
    deliveryTyper,
  });
});

router.use(authMiddleware);

// Atualizar uma Status
// http://dominio/status/:id
router.put("/", async (req, res) => {
  const user_id = req.userId; //Id do usuário recebido no token;
  const operation = await connection("operation").first().select("*");
  const user = await connection("users").where("id", user_id).first();

  const valueOpenClose = !operation.open_close;

  try {
    if (user.typeUser === "admin") {
      await connection("operation").where("id", 1).update({
        open_close: valueOpenClose,
      });

      req.io.emit("operation", {
        open_close: valueOpenClose,
      });
      return res.json({
        open_close: valueOpenClose,
        message: "Atualização realizada com sucesso",
      });
    } else {
      return res.json({ Message: "Usuário sem permissão" });
    }
  } catch (error) {
    return res.json({ Message: "Erro", typeErro: error });
  }
});

module.exports = (app) => app.use("/operation", router);
