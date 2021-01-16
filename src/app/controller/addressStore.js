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

  const addr = await connection("addressStore").select("*").first();

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
    phone,
    latitude,
    longitude,
    active,
  } = req.body;

  const user_id = req.userId;

  // Verificar se o usuário já cadastrou este endereço
  const addressExists = await connection("addressStore")
    .where("address", "=", address)
    .where("number", "=", number)
    .where("city", "=", city)
    .first();

  if (!!addressExists) return res.json({ Error: "Endereço já existe." });

  const addUser = await connection("addressStore").insert({
    cep,
    address,
    number,
    neighborhood,
    city,
    uf,
    phone,
    latitude,
    longitude,
    active,
  });

  return res.json({
    Message: addUser ? "Criado com sucesso" : "Erro ao criar",
  });
});
// Excluir endereço da loja
// http://dominio/address/delete/:id
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  // Verificar se o usuário é administrador
  const userAdmin = await connection("users")
    .where({ id: user_id, typeUser: "admin" })
    .first();

  if (!!userAdmin) {
    const responseDelete = await connection("addressStore")
      .where({ id: id })
      .delete();

    return res.json({
      Status: responseDelete
        ? "Exclusão realizada com sucesso"
        : "Falha na Exclusão",
    });
  } else {
    return res.json({ error: "Você não tem permissão para excluir." });
  }
});

module.exports = (app) => app.use("/addressStore", router);
