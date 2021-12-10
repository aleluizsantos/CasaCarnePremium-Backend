exports.seed = async function (knex) {
  await knex("payment").insert([
    { type: "Dinheiro", active: 1, image: "icoCast.png" },
    { type: "Cartão C.C.Premium", active: 1, image: "icoCCP.png" },
    { type: "Visa", active: 1, image: "icoVisa.png" },
    { type: "Master Card", active: 1, image: "icoMast.png" },
    { type: "Elo", active: 1, image: "icoElo.png" },
    { type: "American Express", active: 1, image: "icoAEx.png" },
  ]);

  await knex("category").insert([
    { name: "Carne Bovina", image: "c1.jpg", categoryVisible: true },
    { name: "Carne Suína", image: "c2.jpg", categoryVisible: true },
    { name: "Linguiça", image: "c3.jpg", categoryVisible: true },
    { name: "Linguiça Gourmet", image: "c4.jpg", categoryVisible: true },
    { name: "Carne Ave", image: "c5.jpg", categoryVisible: true },
    { name: "Carne Carneiro", image: "c6.jpg", categoryVisible: true },
    { name: "Churrasco", image: "c7.jpg", categoryVisible: true },
    { name: "Espetos", image: "c8.jpg", categoryVisible: true },
    { name: "Hamburgues", image: "c9.jpg", categoryVisible: true },
    { name: "Bebidas", image: "c10.jpg", categoryVisible: true },
  ]);
};
