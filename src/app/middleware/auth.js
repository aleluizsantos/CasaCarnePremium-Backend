const connection = require("../../database/connection");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Passado na requisição no Headers authorization o token que foi gerado
  //Na authenticate da aplicação do authController
  const authHeader = req.headers.authorization;
  const tokenPushNotification = req.headers.tokenpushnotification;

  //Verificar se o token foi informado
  if (!authHeader) return res.status(401).send({ error: "No token provided" });

  //Verificar se o token esta no formato correto
  //ele inicia pela palavra: Bearer + hash
  const parts = authHeader.split(" "); //Separar as duas partes

  //Verificar se existe duas partes
  if (!parts.length === 2) return res.status(401).send({ erro: "Token error" });

  //Realizar destruturação separando o Bearer e token
  const [scheme, token] = parts;

  //Verifiar se scheme possui a palavra 'BEARER'
  //utilizando rex para fazer a verificação /i para indicar case sensitive
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: "token malformed" });
  }

  //Fazer a verificação do token usando jwt-(Json Web Token)
  jwt.verify(token, process.env.AUTH_SECRET, async (err, decoded) => {
    if (err)
      return res.status(401).send({ error: "Token invalido ou expirou" });

    const user = await connection("users").where("id", "=", decoded.id).first();
    if (!!user) {
      if (user.tokenPushNotification !== tokenPushNotification) {
        await connection("users")
          .where("id", "=", decoded.id)
          .update({
            ...user,
            tokenPushNotification,
          });
      }
      req.userId = decoded.id;
      return next();
    } else {
      return res.status("401").send({ error: "Usuário não cadastrado" });
      // return res.json({ error: "Usuário não cadastrado" });
    }
  });
};
