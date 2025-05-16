const axios = require('axios');

// API keys HARDCODED
const CLIENT_ID = 'AeOR9G0vO4Kr8sZMS0COHZddEL7JqOig32tcVxgvpfEX_cUrmHfqRKoLoth8ZElVGob_gcQp-Ke42d33';
const SECRET = 'EK2BN00ejDbyrA_jqjyEKD9SZB1Y0aFnZ4YAGY_Lhjc676mTC6o5dOdqo2iZ14CpWrA1U5jFRr4JTQB2';

exports.generateLink = (amount) => {
  return `https://www.paypal.com/cgi-bin/webscr?business=avatips1@gmail.com&cmd=_xclick&currency_code=EUR&amount=${amount}&item_name=regalo`;
};

// Simulazione di verifica pagamento
exports.verifyPayment = async (paymentId, payerId, amount) => {
  // Implementa la verifica reale con le API PayPal REST se necessario
  // In produzione: chiamata POST a https://api-m.paypal.com/v1/payments/payment/{paymentId}
  return true;
};