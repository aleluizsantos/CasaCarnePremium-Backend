const express = require("express");
const Yup = require("yup");

const connection = require("../../database/connection");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.use(authMiddleware);

router.post("/create", async (req, res) => {
  const provider = ({
    nameProvider,
    nameContact,
    address,
    cep,
    number,
    neighborhood,
    city,
    uf,
  } = req.body);

  const schema = Yup.object().shape({
    nameProvider: Yup.string().required(),
    nameContact: Yup.string(),
    address: Yup.string().required(),
    cep: Yup.string().required(),
    number: Yup.string().required(),
    neighborhood: Yup.string().required(),
    city: Yup.string().required(),
    uf: Yup.string().required(),
  });

  try {
    //Checar validação dos dados
    const isvalidate = schema.isValidSync(provider, { abortEarly: false });
    if (!isvalidate) return res.json({ error: "Erro de validação." });

    // Salvar o dados do Fornecedor
    await connection("provider").insert(provider);

    return res.json(provider);
  } catch (error) {
    return res.json({ error: "Ocorreu um problema" });
  }
});

router.get("/", async (req, res) => {
  const provider = await connection("provider")
    .orderBy("nameProvider", "asc")
    .select("*");

  return res.json(provider);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const isDelete = await connection("provider").where("id", "=", id).delete();

  if (!isDelete) return res.json({ error: "Falha ao excluir o registro." });

  return res.json({ message: "Exclusão realizada com sucesso" });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const provider = ({
    nameProvider,
    nameContact,
    address,
    cep,
    number,
    neighborhood,
    city,
    uf,
  } = req.body);

  const schema = Yup.object().shape({
    nameProvider: Yup.string().required(),
    nameContact: Yup.string(),
    address: Yup.string().required(),
    cep: Yup.string().required(),
    number: Yup.string().required(),
    neighborhood: Yup.string().required(),
    city: Yup.string().required(),
    uf: Yup.string().required(),
  });

  try {
    //Checar validação dos dados
    const isvalidate = schema.isValidSync(provider, { abortEarly: false });
    if (!isvalidate) return res.json({ error: "Erro de validação." });

    // Salvar o dados do Fornecedor
    const updateProvider = await connection("provider")
      .where("id", "=", id)
      .update(provider);

    if (!updateProvider) return res.json({ error: "Falha na exclusão" });
    return res.json(provider);
  } catch (error) {
    return res.json({ error: "Ocorreu um problema" });
  }
});
/**
 * Listar todos os produto mediante criterio de pesquisa
 * http://dominio/product/${text}
 * @param search String critério de pesquisa
 */
router.get("/:search", async (req, res) => {
  const { search } = req.params;

  const provider = await connection("provider")
    .where("nameProvider", "~*", `.*${search}`)
    .select("*");

  return res.status(200).json(provider);
});

module.exports = (app) => app.use("/provider", router);
