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
    { name: "Carne Bovina", image: "1.jpg" },
    { name: "Carne Suína", image: "2.jpg" },
    { name: "Carne Carneiro", image: "3.jpg" },
    { name: "Carne Ave", image: "4.jpg" },
    { name: "Linguiça", image: "5.jpg" },
    { name: "Linguiça Gourmet", image: "6.jpg" },
    { name: "Churrasco", image: "7.jpg" },
    { name: "Bebidas", image: "8.jpg" },
    { name: "Assados", image: "9.jpg" },
  ]);
};
