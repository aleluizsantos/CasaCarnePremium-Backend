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
    { name: "Carne Bovina", image: "1.jpg", categoryVisible: true },
    { name: "Carne Suína", image: "2.jpg", categoryVisible: true },
    { name: "Carne Carneiro", image: "3.jpg", categoryVisible: true },
    { name: "Carne Ave", image: "4.jpg", categoryVisible: true },
    { name: "Linguiça", image: "5.jpg", categoryVisible: true },
    { name: "Linguiça Gourmet", image: "6.jpg", categoryVisible: true },
    { name: "Churrasco", image: "7.jpg", categoryVisible: true },
    { name: "Bebidas", image: "8.jpg", categoryVisible: true },
    { name: "Assados", image: "9.jpg", categoryVisible: true },
  ]);
};
