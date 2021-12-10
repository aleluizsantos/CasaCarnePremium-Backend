exports.seed = async function (knex) {
  await knex("product").insert([
    {
      name: "Alcatra",
      description: "Carne",
      ingredient:
        "Possui fibras macias, sendo extremamente saborosa. É um dos cortes bovinos mais versáteis.",
      price: 39.9,
      additional: "",
      image: "p1.jpg",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 26,
      visibleApp: true,
    },
  ]);
};
