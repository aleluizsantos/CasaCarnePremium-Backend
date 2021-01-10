exports.seed = async function (knex) {
  await knex("payment").insert([
    { type: "Dinheiro", active: 1 },
    { type: "Cartão de Crédito", active: 1 },
    { type: "Cartão de Débito", active: 1 },
    { type: "Cartão SODEX", active: 1 },
    { type: "Cartão VR", active: 0 },
    { type: "Cheque", active: 0 },
  ]);

  await knex("category").insert([
    { name: "Carne Bovina", image: "default.png" },
    { name: "Carne Suína", image: "default.png" },
    { name: "Carne Carneiro", image: "default.png" },
    { name: "Carne Ave", image: "default.png" },
    { name: "Linguiça", image: "default.png" },
    { name: "Linguiça Gourmet", image: "default.png" },
    { name: "Churrasco", image: "default.png" },
    { name: "Bebidas", image: "default.png" },
    { name: "Assados", image: "default.png" },
  ]);
};
