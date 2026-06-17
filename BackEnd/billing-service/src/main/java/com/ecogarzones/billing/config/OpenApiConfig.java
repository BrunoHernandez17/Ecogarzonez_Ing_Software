package com.ecogarzones.billing.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI billingServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ecogarzones - Billing and Fees Service API")
                        .description("Microservicio encargado del procesamiento de pagos de clientes y liquidaciones de honorarios para el staff en terreno.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Arquitectura Ecogarzones")
                                .email("finanzas@ecogarzones.com")));
    }
}
