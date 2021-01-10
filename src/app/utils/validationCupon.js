const connection = require("../../database/connection");

module.exports = {
  // Verificação se o cupom é valido se esta no prazo de validade e seu
  // respectiovos tipos de pagamento
  async ValidationCoupon(coupon, payment) {
    const Coupon = await connection("coupon").where("number", coupon).first();
    // Verificação se o cupom existe
    if (Coupon === undefined)
      return { Success: false, Message: "Cupom inválido" };
    // Verificar a data de validade do cupom
    const now = new Date();
    if (now > Coupon.dataExpireCoupon)
      return { Success: false, Message: "Data de validade do cupom expirada" };
    // Verificar para qual tipo de pagamento o Cupom é valido
    // Converter a string em um ARRAY
    const parsedPayment = String(Coupon.paymentType)
      .split(",")
      .map((paymentType) => Number(paymentType.trim()));

    if (parsedPayment.indexOf(Number(payment)) < 0)
      return {
        Success: false,
        Message: "Cupom inválido para este tipo de pagamento",
      };
    // Verificar se a quantidade de cupom já foi toda utilizada
    const AmoutCoupon = await connection("request")
      .where("coupon", coupon)
      .select("*");

    // Comparar as quantidades
    if (AmoutCoupon.length > Coupon.amount)
      return {
        Success: false,
        Message: "Cupom já utilizados",
      };

    return { Success: true, Coupon };
  },
  // Gerar um código de cupom
  async GenerateCoupon() {
    const letras = "123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    let coupon = "";
    for (var i = 0; i < 8; i++) {
      var rnum = Math.floor(Math.random() * letras.length);
      coupon += letras.substring(rnum, rnum + 1);
    }
    return coupon;
  },
};
