const express = require("express");
const connection = require("../../database/connection");
const headersAuth = require("../middleware/headersAuth");
const Yup = require("yup");

const router = express.Router();

router.use(headersAuth);

// Listar o tipos de Adicionais
router.get("/", async (req, res) => {
  const userId = req.userId;

  let isAdmin;
  if (userId === null || typeof userId === "undefined") {
    isAdmin = [true];
  } else {
    const user = await connection("users").where("id", "=", userId).first();

    isAdmin = user.typeUser === "admin" ? [true, false] : [true];
  }
  try {
    const typeAdditional = await connection("typeAdditional")
      .whereIn("typeAdditionVisible", isAdmin)
      .orderBy("id", "asc")
      .select("*");

    return res.json(typeAdditional);
  } catch (error) {
    return res.json({ error: error.message });
  }
});
// Criar o tipo de Adicional
router.post("/create", async (req, res) => {
  const typeAdditional = ({
    description,
    manySelected,
    typeAdditionVisible,
    limitAdditional,
  } = req.body);

  const schema = Yup.object().shape({
    description: Yup.string().required(),
    manySelected: Yup.boolean().required(),
  });

  // Validar os dados
  if (!schema.isValidSync(typeAdditional))
    return res.json({ error: "Validation data" });

  try {
    // Inserir dados
    const insertId = await connection("typeAdditional").insert(
      typeAdditional,
      "id"
    );

    return res.json({
      id: insertId[0],
      ...typeAdditional,
      typeAdditionVisible: true,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
// Deletar o tipo de Adicional
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const isDelete = await connection("typeAdditional")
    .where("id", "=", id)
    .delete();
  return res.json({
    success: Boolean(isDelete),
    message: isDelete ? "Item foi excluído." : "Falha ao excluir item.",
  });
});
// Atualizar tipo de adicional
router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  let typeAdditional = ({
    description,
    manySelected,
    typeAdditionVisible,
    limitAdditional,
  } = req.body);

  if (!manySelected) {
    typeAdditional = {
      ...typeAdditional,
      limitAdditional: "",
    };
  }

  const schema = Yup.object().shape({
    description: Yup.string().required(),
    manySelected: Yup.boolean().required(),
  });

  // Validar os dados
  if (!schema.isValidSync(typeAdditional))
    return res.json({ error: "Validation data" });

  try {
    await connection("typeAdditional")
      .where("id", "=", id)
      .update(typeAdditional);

    return res.json({ id: id, ...typeAdditional });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

module.exports = (app) => app.use("/typeAdditional", router);
