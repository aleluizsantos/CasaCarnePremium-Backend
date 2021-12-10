const connection = require("../../database/connection");

module.exports = {
  // Verificação se o cupom é valido se esta no prazo de validade e seu
  // respectiovos tipos de pagamento
  async validationCoupon(coupon) {
    const Coupon = await connection("coupon")
      .where("number", "=", coupon)
      .first();

    // Verificação se o cupom existe
    if (Coupon === undefined) return { error: "Cupom inválido" };
    // Verificar a data de validade do cupom
    const now = new Date();
    if (now > Coupon.dataExpireCoupon)
      return { error: "Data de validade do cupom expirada" };

    // Verificar se a quantidade de cupom já foi toda utilizada
    const AmoutCoupon = await connection("request")
      .where("coupon", "=", coupon)
      .select("*");

    // Comparar as quantidades
    if (AmoutCoupon.length > Coupon.amount)
      return { error: "Cupom já foi utilizado" };

    return Coupon;
  },

  // Gerar um código de cupom
  async GenerateCoupon() {
    const letras = "123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    let coupon = "";
    for (var i = 0; i < 6; i++) {
      var rnum = Math.floor(Math.random() * letras.length);
      coupon += letras.substring(rnum, rnum + 1);
    }
    return coupon;
  },
};
