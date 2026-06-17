package com.ecogarzones.logistics;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI logisticsServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ecogarzones - Logistics, Inventory and Incident Service API")
                        .description("Microservicio encargado del personal de terreno (check-in/out), control de traslados, inventario e incidencias logísticas.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Logística Ecogarzones")
                                .email("logistica@ecogarzones.com")));
    }
}
