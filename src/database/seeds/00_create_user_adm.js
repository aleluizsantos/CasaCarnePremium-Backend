exports.seed = async function (knex) {
  await knex("users").insert([
    {
      name: "Alessandro L. Santos",
      email: "aleluizsantos@gmail.com",
      phone: "(17) 98826-0129",
      password: "$2a$10$ag3gNBv9wXR43I0FOjY6weW9pBkSytFavLxUdkf7EWB75BDyKmvPm",
      typeUser: "admin",
      blocked: "false",
    },
  ]);

  await knex("deliveryType").insert([
    { description: "Delivery" },
    { description: "Retirar loja" },
  ]);

  await knex("operation").insert([{ open_close: false }]);
};
