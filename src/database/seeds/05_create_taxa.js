exports.seed = async function (knex) {
  await knex("taxaDelivery").insert([
    {
      vMinTaxa: 0,
      taxa: 0,
    },
  ]);
};
