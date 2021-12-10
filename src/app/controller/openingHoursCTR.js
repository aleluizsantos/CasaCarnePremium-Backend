const express = require("express");
const connection = require("../../database/connection");
const Yup = require("yup");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

// Referencia dias das semana
// 0:Domingo | 1:Segunda-Feria | 2:Terça-Feira | ... 6:Sábado
const valueWeek = [0, 1, 2, 3, 4, 5, 6];

/**
 * Lista os horários de atendimento do estabelecimento
 * em formato JSON
 */
router.get("/", async (req, res) => {
  const openingHours = await connection("openingHours")
    .orderBy("week_id", "asc")
    .select("*");
  return res.json(openingHours);
});

router.use(authMiddleware);

/**
 * Cria um novo horário de atendimento
 */
router.post("/create", async (req, res) => {
  let openingHours = ({ week, week_id, start, end, open } = req.body);

  const schema = Yup.object({
    week: Yup.string().required(),
    week_id: Yup.number().required(),
    start: Yup.string().required(),
    end: Yup.string().required(),
    open: Yup.bool().required(),
  });

  // Checar se o codigo da semana que foi informado esta dentro do intervalo
  // 0:Domingo ... 6:Sábado || Fora do intervalo: -1
  if (!valueWeek.includes(week_id)) {
    openingHours = {
      ...openingHours,
      week_id: -1,
    };
  }

  if (!schema.isValidSync(openingHours)) {
    return res.json({ error: "Validation data" });
  }

  const insertId = await connection("openingHours").insert(openingHours, "id");

  return res.json({ id: insertId[0], ...openingHours });
});
/**
 * Excluir um horário de atendimento
 */
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const isDelete = await connection("openingHours")
    .where("id", "=", id)
    .delete();
  return res.json({
    success: Boolean(isDelete),
    message: isDelete ? "Item foi excluído." : "Falha ao excluir item.",
  });
});

/**
 * Atualizar os valores do horáiros
 */
router.put("/update", async (req, res) => {
  const openingHours = req.body;

  const schema = Yup.object({
    week: Yup.string().required(),
    week_id: Yup.number().required(),
    start: Yup.string().required(),
    end: Yup.string().required(),
    open: Yup.bool().required(),
  });

  openingHours.forEach(async (element) => {
    if (schema.isValidSync(element)) {
      await connection("openingHours")
        .where("id", "=", element.id)
        .update(element);
    }
  });

  return res.json({
    success: true,
    message: "Item foi atualizado.",
  });
});

module.exports = (app) => app.use("/openingHours", router);
