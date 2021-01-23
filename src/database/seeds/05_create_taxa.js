exports.seed = async function (knex) {
  await knex("taxaDelivery").insert([
    {
      vMinTaxa: 50,
      taxa: 5,
    },
  ]);
};
