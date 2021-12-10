exports.seed = async function (knex) {
  await knex("addressStore").insert([
    {
      cep: "15707-160",
      address: "Rua Jorge Amado",
      number: "3286",
      neighborhood: "Centro",
      city: "Jales",
      uf: "SP",
      phone: "17 99663-4236",
      latitude: "-20.2553814",
      longitude: "-50.5529795",
      active: true,
    },
  ]);
};
