const optionsFull = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  timeZone: "America/Sao_Paulo",
};

const optionsDate = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
};

const optionsTime = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  timeZone: "America/Sao_Paulo",
};

module.exports = {
  formatDate(value) {
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat("pt-BR", optionsDate).format(date);
    } catch (error) {
      return;
    }
  },

  formatDateTime(value) {
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat("pt-BR", optionsFull).format(date);
    } catch (error) {
      return;
    }
  },

  formatTime(value) {
    try {
      const date = new Date(value);
      return new Intl.DateTimeFormat("pt-BR", optionsTime).format(date);
    } catch (error) {
      return;
    }
  },

  formatCurrency(value) {
    try {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(value);
    } catch (error) {
      return;
    }
  },
  isboolean(str) {
    if (str == null) return false;

    if (typeof str === "boolean") {
      return str === true;
    }

    if (typeof str === "string") {
      if (str === "") return false;

      str = str.replace(/^\s+|\s+$/g, "");

      if (str.toLowerCase() === "true" || str.toLowerCase() === "yes")
        return true;

      str = str.replace(/,/g, ".");
      str = str.replace(/^\s*\-\s*/g, "-");
    }

    if (!isNaN(str)) return parseFloat(str) != 0;

    return false;
  },
};
