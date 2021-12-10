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
  const user_id = req.userId;
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

  const newAddress = {
    address,
    cep,
    number,
    neighborhood,
    city,
    uf,
    active,
    pointReference,
    user_id: user_id,
  };

  // Verificar se o usuário já cadastrou este endereço
  const addressExists = await connection("addressUser")
    .where("user_id", "=", user_id)
    .where("address", "=", address)
    .where("number", "=", number)
    .where("city", "=", city)
    .first();

  if (!!addressExists) return res.json({ Error: "Endereço já existe." });

  const addUser = await connection("addressUser").insert(newAddress, "id");

  return res.json({
    id: addUser[0],
    ...newAddress,
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
    message: responseDelete
      ? "Exclusão realizada com Sucesso"
      : "Falha na exclusão.",
  });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;
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

  try {
    const updateAddress = await connection("addressUser")
      .where("id", "=", id)
      .update({
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
    return res.status(201).send(!!updateAddress);
  } catch (error) {
    return res.status(504).json({ error: error.message });
  }
});

router.put("/active/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  // Buscar o Endereço ativo
  const addressActive = await connection("addressUser")
    .where("user_id", "=", user_id)
    .where("active", "=", true)
    .select("*")
    .first();

  // Retirar o enderço antigo como padrão
  if (addressActive !== undefined) {
    // Verificar se o endereço ja esta ativo
    if (addressActive.id == id) {
      return res.json({ message: "Já é endereço padrão." });
    }

    await connection("addressUser")
      .where("id", "=", addressActive.id)
      .where("user_id", "=", user_id)
      .update({
        active: false,
      });
  }

  // Colocar o novo endereço como Padrão
  const upadteNewActiveAddress = await connection("addressUser")
    .where("id", "=", id)
    .where("user_id", "=", user_id)
    .update({
      active: true,
    });

  return res.status(201).json(!!upadteNewActiveAddress);
});

module.exports = (app) => app.use("/address", router);
