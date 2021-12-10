const express = require("express");
const router = express.Router();
const Yup = require("yup");

const authMiddlerare = require("../middleware/auth");
const { pushNotificationGruop } = require("../utils/pushNotification");
router.use(authMiddlerare);

// Enviar Notificação
router.post("/send", async (req, res) => {
  // Receber o array de token de usuers
  const { tokenPush, message, title } = req.body;
  // Schema de validadeção de dados
  const schema = Yup.object().shape({
    tokenPush: Yup.array().required(),
    message: Yup.string().required(),
  });
  //Validar dados
  if (!schema.isValidSync(req.body)) {
    return res.json({ error: "Parametros incorretos." });
  }
  // Enviar para notificação push
  pushNotificationGruop(tokenPush, title, message);
  return res.send();
});

module.exports = (app) => app.use("/pushNotification", router);
