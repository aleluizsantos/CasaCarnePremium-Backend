const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const { ValidationCoupon } = require("../utils/validationCupon");

const router = express.Router();

router.use(authMiddleware);

// Listar todos os pedidos especifico de um usuário
// http://dominio/request
router.get("/", async (req, res) => {
  const user_id = req.userId; //Id do usuário recebido no token;
  const { statusrequest } = req.headers; //Recebendo um STRING de Status de Pedido

  // Verificar os parametros
  if (!!!statusrequest)
    return res.json({ Message: "Falta do parametro 'statusRequest'" });

  // Convertendo a String em um ARRAY
  const statusRequest = statusrequest.split(",").map((req) => req.trim());

  // Identificar o tipo do usuário
  const user = await connection("users")
    .where("id", "=", user_id)
    .first()
    .select("id", "name", "email", "phone", "typeUser");

  //Verificando o tipo de usuário é ADMIN
  if (user.typeUser === "admin") {
    //Listagem para usuário administrador
    const request = await connection("request")
      .whereIn("statusRequest_id", statusRequest)
      .join("users", "request.user_id", "users.id")
      .join("deliveryType", "request.deliveryType_id", "deliveryType.id")
      .join("statusRequest", "request.statusRequest_id", "statusRequest.id")
      .join("payment", "request.payment_id", "payment.id")
      .select(
        "request.*",
        "users.name",
        "users.email",
        "users.phone",
        "deliveryType.description As deliveryType",
        "statusRequest.description As statusRequest",
        "statusRequest.BGcolor",
        "payment.type As payment"
      )
      .orderBy("request.dateTimeOrder", "desc");

    return res.json(request);
  } else {
    //Listagem para usuário comum - APENAS PEDIDO DELE
    const request = await connection("request")
      .where("user_id", "=", user_id)
      .whereIn("statusRequest_id", statusRequest)
      .join("deliveryType", "request.deliveryType_id", "deliveryType.id")
      .join("statusRequest", "request.statusRequest_id", "statusRequest.id")
      .join("payment", "request.payment_id", "payment.id")
      .select(
        "request.*",
        "deliveryType.description As deliveryType",
        "statusRequest.description As statusRequest",
        "statusRequest.BGcolor",
        "payment.type As payment"
      )
      .orderBy("request.id", "desc");

    return res.json(request);
  }
});
// Criar um pedido
// http://dominio/request
router.post("/create", async (req, res) => {
  const user_id = req.userId; //Id do usuário recebido no token;

  // Dados recebidos na requisição no body
  const {
    deliveryType_id, // recebendo o id do tipo de entrega
    statusRequest_id = 1, //Status do pedido inicia como 1 'EM ANALISE'
    payment_id, // recebendo o id do tipo de pagamento
    coupon, //recebendo o cupom se tiver
    note,
    address,
    number,
    neighborhood,
    city,
    uf,
    PointReferences,
    scheduleDateTime,
    items, //recebendo um ARRAY de objetos de items do pedido
  } = req.body;

  // Iniciado o desconto com zero, alterado se o cliente passou um cupom valido com desconto
  let discount = 0;
  try {
    // Verificar no banco de dados se os valor dos item estão corretos
    // se não houve manipulação do frontend para backend
    const dataItems = await Promise.all(
      items.map(async (item) => {
        const dataPrice = await connection("product")
          .where("id", "=", item.product_id)
          .first()
          .select("price", "promotion", "pricePromotion");

        // Verificação se o produto encontra na promoção
        const priceProduct = dataPrice.promotion
          ? dataPrice.pricePromotion
          : dataPrice.price;

        return {
          amount: Number(item.amount),
          product_id: Number(item.product_id),
          price: priceProduct,
        };
      })
    );

    // Calcular o total do carrinho
    const totalPur = await dataItems.reduce(function (total, item) {
      return total + Number(item.amount) * Number(item.price);
    }, 0);

    // Checando a taxa de entrega
    const { vMinTaxa, taxa } = await connection("taxaDelivery").first();
    // Checar se o total gasto é maior ou igual a taxa minima de entrega
    const vTaxaDelivery = totalPur >= vMinTaxa ? 0 : parseFloat(taxa);

    //Verificação do cupom, autenticidade e validade
    if (coupon !== "") {
      const vcoupon = await ValidationCoupon(coupon, payment_id);
      if (vcoupon.Success)
        discount = Number(vcoupon.Coupon.discountAmount) / 100;
    }

    // montar os dados do pedido para ser inseridos
    const request = {
      dateTimeOrder: new Date(),
      totalPurchase: vTaxaDelivery + totalPur - totalPur * discount,
      vTaxaDelivery: vTaxaDelivery,
      coupon,
      discount,
      note,
      address,
      number,
      neighborhood,
      city,
      uf,
      PointReferences,
      scheduleDateTime: !!scheduleDateTime ? scheduleDateTime : null,
      user_id: Number(user_id),
      deliveryType_id: Number(deliveryType_id),
      statusRequest_id: Number(statusRequest_id),
      payment_id: Number(payment_id),
    };

    const trx = await connection.transaction();
    //Inserir o pedido
    const insertReq = await trx("request").insert(request, "id");
    // Capturar o id de do pedido que acabou de ser inserido
    const request_id = insertReq[0];
    // montar os dados do itens do pedido para ser inseridos
    const itemsRequest = dataItems.map((item) => {
      return {
        amount: Number(item.amount),
        price: Number(item.price),
        product_id: Number(item.product_id),
        request_id: Number(request_id),
      };
    });

    // Atualizar o estoque do produto
    upgradeStoreProduct(dataItems);

    //Inserir os items do pedido
    await trx("itemsRequets").insert(itemsRequest);
    // Efetivar a gravação se tudo ocorrer com sucesso na inserção do pedido e
    // dos itens casos contrário desfaça tudo
    await trx.commit();
    // contar todos os pedidos em anlise
    const ordersAnalize = await connection("request")
      .count("statusRequest_id as countReq")
      .where("statusRequest_id", "=", 1)
      .first();
    // emitir aviso que foi creado um no Pedido
    // retornando a quantidade de pedidos em analise
    req.io.emit("CreateOrder", {
      newOrder: ordersAnalize,
    });
    // Retorna o Pedido e os itens
    return res.json({ request, itemsRequest });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// Listar itens de um pedido
// http://dominio/request/items
router.get("/items", async (req, res) => {
  const { request_id } = req.headers; //Id do pedido;

  if (!!!request_id)
    return res.json({ Message: "Falta do parametro HEADERS -> 'Request_id'" });

  const itemsRequest = await connection("itemsRequets")
    .where("request_id", "=", request_id)
    .join("product", "itemsRequets.product_id", "product.id")
    .join("measureUnid", "product.measureUnid_id", "measureUnid.id")
    .select(
      "itemsRequets.*",
      "product.name",
      "measureUnid.unid as measureUnid"
    );

  return res.json(itemsRequest);
});
// Alterar Status de um Pedido pedido
// http://dominio/request/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const subQuery = connection("request").select("*").where("id", "=", id);

  subQuery
    .then((response) => {
      if (response.length > 0) {
        let nextActionRequest;
        let descriptionNextActionRequest;
        // Alteração do STATUS
        switch (response[0].statusRequest_id) {
          // Produto Status 'EM ANALISE'
          case 1:
            nextActionRequest = 2; // status 'EM PREPARAÇÃO'
            descriptionNextActionRequest = "Em Preparação";
            break;
          // Pedido em Preparação
          case 2:
            // 1=DELIVERY || 2=RETIRAR LOJA
            if (response[0].deliveryType_id === 1) {
              // DELIVERY
              nextActionRequest = 3; // status 'ROTA DE ENTREGA'
              descriptionNextActionRequest = "Rota de Entrega";
            } else {
              // RETIRAR NA LOJA
              nextActionRequest = 4; // status 'RETIRAR NA LOJA'
              descriptionNextActionRequest = "Retirar na Loja";
            }
            break;
          // Entrega Realizada
          case 3:
            nextActionRequest = 6; // status 'FINALIADO' - entrega concluída
            descriptionNextActionRequest = "Finalizado";
            break;
          // Retirada Realizada
          case 4:
            nextActionRequest = 6; // status 'FINALIADO' - Retirada concluída
            descriptionNextActionRequest = "Finalizado";
            break;
          default:
            break;
        }
        subQuery
          .update({ statusRequest_id: nextActionRequest })
          .then((resp) => {
            req.io.emit("Update", { update: resp + Date.now() });
            res.json({
              success: resp,
              nextState: nextActionRequest,
              descriptionNextActionRequest: descriptionNextActionRequest,
            });
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        res.json("update failed");
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/group", async (req, res) => {
  try {
    const statusRequest = await connection("request")
      .groupBy("statusRequest_id", "statusRequest.description")
      .count("statusRequest_id as TotalStatus")
      .join("statusRequest", "request.statusRequest_id", "statusRequest.id")
      .select("request.statusRequest_id", "statusRequest.description");
    return res.status(200).json(statusRequest);
  } catch (error) {
    return res.status(500).json({ error: "Erro no servidor." });
  }
});

//Excluir um pedido
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Excluir todos os items do pedidos
    await connection("itemsRequets").where("request_id", "=", id).delete();
    // Excluir o pedido
    const myOrder = await connection("request").where("id", "=", id).delete();
    return res.json({ success: !!myOrder });
  } catch (error) {
    return res.json(error.message);
  }
});
//Excluir um item do pedido
router.delete("/item/:id", async (req, res) => {
  const { id } = req.params; //id do item para ser excluido
  const { request_id } = req.headers; //id do pedido

  try {
    // Exluir o item do pedido
    const isDelete = await connection("itemsRequets")
      .where("id", "=", id)
      .where("request_id", "=", request_id)
      .delete();

    if (!!isDelete) {
      // Recalcular o totla do pedido apos o item excluido
      const itemsRequest = await connection("itemsRequets")
        .where("request_id", "=", request_id)
        .select("*");

      // Calcular o total do carrinho
      const totalPur = await itemsRequest.reduce(function (total, item) {
        return total + Number(item.amount) * Number(item.price);
      }, 0);

      // Checando a taxa de entrega
      const { vMinTaxa, taxa } = await connection("taxaDelivery").first();
      // Checar se o total gasto é maior ou igual a taxa minima de entrega
      const vTaxaDelivery = totalPur >= vMinTaxa ? 0 : parseFloat(taxa);

      // Buscar todos os dados do pedido
      const orders = await connection("request")
        .where("id", "=", request_id)
        .first();

      // Alterar os dados necessário do pedido apos exclusão do item
      const data = {
        ...orders,
        totalPurchase:
          totalPur + vTaxaDelivery - totalPur * Number(orders.discount),
        vTaxaDelivery: vTaxaDelivery,
      };

      // Atualizar o pedido com o novo valor
      await connection("request").where("id", "=", request_id).update(data);
      return res.json(data);
    } else {
      return res.json({
        error:
          "Você não tem permissão para excluir este item ou o item não existe.",
      });
    }
  } catch (error) {
    return res.json({ error: error.message });
  }
});
//Criar item do pedido
router.post("/item", async (req, res) => {
  const { amount, price, product_id, request_id } = req.body;

  const newItemRequest = {
    amount: Number(amount),
    price: Number(price),
    product_id: Number(product_id),
    request_id: Number(request_id),
  };

  // Inserir o novo item
  await connection("itemsRequets").insert(newItemRequest);

  // Recalcular o totla do pedido apos o item excluido
  const itemsRequest = await connection("itemsRequets")
    .where("request_id", "=", request_id)
    .join("product", "itemsRequets.product_id", "product.id")
    .join("measureUnid", "product.measureUnid_id", "measureUnid.id")
    .select(
      "itemsRequets.*",
      "product.name",
      "measureUnid.unid as measureUnid"
    );

  // Calcular o total do carrinho
  const totalPur = await itemsRequest.reduce(function (total, item) {
    return total + Number(item.amount) * Number(item.price);
  }, 0);

  // Checando a taxa de entrega
  const { vMinTaxa, taxa } = await connection("taxaDelivery").first();
  // Checar se o total gasto é maior ou igual a taxa minima de entrega
  const vTaxaDelivery = totalPur >= vMinTaxa ? 0 : parseFloat(taxa);

  // Buscar todos os dados do pedido
  const orders = await connection("request")
    .where("id", "=", request_id)
    .first();

  // Alterar os dados necessário do pedido apos exclusão do item
  const data = {
    ...orders,
    totalPurchase:
      totalPur + vTaxaDelivery - totalPur * Number(orders.discount),
    vTaxaDelivery: vTaxaDelivery,
  };

  // Atualizar o pedido com o novo valor
  await connection("request").where("id", "=", request_id).update(data);

  return res.json({ order: data, items: itemsRequest });
});

function upgradeStoreProduct(itemsOrder) {
  itemsOrder.map(async (item) => {
    const product = await connection("product")
      .where("id", "=", item.product_id)
      .first();

    const newStoreProduct = {
      ...product,
      inventory: Number(product.inventory) - Number(item.amount),
    };

    await connection("product")
      .where("id", "=", item.product_id)
      .update(newStoreProduct);
  });
}

module.exports = (app) => app.use("/request", router);
