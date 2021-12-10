const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/auth");
const connection = require("../../database/connection");
const router = express.Router();

//Gerar token
function generateToken(params = {}) {
  return jwt.sign(params, process.env.AUTH_SECRET, {
    expiresIn: "365d",
  });
}

// Criar um usuário
// http://dominio/auth/register
router.post("/register", async (req, res) => {
  const { name, email, phone, password, tokenPushNotification } = req.body;

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
      tokenPushNotification,
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
  const { email, password, exponentPushToken } = req.body;

  if (email === "" || password === "")
    return res.status(401).send({ error: "Email ou senha em branco" });

  const user = await connection("users")
    .where("email", "=", email)
    .select("*")
    .first();
  //Verificação se o usuário esta cadastrado
  if (typeof user === "undefined")
    return res.status(401).send({ error: "Usuário não cadastrado" });

  // Verificação se passoword esta correto
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).send({ error: "Senha incorreta" });

  // Verificar se o usuário logou em um novo dispositivo
  if (user.tokenPushNotification !== exponentPushToken) {
    await connection("users")
      .where("email", "=", email)
      .update({
        ...user,
        tokenPushNotification: exponentPushToken,
      });
  }

  // Open-Close
  const openClose = await connection("operation").first().select("open_close");
  // Quantidade de pedidos
  const totalPedidosProcess = await connection("request")
    .whereIn("statusRequest_id", [1])
    .count("id as countRequest")
    .first();
  // Quantidade de usuário no sistema
  const totalUsers = await connection("users")
    .where("typeUser", "=", "user")
    .count("id as countUser")
    .first();

  // Retorno caso password estive correto retorna usuário e token
  return res.send({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      typeUser: user.typeUser,
      tokenPushNotification: exponentPushToken,
      blocked: user.blocked,
    },
    token: generateToken({ id: user.id }),
    openClose: openClose.open_close,
    totalPedidosProcess: totalPedidosProcess.countRequest,
    totalUsers: totalUsers.countUser,
  });
});

router.use(authMiddleware);

router.get("/checkToken/:token", async (req, res) => {
  const user_id = req.userId;
  const { token } = req.params;
  //Fazer a verificação do token usando jwt-(Json Web Token)
  jwt.verify(token, process.env.AUTH_SECRET, async (err) => {
    if (err) {
      const refreshToken = generateToken({ id: user_id });
      return res.json({ refreshToken: true, token: refreshToken });
    }

    return res.json({ refreshToken: false });
  });
});
// Listar todos usuários cadastrados
// http:dominio/auth/users
router.get("/users", async (req, res) => {
  const users = await connection("users")
    .where("typeUser", "=", "user")
    .join("addressUser", "users.id", "addressUser.user_id")
    .where("addressUser.active", "=", true)
    .select(
      "users.id",
      "users.name",
      "users.email",
      "users.phone",
      "users.passwordResetToken",
      "users.passwordResetExpires",
      "users.typeUser",
      "users.blocked",
      "users.tokenPushNotification",
      "users.created_at",
      "addressUser.address",
      "addressUser.number",
      "addressUser.neighborhood",
      "addressUser.city"
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

  // Buscar dados do usuário
  const userAdm = await connection("users")
    .where("id", "=", user_id)
    .where("typeUser", "=", "admin")
    .first();
  // Checar se o usuário é administrador
  // caso negativo não pode desbloquear
  if (userAdm !== undefined) {
    const user = await connection("users")
      .where("id", "=", id)
      .select("blocked")
      .first();
    // Gravando as alterações no banco se usuário tive bloqueado
    // será desbloqueado ou vice-versa
    await connection("users")
      .where("id", "=", id)
      .update({ blocked: !user.blocked });

    return res.json(!user.blocked);
  } else {
    return res.json({
      error: "Usuário não tem permissão para realizar esta ação.",
    });
  }
});
// Deletar um usuário
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
// Atualizar os dados de um usuário
router.put("/users/:id", async (req, res) => {
  const idUserLogin = req.userId;
  const { id } = req.params;
  const { name, email, phone, tokenPushNotification } = req.body;
  let statusUpgrade = false;

  try {
    // Checar se o usuário logado é o mesmo que esta alterando os dados
    if (Number(idUserLogin) === Number(id)) {
      await connection("users")
        .where("id", "=", id)
        .update({ name, email, phone, tokenPushNotification });
      statusUpgrade = true;
    }

    return res.json({ success: statusUpgrade });
  } catch (error) {
    return res.json({
      success: false,
      error: "E-mail já vinculado a um usuário",
    });
  }
});
// Alterar a senha do usuário
router.put("/password/:id", async (req, res) => {
  const idUserLogin = req.userId;
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  // Checar se o usuário logado é o mesmo que esta alterando a senha
  if (Number(idUserLogin !== Number(id)))
    return res.json({
      success: false,
      error: "Desculpe, você não tem permissão para fazer isto!",
    });
  // Buscar dados do usuário
  const user = await connection("users")
    .where("id", "=", id)
    .select("*")
    .first();
  // Checar se usuário existe
  if (typeof user === "undefined")
    return res.json({ success: false, error: "Usuário não localizado" });
  // Checar se a senha antiga passada seja igua a cadastrada
  if (!(await bcrypt.compare(oldPassword, user.password)))
    return res.json({
      success: false,
      error: "Desculpe, senha antiga não confere!",
    });
  // Criptografar a nova senha
  const cryptNewPass = await bcrypt.hash(newPassword, 10);

  const statusUpgrade = await connection("users").where("id", "=", id).update({
    password: cryptNewPass,
  });

  return res.json({ success: Boolean(statusUpgrade) });
});

module.exports = (app) => app.use("/auth", router);
