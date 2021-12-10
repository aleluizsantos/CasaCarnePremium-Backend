const connection = require("../../database/connection");

module.exports = {
  /**
   * Checar a taxa de entrega do pedido e retorna um objeto, contendo a taxa e
   * tempo de entrega.
   * @param {number} typeDelivery_id Infomar o id do tipo de entrega
   * @param {number} totalPur Informar o total do pedido
   * @returns {Object} { taxa: number, averageTime: string }
   */
  async checkTaxaDelivery(typeDelivery_id, totalPur) {
    const { hasTaxa, averageTime } = await getTypeDelivery(typeDelivery_id);
    // Checar se o entrega possui taxa
    if (!hasTaxa)
      return { taxa: Number.parseFloat(0), averageTime: averageTime };
    // Caso possuir taxa, buscar dados da taxa
    const { vMinTaxa, taxa } = await getTaxaDelivery();
    // Caso não foi definido um valor mínimo cobrar a taxa
    if (vMinTaxa <= 0)
      return { taxa: Number.parseFloat(taxa), averageTime: averageTime };
    // Quaso tenha um valor mínimo, checar se o seu pedido é maior que o mínimo
    if (totalPur >= vMinTaxa) {
      // Pedido superior ao mínimo - Entrega GRATIS
      return { taxa: Number.parseFloat(0), averageTime: averageTime };
    } else {
      // Pedido inferior ao mínimo - cobrar TAXA de entrega
      return { taxa: Number.parseFloat(taxa), averageTime: averageTime };
    }
  },

  /**
   * Retorna a taxa de Delivery a ser cobrado
   * @returns {object} { vMinTaxa, taxa }
   */
  async getTaxaDeliveryAsync() {
    return await getTaxaDelivery();
  },

  /**
   * Retorna um objeto contento o tipo de Delivery
   * @param {number} typeDelivery_id Informe o id do tipo de delivery
   * @returns {object} { description, hasTaxa, averageTime  }
   */
  async getTypeDeliveryAsync(typeDelivery_id) {
    return await getTypeDelivery(typeDelivery_id);
  },
};

// Buscar todos os dados do tipo de delivery passado
async function getTypeDelivery(typeDelivery_id) {
  const { description, hasTaxa, averageTime } = await connection("deliveryType")
    .where("id", "=", typeDelivery_id)
    .first();
  return { description, hasTaxa, averageTime };
}

// Buscar no bando de dados o Valor da taxa e o valor mínimo de um pedido
async function getTaxaDelivery() {
  const { vMinTaxa, taxa } = await connection("taxaDelivery").first();
  return { vMinTaxa, taxa };
}
