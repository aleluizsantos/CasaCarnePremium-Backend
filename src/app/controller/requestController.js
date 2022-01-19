const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const { validationCoupon } = require("../utils/validationCupon");
const { pushNotificationUser } = require("../utils/pushNotification");
const { checkTaxaDelivery } = require("../utils/taxaDelivery");

const router = express.Router();

router.use(authMiddleware);

// Listar itens de um pedido
// http://dominio/request/items
router.get("/items/:id", async (req, res) => {
  const { id } = req.params; //Id do pedido;

  if (!Boolean(id))
    return res.json({ error: "Falta do parametro 'id' do pedido" });

  // Buscar a taxa de delivery
  const taxaDelivery = await connection("taxaDelivery").select("*").first();
  // Buscar todos os items do pedidos
  const itemsRequest = await connection("itemsRequets")
    .where("request_id", "=", id)
    .join("product", "itemsRequets.product_id", "product.id")
    .join("measureUnid", "product.measureUnid_id", "measureUnid.id")
    .select(
      "itemsRequets.*",
      "product.name",
      "measureUnid.unid as measureUnid"
    );

  // Buscar todos os adicionais do pedido
  const additionalItemOrder = await connection("additionalItemOrder")
    .where("request_id", "=", id)
    .join("additional", "additionalItemOrder.additional_id", "additional.id")
    .select(
      "additionalItemOrder.*",
      "additional.description",
      "additional.price"
    );

  // Juntar os items do pedido com os adicionais
  const itemsWithAdditional = itemsRequest.map((item) => {
    const addit = additionalItemOrder.filter(
      (additItem) => additItem.itemOrder_id === item.id
    );
    return {
      ...item,
      additional: addit,
    };
  });

  const dataItemRequest = {
    itemsRequest: itemsWithAdditional,
    taxaDelivery: taxaDelivery,
  };

  return res.json(dataItemRequest);
});
// Lista todos tipos de status de pedido, e informa quantos pedidos tem
// neste status
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
        "payment.type As payment",
        "payment.image as imgTypePayment"
      )
      .orderBy("request.dateTimeOrder", "desc");

    const serialezeOrder = request.map((order) => {
      return {
        ...order,
        imgTypePayment: `${process.env.HOST}/uploads/${order.imgTypePayment}`,
      };
    });

    return res.json(serialezeOrder);
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
        "payment.type As payment",
        "payment.image as imgTypePayment"
      )
      .orderBy("request.id", "desc");

    return res.json(request);
  }
});
// Criar um pedido
// http://dominio/request
router.post("/create", async (req, res) => {
  const dataCurrent = new Date(); //Data atual
  const user_id = req.userId; //Id do usuário recebido no token;

  // Dados recebidos na requisição no body
  const {
    deliveryType_id, // Tipo de entrega 1=Delivery 2=Retirada Loja
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
    cash, //Troco
    timeDelivery,
    items, //recebendo um ARRAY de objetos de items do pedido e addicionais
  } = req.body;

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
          note: item.note,
        };
      })
    );

    // Calcular o total do carrinho
    let totalPur = await dataItems.reduce(function (total, item) {
      return total + Number(item.amount) * Number(item.price);
    }, 0);

    let vDiscount = 0;

    // Verificação do cupom, autenticidade e validade
    if (coupon !== "") {
      const vcoupon = await validationCoupon(coupon);
      vDiscount = vcoupon.error ? 0 : Number(vcoupon.discountAmount);
    }

    // Converter a string que contém o itens adicionais
    const itemsAdditional = items.map((item) => item.additionItem.split(","));

    // Converter a String do additional em apenas um array
    const listIdAdditional = itemsAdditional
      .toString()
      .split(",")
      .map((item) => Number(item));

    // Somar todos os adicionais escolhido pelo usuário
    const totalAdditional = await connection("additional")
      .whereIn("id", listIdAdditional)
      .sum("price as total")
      .first();

    // Acrescentar o total dos adicionais
    totalPur += Number(totalAdditional.total);

    // Checando a taxa de entrega e o tempo médio
    const { taxa, averageTime } = await checkTaxaDelivery(
      deliveryType_id,
      totalPur
    );

    // Montar os dados do pedido para ser inseridos
    const request = {
      dateTimeOrder: dataCurrent,
      totalPurchase: taxa + totalPur - vDiscount,
      vTaxaDelivery: taxa,
      coupon,
      discount: vDiscount,
      note,
      address,
      number,
      neighborhood,
      city,
      uf,
      PointReferences,
      user_id: Number(user_id),
      deliveryType_id: Number(deliveryType_id),
      statusRequest_id: Number(statusRequest_id),
      payment_id: Number(payment_id),
      cash: cash || 0,
      timeDelivery: timeDelivery || averageTime,
    };

    const trx = await connection.transaction();

    // Inserir o pedido
    const insertReq = await trx("request").insert(request, "id");
    // Capturar o id de do pedido que acabou de ser inserido
    const request_id = insertReq[0];
    // Montar os dados do itens do pedido para ser inseridos
    const itemsRequest = dataItems.map((item) => {
      return {
        amount: Number(item.amount),
        price: Number(item.price),
        note: item.note,
        product_id: Number(item.product_id),
        request_id: Number(request_id),
      };
    });

    // Inserir os items do pedido retornando todos os id dos items
    const idItemsInsert = await trx("itemsRequets").insert(itemsRequest, "id");

    // Criar um array vazio para ser inserido os itens adicionais para serem inseridos
    let insertItemAddicional = [];

    // Para cada itens inserido, inserir o addicionais no banco
    idItemsInsert.map((item, idx) => {
      for (let i = idx; i <= idx; i++) {
        const element = itemsAdditional[i];
        element.forEach((itemAddit) => {
          if (itemAddit !== "") {
            insertItemAddicional.push({
              itemOrder_id: item,
              additional_id: itemAddit,
              request_id: Number(request_id),
            });
          }
        });
      }
    });

    // Inserir os adicionais de cada item
    await trx("additionalItemOrder").insert(insertItemAddicional);

    // Efetivar a gravação se tudo ocorrer com sucesso na inserção do pedido e
    // dos itens casos contrário desfaça tudo
    await trx.commit();

    // Contar todos os pedidos em anlise
    const ordersAnalize = await connection("request")
      .count("statusRequest_id as countReq")
      .where("statusRequest_id", "=", 1)
      .first();

    // Emitir aviso que foi criado um no Pedido
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
  // Calcular o novo valor do pedido após incluir um item
  const result = await calcMyOrder(request_id);
  // Atualizar o pedido com o novo valor
  await connection("request")
    .where("id", "=", request_id)
    .update(result.dataOrder);
  // Retornar o pedido completo
  return res.json(result);
});
// Alterar quantidade dos itens do pedido após a preparação
router.put("/itemChanger", async (req, res) => {
  let changerAmount = false;

  const { myOrder, items } = req.body;

  try {
    // Buscar todos os item do pedido
    const itemOrderCurrent = await connection("itemsRequets")
      .where("request_id", "=", myOrder.id)
      .select("*");

    // Percorrer todo array da Tabela itemPedido checando se houve alteração na quantidade
    itemOrderCurrent.forEach(async (itemCurrent) => {
      const changeItem = items.find(
        (itemChange) => itemChange.product_id === itemCurrent.product_id
      );
      if (Number(itemCurrent.amount) !== Number(changeItem.amount)) {
        changerAmount = true;
        //Atualizar com a nova quantidade na tabela item do pedido
        await connection("itemsRequets")
          .where("id", "=", itemCurrent.id)
          .update({ amount: changeItem.amount });
      }
    });

    // Calcular o novo valor do pedido após incluir um item
    const result = await calcMyOrder(myOrder.id);

    // Altarar a Tabela pedido 'request'
    await connection("request")
      .where("id", "=", myOrder.id)
      .update(result.dataOrder);

    // Checar se houve alteraçaõ na quantidade notificar cliente
    if (changerAmount)
      pushNotificationUser(
        myOrder.user_id,
        "Produtos pesados, confira o valor e a pesagem em seu app."
      );

    return res.status(200).json(result.dataOrder);
  } catch (error) {
    console.log(error.message);
    return res.json({ error: error.message });
  }
});
// Alterar Status de um Pedido pedido
// http://dominio/request/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const request = await connection("request")
    .where("id", "=", id)
    .select("*")
    .first();

  if (typeof request === "undefined")
    return res.json({ error: "Falha na atualização" });

  const statusRequest = request.statusRequest_id;
  const typeDelivery = request.deliveryType_id;
  const user_id = request.user_id;

  let nextActionRequest;
  let descriptionNextActionRequest;
  let message;
  // Alteração do STATUS
  switch (statusRequest) {
    // Produto Status 'EM ANALISE'
    case 1:
      nextActionRequest = 2; // status 'EM PREPARAÇÃO'
      descriptionNextActionRequest = "Em Preparação";
      message = "Pedido recebido em fila de preparação.";
      break;
    // Pedido em Preparação
    case 2:
      // 1=DELIVERY || 2=RETIRAR LOJA
      if (typeDelivery === 1) {
        // DELIVERY
        nextActionRequest = 3; // status 'ROTA DE ENTREGA'
        descriptionNextActionRequest = "Rota de Entrega";
        message = "Seu pedido está em rota de entrega.";
      } else {
        // RETIRAR NA LOJA
        nextActionRequest = 4; // status 'RETIRAR NA LOJA'
        descriptionNextActionRequest = "Retirar na Loja";
        message = "Pedido pronto para ser retirado na loja.";
      }
      break;
    // Entrega Realizada
    case 3:
      nextActionRequest = 6; // status 'FINALIADO' - entrega concluída
      descriptionNextActionRequest = "Finalizado";
      message = "Pedido Finalizado, obrigado pela preferência.";
      break;
    // Retirada Realizada
    case 4:
      nextActionRequest = 6; // status 'FINALIADO' - Retirada concluída
      descriptionNextActionRequest = "Finalizado";
      message = "Pedido Finalizado, obrigado pela preferência.";
      break;
    default:
      break;
  }

  // Atualizar o status do pedido
  const upgradeRequest = await connection("request")
    .where("id", "=", id)
    .update({
      ...request,
      statusRequest_id: nextActionRequest,
    });

  // Enviar pushNotification  par ao usuário
  pushNotificationUser(user_id, message);
  // Enviar notificação via socket-io
  req.io.emit("Update", { update: Date.now(), userId: user_id });

  return res.status(200).json({
    success: Boolean(upgradeRequest),
    success: true,
    user_id: user_id,
    nextState: nextActionRequest,
    descriptionNextActionRequest: descriptionNextActionRequest,
  });
});
// Excluir um item do pedido
router.delete("/delete/item/:requestId/:itemId", async (req, res) => {
  const { requestId, itemId } = req.params;

  try {
    // Exluir o item do pedido
    await connection("itemsRequets")
      .where("id", "=", itemId)
      .where("request_id", "=", requestId)
      .delete();

    // Calcular o nova valor do pedido e retorna o pedido completo
    const result = await calcMyOrder(requestId);

    // Atualizar o pedido com o novo valor após excluir o item
    await connection("request")
      .where("id", "=", requestId)
      .update(result.dataOrder);

    return res.json(result);
  } catch (error) {
    return res.json({ error: error.message });
  }
});
// Excluir um pedido
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Excluir o pedido
    const isDelete = await connection("request").where("id", "=", id).delete();

    return res.json({ success: Boolean(isDelete) });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
