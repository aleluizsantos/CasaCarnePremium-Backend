const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);
// Listar todos os endereços de um usuário
// http://dominio/address
router.get("/", async (req, res) => {
  const user_id = req.userId;

  // Verificação se o user_id foi passado
  if (!user_id) return res.json({ message: "Erro falta de identificação" });

  const addr = await connection("addressUser")
    .where("user_id", "=", user_id)
    .select("*");

  return res.json(addr);
});
// Listar criar um endereço de usuário
// http://dominio/address
router.post("/create", async (req, res) => {
  const {
    cep,
    address,
    number,
    neighborhood,
    city,
    uf,
    active,
    pointReference,
  } = req.body;

  const user_id = req.userId;

  // Verificar se o usuário já cadastrou este endereço
  const addressExists = await connection("addressUser")
    .where("user_id", "=", user_id)
    .where("address", "=", address)
    .where("number", "=", number)
    .where("city", "=", city)
    .first();

  if (!!addressExists) return res.json({ Error: "Endereço já existe." });

  const addUser = await connection("addressUser").insert({
    address,
    cep,
    number,
    neighborhood,
    city,
    uf,
    active,
    pointReference,
    user_id,
  });

  return res.json({
    Message: addUser ? "Criado com sucesso" : "Erro ao criar",
  });
});

// Excluir endereço de usuário
// http://dominio/address/delete/:id
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  const responseDelete = await connection("addressUser")
    .where({ id: id, user_id: user_id })
    .delete();

  return res.json({
    Status: responseDelete
      ? "Exclusão reaizada com Sucesso"
      : "Falha na exclusão.",
  });
});

module.exports = (app) => app.use("/address", router);
