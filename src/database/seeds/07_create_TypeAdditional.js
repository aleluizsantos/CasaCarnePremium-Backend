exports.seed = async function (knex) {
  await knex("typeAdditional").insert([
    {
      description: "Deseja temperar a Carne?",
      manySelected: false,
      typeAdditionVisible: true,
      limitAdditional: "",
    },
  ]);
};
