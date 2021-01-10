exports.seed = async function (knex) {
    await knex("addressStore").insert([
        {
            cep: "15707-170",
            address: "Rua Jorge Amado",
            number: "177",
            neighborhood: "Jd. Arapuã",
            city: "Jales",
            uf: "SP",
            phone: '1736322702',
            latitude: '-20.254520',
            longitude: '-50.550585',
            active: true
        }        
    ]);
}