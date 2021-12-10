exports.seed = async function (knex) {
  await knex("users").insert([
    {
      name: "Casa Carne Premium",
      email: "casacarnepremium@gmail.com",
      phone: "(17) 99663-4236",
      password: "$2a$10$ag3gNBv9wXR43I0FOjY6weW9pBkSytFavLxUdkf7EWB75BDyKmvPm",
      typeUser: "admin",
      blocked: "false",
    },
  ]);

  await knex("deliveryType").insert([
    { description: "Delivery" },
    { description: "Retirada" },
  ]);

  await knex("operation").insert([{ open_close: false }]);
};
