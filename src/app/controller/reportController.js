const connection = require("../../database/connection");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const dateFns = require("date-fns");

const router = express.Router();

router.use(authMiddleware);

/**
 * Relatório de Vendas diárias
 * @param {} app
 * @returns
 */
router.get("/saleDay", async (req, res) => {
  const now = new Date();

  const day = (now.getDate() + 1).toString().padStart(2, 0);
  const month = (now.getMonth() + 1).toString().padStart(2, 0);
  const year = now.getFullYear().toString().padStart(2, 0);

  const dateCurrent = `${year}-${month}-${day}`;

  const saleDay = await connection("request")
    .where("dateTimeOrder", ">=", `${dateCurrent}T00:00:00Z`)
    .where("dateTimeOrder", "<=", `${dateCurrent}T23:59:59Z`)
    .select("dateTimeOrder", "totalPurchase");

  // total da vendo do dia
  const totalSaleDay = await saleDay.reduce(function (total, item) {
    return total + Number(item.totalPurchase);
  }, 0);

  return res.json({
    date: now,
    totalSaleDay: totalSaleDay,
  });
});

/**
 * Relatório de Vendas Semana
 * @param {Date} Recebe a data base
 * @returns Array total vendas por semana [dom, ... , sab]
 */
router.get("/saleWeek", async (req, res) => {
  const now = new Date();

  // Verificar o dia da semana 0=Domingo, ... ,  6=Sabado
  const isDateWeek = now.getDay();
  // Buscar o dia que inicia a semana
  const dateStart = dateFns.subDays(now, Number(isDateWeek));
  // Buscar o dia que termina a semana
  const dateEnd = dateFns.addDays(now, 6 - Number(isDateWeek));

  const saleWeek = await connection("request")
    .where("dateTimeOrder", ">=", dateStart)
    .where("dateTimeOrder", "<=", dateEnd)
    .select("dateTimeOrder", "totalPurchase");

  // Somar vendas por semana
  let totalSun = 0;
  let totalMon = 0;
  let totalTue = 0;
  let totalWed = 0;
  let totalThu = 0;
  let totalFri = 0;
  let totalSat = 0;

  saleWeek.map((item) => {
    const dateItem = new Date(item.dateTimeOrder);
    // Capturar a semana 0 a 6 -> inicia 0=Domingo
    const week = dateItem.getDay();

    // Somar valor no dia da semana correspondente
    switch (week) {
      case 0: //Domingo
        totalSun = totalSun + Number(item.totalPurchase);
        break;
      case 1: //Segunda-feira
        totalMon = totalMon + Number(item.totalPurchase);
        break;
      case 2: //Terça-feira
        totalTue = totalTue + Number(item.totalPurchase);
        break;
      case 3: //Quarta-feira
        totalWed = totalWed + Number(item.totalPurchase);
        break;
      case 4: //Quinta-feira
        totalThu = totalThu + Number(item.totalPurchase);
        break;
      case 5: //Sexta-feira
        totalFri = totalFri + Number(item.totalPurchase);
        break;
      case 6: //Sábado
        totalSat = totalSat + Number(item.totalPurchase);
        break;
      default:
        break;
    }
  });

  return res.json([
    totalSun,
    totalMon,
    totalTue,
    totalWed,
    totalThu,
    totalFri,
    totalSat,
  ]);
});

/**
 * Relatório de Vendas Mes a Mes
 * @returns Array contendo vendas por mês de Jan a Dec do ano corrente
 */
router.get("/saleYear", async (req, res) => {
  const dateCurrent = new Date();

  const year = dateCurrent.getFullYear();

  const dateStart = `${year}-01-01T00:00:00Z`;
  const dateEnd = `${year}-12-31T23:59:59Z`;

  const saleYear = await connection("request")
    .where("dateTimeOrder", ">=", dateStart)
    .where("dateTimeOrder", "<=", dateEnd)
    .select("dateTimeOrder", "totalPurchase");

  let totalJan = 0;
  let totalFeb = 0;
  let totalMar = 0;
  let totalApr = 0;
  let totalMay = 0;
  let totalJun = 0;
  let totalJul = 0;
  let totalAug = 0;
  let totalSep = 0;
  let totalOct = 0;
  let totalNov = 0;
  let totalDec = 0;

  saleYear.map((item) => {
    const date = new Date(item.dateTimeOrder);
    const month = date.getMonth() + 1; //Primeiro mês corresponde a 0

    // Somar valor no dia da semana correspondente
    switch (month) {
      case 1: //JANEIRO
        totalJan = totalJan + Number(item.totalPurchase);
        break;
      case 2: //FEVEREIRO
        totalFeb = totalFeb + Number(item.totalPurchase);
        break;
      case 3: //MARÇO
        totalMar = totalMar + Number(item.totalPurchase);
        break;
      case 4: //ABRIL
        totalApr = totalApr + Number(item.totalPurchase);
        break;
      case 5: //MAIO
        totalMay = totalMay + Number(item.totalPurchase);
        break;
      case 6: //JUNHO
        totalJun = totalJun + Number(item.totalPurchase);
        break;
      case 7: //JULHO
        totalJul = totalJul + Number(item.totalPurchase);
        break;
      case 8: //AGOSTO
        totalAug = totalAug + Number(item.totalPurchase);
        break;
      case 9: //SETEMBRO
        totalSep = totalSep + Number(item.totalPurchase);
        break;
      case 10: //OUTRUBRO
        totalOct = totalOct + Number(item.totalPurchase);
        break;
      case 11: //NOVEMBRO
        totalNov = totalNov + Number(item.totalPurchase);
        break;
      case 12: //DEZEMBRO
        totalDec = totalDec + Number(item.totalPurchase);
        break;
      default:
        break;
    }
  });

  return res.json([
    totalJan,
    totalFeb,
    totalMar,
    totalApr,
    totalMay,
    totalJun,
    totalJul,
    totalAug,
    totalSep,
    totalOct,
    totalNov,
    totalDec,
  ]);
});

/**
 * Relatório de Vendas por Periodo
 * @param {} app
 * @returns
 */
router.get("/salePeriod", async (req, res) => {
  return;
});

module.exports = (app) => app.use("/report", router);
