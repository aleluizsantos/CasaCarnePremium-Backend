exports.seed = async function (knex) {
  await knex("product").insert([
    {
      name: "Acém",
      description: "Carne bovina",
      price: 30,
      image: "acem.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Cupim",
      description: "Carne bovina",
      price: 30,
      image: "cupim.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Alcatra",
      description: "Carne bovina",
      price: 30,
      image: "alcatra.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Carne moída",
      description: "Carne bovina",
      price: 30,
      image: "carnemoida.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Carne seca",
      description: "Carne bovina",
      price: 30,
      image: "carneseca.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Contra filé",
      description: "Carne bovina",
      price: 30,
      image: "contrafile.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Coxão duro",
      description: "Carne bovina",
      price: 30,
      image: "coxaoduro.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Coxão mole",
      description: "Carne bovina",
      price: 30,
      image: "coxaomole.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Figado",
      description: "Carne bovina",
      price: 30,
      image: "figado.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Filé mignon",
      description: "Carne bovina",
      price: 30,
      image: "filemignon.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Fraldinha",
      description: "Carne bovina",
      price: 30,
      image: "fraldrinha.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Maminha",
      description: "Carne bovina",
      price: 30,
      image: "maminha.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Paleta",
      description: "Carne bovina",
      price: 30,
      image: "paleta.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Patinho",
      description: "Carne bovina",
      price: 30,
      image: "patinho.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Picanha",
      description: "Carne bovina",
      price: 30,
      image: "picanha.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 1,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },

    {
      name: "Bisteca",
      description: "Carne Suína",
      price: 30,
      image: "bistecasuina.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 2,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Carré",
      description: "Carne Suína",
      price: 30,
      image: "carre.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 2,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Costela suína",
      description: "Carne Suína",
      price: 30,
      image: "costelasuina.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 2,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Lombo",
      description: "Carne Suína",
      price: 30,
      image: "lombo.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 2,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Paio",
      description: "Carne Suína",
      price: 30,
      image: "paio.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 2,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Pé de suíno",
      description: "Carne Suína",
      price: 30,
      image: "pesuino.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 2,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Pernil suíno",
      description: "Carne Suína",
      price: 30,
      image: "pernilsuino.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 2,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Rabo suíno",
      description: "Carne Suína",
      price: 30,
      image: "rabosuino.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 2,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },

    {
      name: "Asa frango",
      description: "Carne de ave",
      price: 30,
      image: "asafrango.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 4,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Coração frango",
      description: "Carne de ave",
      price: 30,
      image: "coracaofrango.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 4,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Coxa com sobrecoxa",
      description: "Carne de ave",
      price: 30,
      image: "coxacomsobrecoxa.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 4,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Coxinha da asa",
      description: "Carne de ave",
      price: 30,
      image: "coxinhaasa.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 4,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Filé de frango",
      description: "Carne de ave",
      price: 30,
      image: "filefrango.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 4,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Frango inteiro",
      description: "Carne de ave",
      price: 30,
      image: "fileinteiro.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 4,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Peito de frango",
      description: "Carne de ave",
      price: 30,
      image: "peitofrango.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 4,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },

    {
      name: "Cuiabana",
      description: "Linguiças",
      price: 30,
      image: "cuiabana.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 5,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Toscana",
      description: "Linguiças",
      price: 30,
      image: "toscana.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 5,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Linguiça Mista",
      description: "Linguiças",
      price: 30,
      image: "linguicamista.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 5,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Linguiça Frango",
      description: "Linguiças",
      price: 30,
      image: "linguicafrango.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 5,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Linguiça legumes",
      description: "Linguiças",
      price: 30,
      image: "linguicalegumes.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 5,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Linguiça calabresa",
      description: "Linguiças",
      price: 30,
      image: "linguicacalabresa.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 5,
      measureUnid_id: 35,
      visibleApp: true,
      inventory: 100,
    },

    {
      name: "Pão de alho",
      description: "Churrasco",
      price: 30,
      image: "paoalho.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 7,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Carvão Boa Brasa 5kg",
      description: "Churrasco",
      price: 30,
      image: "carvao5kg.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 7,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Carvão Boa Brasa 10kg",
      description: "Churrasco",
      price: 30,
      image: "carvao10kg.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 7,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Farofa pronta Kodilar 500g",
      description: "Churrasco",
      price: 30,
      image: "farofakodilar.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 7,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Farofa caseira 500g",
      description: "Churrasco",
      price: 30,
      image: "farofacaseira.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 7,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Tempero pronto 300g",
      description: "Churrasco",
      price: 30,
      image: "farofacaseira.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 7,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },

    {
      name: "Pernil carneiro",
      description: "Carneiro",
      price: 30,
      image: "pernilcarneiro.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 3,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Paleta carneiro",
      description: "Carneiro",
      price: 30,
      image: "paletacarneiro.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 3,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Lombo carneiro",
      description: "Carneiro",
      price: 30,
      image: "lombocarneiro.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 3,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Carré carneiro",
      description: "Carneiro",
      price: 30,
      image: "carrecarneiro.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 3,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Costelinha carneiro",
      description: "Carneiro",
      price: 30,
      image: "costelinhacarneiro.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 3,
      measureUnid_id: 45,
      visibleApp: true,
      inventory: 100,
    },

    {
      name: "Coca Cola 1l",
      description: "Bebidas",
      price: 30,
      image: "cocacola1l.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 32,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Coca Cola Pet 2l",
      description: "Bebidas",
      price: 30,
      image: "cocacola2l.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 32,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Coca Cola Pet 2l Zero",
      description: "Bebidas",
      price: 30,
      image: "cocacola1lzero.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 32,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Cotuba Pet 2l",
      description: "Bebidas",
      price: 30,
      image: "cotuba2l.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 32,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Sprite Pet 2l",
      description: "Bebidas",
      price: 30,
      image: "sprite2l.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 32,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Kuat Pet 2l",
      description: "Bebidas",
      price: 30,
      image: "kuat2l.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 32,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Coca Cola lata 350ml",
      description: "Bebidas",
      price: 30,
      image: "cocacolalata350.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 37,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Sprite lata 350ml",
      description: "Bebidas",
      price: 30,
      image: "spritelata350.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 37,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Skol lata 350ml",
      description: "Bebidas",
      price: 30,
      image: "skollata350.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 37,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Skol latão 473ml",
      description: "Bebidas",
      price: 30,
      image: "skollatao473.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 37,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Brahma lata 350ml",
      description: "Bebidas",
      price: 30,
      image: "brahma350.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 37,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Bohemia lata 350ml",
      description: "Bebidas",
      price: 30,
      image: "hohemia350.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 37,
      visibleApp: true,
      inventory: 100,
    },
    {
      name: "Crystal lata 350ml",
      description: "Bebidas",
      price: 30,
      image: "crystal350.png",
      promotion: false,
      pricePromotion: 0,
      category_id: 8,
      measureUnid_id: 37,
      visibleApp: true,
      inventory: 100,
    },
  ]);
};
