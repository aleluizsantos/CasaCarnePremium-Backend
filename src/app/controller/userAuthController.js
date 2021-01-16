const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/auth");
const connection = require("../../database/connection");
const router = express.Router();

//Gerar token
function generateToken(params = {}) {
  return jwt.sign(params, process.env.AUTH_SECRET, {
    expiresIn: 525600,
  });
}

// Criar um usuário
// http://dominio/auth/register
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (name === "" || email === "" || phone === "" || password === "")
    return res.status(400).send({ error: "campos obrigatórios" });

  // Verificação se email já esta cadastrado
  const existUser = await connection("users").where("email", "=", email);

  if (existUser.length > 0)
    return res.status(400).send({ error: "E-mail já cadastrado" });

  // Cryptografar a senha
  const crypPassword = await bcrypt.hash(password, 10);

  try {
    const trx = await connection.transaction();
    const user = {
      name,
      email,
      phone,
      password: crypPassword,
    };
    await trx("users").insert(user);
    await trx.commit();

    const totalUsers = await connection("users")
      .count("id as countUser")
      .first();
    // emitir um aviso novo usuário criado retornando o total
    req.io.emit("ClientsRegistered", totalUsers);

    return res.json({ Message: "Success", user });
  } catch (error) {
    return res.json({ Error: "Falha na insersão de dados" });
  }
});
// Autenticação de usuário
// http://dominio/auth/authenticate
router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "")
    return res.status(400).send({ error: "Email ou senha em branco" });

  const user = await connection("users")
    .where("email", "=", email)
    .select("*")
    .first();
  //Verificação se o usuário esta cadastrado
  if (user === undefined)
    return res.status(400).send({ error: "Usuário não cadastrado" });

  // Verificação se passoword esta correto
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).send({ error: "Senha incorreta" });

  // Retorno caso password estive correto retorna usuário e token
  return res.send({
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      blocked: user.blocked,
    },
    token: generateToken({ id: user.id }),
  });
});

router.use(authMiddleware);
// Listar todos usuários cadastrados
// http:dominio/auth/users
router.get("/users", async (req, res) => {
  const users = await connection("users")
    .leftJoin("addressUser", "addressUser.user_id", "users.id")
    .select(
      "users.id",
      "users.name",
      "users.email",
      "users.phone",
      "users.passwordResetToken",
      "users.passwordResetExpires",
      "users.typeUser",
      "users.blocked",
      "users.created_at",
      "addressUser.address as address",
      "addressUser.cep as cep",
      "addressUser.number as number",
      "addressUser.neighborhood as neighborhood",
      "addressUser.city as city",
      "addressUser.uf as uf"
    )
    .orderBy("name", "asc");

  return res.json(users);
});

// Listar todos usuários específica
// http:dominio/auth/users/:id
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const users = await connection("users")
    .where("users.id", "=", id)
    .join("addressUser", "addressUser.user_id", "users.id")
    .select(
      "users.id",
      "users.name",
      "users.email",
      "users.phone",
      "users.passwordResetToken",
      "users.passwordResetExpires",
      "users.typeUser",
      "users.blocked",
      "users.created_at",
      "addressUser.address as address",
      "addressUser.cep as cep",
      "addressUser.number as number",
      "addressUser.neighborhood as neighborhood",
      "addressUser.city as city",
      "addressUser.uf as uf"
    )
    .orderBy("name", "asc");

  return res.json(users);
});
//Desbloquear ou Bloquear usuário, apenas ADMINISTRADOR
// http://dominio/auth/users/:id
router.get("/blocked/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId; //Id do usuário recebido no token;

  const userAdm = await connection("users")
    .where("id", "=", user_id)
    .where("typeUser", "=", "admin")
    .first();

  if (userAdm !== undefined) {
    const user = await connection("users")
      .where("id", "=", id)
      .select("blocked")
      .first();

    const updateUser = await connection("users")
      .where("id", "=", id)
      .update({ blocked: !user.blocked });

    return res.json(updateUser);
  } else {
    return res.json({
      message: "Usuário não tem permissão para realizar esta ação.",
    });
  }
});

router.delete("/userDelete/:id", async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId; //Id do usuário recebido no token;
  const userAdm = await connection("users")
    .where("id", "=", user_id)
    .where("typeUser", "=", "admin")
    .first();

  if (userAdm !== undefined) {
    const user = await connection("users").where("id", "=", id).delete();
    return res.json(user); //Returna 1=True excluido | 0=Falha na exclusão
  } else {
    return res.json({
      message: "Usuário não tem permissão para realizar esta ação.",
    });
  }
});

module.exports = (app) => app.use("/auth", router);
