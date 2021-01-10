exports.seed = async function (knex) {
  await knex("statusRequest").insert([
    { description: "Em Analise", BGcolor: "#0AF405" },
    { description: "Em Preparação", BGcolor: "#05C9F4" },
    { description: "Rota entrega", BGcolor: "#0548F4" },
    { description: "Retirada Loja", BGcolor: "#7D05F4" },
    { description: "Agendado", BGcolor: "#F005F4" },
    { description: "Finalizado", BGcolor: "#F4A305" },
  ]);
};
