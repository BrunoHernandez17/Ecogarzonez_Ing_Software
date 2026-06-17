package com.ecogarzones.billing.integration;

public interface PaymentGateway {
    
    /**
     * Inicializa una transacción con Transbank Webpay Plus o Stripe.
     * Retorna el token de la transacción y la URL de redirección.
     */
    PaymentInitResult initTransaction(String buyOrder, String sessionId, double amount, String returnUrl);

    /**
     * Confirma el pago de la pasarela y valida el resultado.
     */
    PaymentConfirmResult confirmTransaction(String token);

    class PaymentInitResult {
        public String token;
        public String redirectUrl;
        public boolean success;
    }

    class PaymentConfirmResult {
        public String authorizationCode;
        public String responseCode;
        public boolean success;
        public String paymentMessage;
    }
}
