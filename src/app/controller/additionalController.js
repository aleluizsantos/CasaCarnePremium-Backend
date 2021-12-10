const express = require("express");
const connection = require("../../database/connection");
const authMiddleware = require("../middleware/auth");
const Yup = require("yup");

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.userId;
  const { additional } = req.headers;

  let isAdmin;
  if (userId === null || typeof userId === "undefined") {
    isAdmin = [true];
  } else {
    const user = await connection("users").where("id", "=", userId).first();
    isAdmin = user.typeUser === "admin" ? [true, false] : [true];
  }
  // Transformar a lista de String em array
  const listAdditional = additional.split(",");

  try {
    const additional = await connection("additional")
      .whereIn("additional.typeAdditional_id", listAdditional)
      .join(
        "typeAdditional",
        "additional.typeAdditional_id",
        "typeAdditional.id"
      )
      .whereIn("typeAdditional.typeAdditionVisible", isAdmin)
      .orderBy("typeAdditional_id", "asc")
      .orderBy("description", "asc")
      .select(
        "additional.*",
        "typeAdditional.description as typeAdditional",
        "typeAdditional.typeAdditionVisible",
        "typeAdditional.limitAdditional",
        "typeAdditional.manySelected"
      );
    return res.json(additional);
  } catch (error) {
    return res.json([]);
  }
});

router.use(authMiddleware);

router.post("/create", async (req, res) => {
  const additional = ({ description, price, typeAdditional_id } = req.body);

  const schema = Yup.object().shape({
    description: Yup.string().required(),
    price: Yup.number().required(),
    typeAdditional_id: Yup.number().required(),
  });

  if (!schema.isValidSync(additional))
    return res.json({ error: "Validation data" });

  const insertId = await connection("additional").insert(additional, "id");

  return res.json({ id: insertId[0], description, price });
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const isDelete = await connection("additional").where("id", "=", id).delete();
  return res.json({
    success: Boolean(isDelete),
    message: isDelete ? "Item foi excluído." : "Falha objeto não encontrado.",
  });
});

router.put("/upgrade/:id", async (req, res) => {
  const { id } = req.params;
  const { description, price } = req.body;

  const schema = Yup.object().shape({
    description: Yup.string().required(),
    price: Yup.number().required(),
  });

  const additional = { description, price };

  if (!schema.isValidSync(additional))
    return res.json({ error: "Validation data" });

  const isUpdate = await connection("additional")
    .where("id", "=", id)
    .update(additional);

  return res.json({
    success: Boolean(isUpdate),
    message: isUpdate ? "Item foi atualizado." : "Falha ao atualizar o item.",
  });
});

module.exports = (app) => app.use("/additional", router);
