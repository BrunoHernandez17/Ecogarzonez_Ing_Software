package com.ecogarzones.event.integration;

public interface NotificationService {
    /**
     * Envia una alerta automatizada por Email a un destinatario.
     */
    void sendEmail(String to, String subject, String body);

    /**
     * Envia una alerta automatizada por SMS / Whatsapp al staff o cliente.
     */
    void sendSms(String phoneNumber, String message);
}