//Calcular o valor do pedido
async function calcMyOrder(request_id) {
  let grandTotal = 0;
  let totalPurchase = 0;
  let totalAdditional = 0;
  let vTaxaDelivery = 0;
  let vDiscount = 0;

  // Buscar todos os dados do Pedido
  const order = await connection("request")
    .where("id", "=", request_id)
    .first();

  //Verificação do cupom, autenticidade e validade
  if (order.coupon) {
    const coupon = await validationCoupon(order.coupon);
    // Se possui um coupon válido setar o valor senão seta ZERO
    vDiscount = coupon.error ? 0 : Number(coupon.discountAmount);
  }

  // Buscar Valor minimo do pedido e o valor da Taxa de entrega
  const { vMinTaxa, taxa } = await connection("taxaDelivery").first();

  // Buscar todos os item do pedido
  const itemsMyOrder = await connection("itemsRequets")
    .where("request_id", "=", request_id)
    .join("product", "itemsRequets.product_id", "product.id")
    .join("measureUnid", "product.measureUnid_id", "measureUnid.id")
    .select(
      "itemsRequets.*",
      "product.name",
      "measureUnid.unid as measureUnid"
    );
  // Buscar todos os addicionais do pedido
  const additionalItem = await connection("additionalItemOrder")
    .where("request_id", "=", request_id)
    .join("additional", "additionalItemOrder.additional_id", "additional.id")
    .select(
      "additionalItemOrder.*",
      "additional.description",
      "additional.price"
    );
  // Juntar os adicionais com seus respectivos items do pedido
  const joinData = itemsMyOrder.map((item) => {
    const addit = additionalItem.filter(
      (addit) => addit.itemOrder_id === item.id
    );
    return { ...item, additional: addit };
  });

  // Calcular o valor do pedido
  joinData.forEach((element) => {
    totalPurchase += element.amount * element.price;
    totalAdditional += element.additional.reduce(
      (total, item) => total + element.amount * Number(item.price),
      0
    );
  });

  // Checar se o total gasto é maior ou igual a taxa minima de entrega
  vTaxaDelivery =
    totalPurchase + totalAdditional >= vMinTaxa ? 0 : parseFloat(taxa);

  // Somando total Geral do pedido
  grandTotal = totalPurchase + totalAdditional + vTaxaDelivery - vDiscount;

  // Atualizar o TotalPurchase e o VTaxaDelivery após a alteração de um item
  const dataOrder = {
    ...order,
    totalPurchase: grandTotal,
    vTaxaDelivery,
    discount: vDiscount,
  };

  return {
    dataOrder,
    items: joinData,
    grandTotal,
    totalPurchase,
    totalAdditional,
    vTaxaDelivery,
    vDiscount,
  };
}

module.exports = (app) => app.use("/request", router);
