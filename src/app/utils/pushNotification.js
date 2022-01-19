const fetch = require("cross-fetch");
const connection = require("../../database/connection");

const pushNotification = async (token, title, msg) => {
  const message = {
    to: token,
    sound: "default",
    title: title || "Casa Carne Premium 🍖",
    body: msg,
  };

  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  /**
   * Push Notification: usuário específico
   * @param {numer} userId Identificação do usuário
   * @param {string} msg Mensagem para ser enviada
   */
  async pushNotificationUser(userId, title = "", message) {
    const user = await connection("users").where("id", "=", userId).first();
    const { tokenPushNotification } = user;
    pushNotification(tokenPushNotification, title, message);
  },
  /**
   * Push Notifivication grupo de usuários
   * @param {Array} usersToken Lista de token para enviar push
   * @param {String} message Mensagem a ser enviada para o grupo
   */
  async pushNotificationGruop(usersToken, title = "", message) {
    // Enviar push para todos os usuários
    usersToken.map(async (userToken) => {
      await pushNotification(userToken, title, message);
    });
  },

  async pushNotificationAllUsers(title = "", message) {
    const usersToken = await connection("users")
      .where("typeUser", "=", "user")
      .select("tokenPushNotification");

    usersToken.map(async (userToken) => {
      await pushNotification(userToken.tokenPushNotification, title, message);
    });
  },
};
