const fetch = require("cross-fetch");
const connection = require("../../database/connection");

const pushNotification = async (token, msg) => {
  const message = {
    to: token,
    sound: "default",
    title: "Casa Carne Premium 🍗",
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
  async pushNotificationUser(userId, msg) {
    const user = await connection("users").where("id", "=", userId).first();
    const { tokenPushNotification } = user;
    pushNotification(tokenPushNotification, msg);
  },

  async pushNotificationToken(tokenPush) {
    pushNotification(tokenPush);
  },
};
