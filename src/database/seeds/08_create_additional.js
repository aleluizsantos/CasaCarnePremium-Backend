exports.seed = async function (knex) {
  await knex("additional").insert([
    {
      description: "Sim, desejo que tempera.",
      price: 0,
      typeAdditional_id: 1,
    },
    {
      description: "Não temperar.",
      price: 0,
      typeAdditional_id: 1,
    },
  ]);
};
