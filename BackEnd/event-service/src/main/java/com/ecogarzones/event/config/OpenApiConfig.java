package com.ecogarzones.event.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI eventServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ecogarzones - Event Service API")
                        .description("Microservicio encargado de la gestión de clientes, cotizaciones y banquetes corporativos en OCI.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Arquitectura Ecogarzones")
                                .email("soporte@ecogarzones.com")));
    }
}
