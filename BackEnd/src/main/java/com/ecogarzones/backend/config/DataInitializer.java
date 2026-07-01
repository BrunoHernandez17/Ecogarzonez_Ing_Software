package com.ecogarzones.backend.config;

import com.ecogarzones.backend.model.*;
import com.ecogarzones.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, 
                                   MinutaRepository minutaRepository,
                                   EventoRepository eventoRepository,
                                   TareaRepository tareaRepository) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                // ADMIN
                Usuario admin = usuarioRepository.save(Usuario.builder()
                        .nombre("Admin Principal")
                        .email("admin@ecogarzones.cl")
                        .password(passwordEncoder.encode("admin123"))
                        .rol(Rol.ADMIN)
                        .build());
                        
                // SUPERVISORS
                Usuario supervisor1 = usuarioRepository.save(Usuario.builder()
                        .nombre("Supervisor Juan")
                        .email("juan.sup@ecogarzones.cl")
                        .password(passwordEncoder.encode("sup123"))
                        .rol(Rol.SUPERVISOR)
                        .build());
                Usuario supervisor2 = usuarioRepository.save(Usuario.builder()
                        .nombre("Supervisora Marta")
                        .email("marta.sup@ecogarzones.cl")
                        .password(passwordEncoder.encode("sup123"))
                        .rol(Rol.SUPERVISOR)
                        .build());

                // CHEFS
                Usuario chef1 = usuarioRepository.save(Usuario.builder()
                        .nombre("Chef Maria")
                        .email("maria.chef@ecogarzones.cl")
                        .password(passwordEncoder.encode("chef123"))
                        .rol(Rol.CHEF)
                        .build());
                Usuario chef2 = usuarioRepository.save(Usuario.builder()
                        .nombre("Chef Roberto")
                        .email("roberto.chef@ecogarzones.cl")
                        .password(passwordEncoder.encode("chef123"))
                        .rol(Rol.CHEF)
                        .build());
                Usuario chef3 = usuarioRepository.save(Usuario.builder()
                        .nombre("Chef Camila (Pastelera)")
                        .email("camila.chef@ecogarzones.cl")
                        .password(passwordEncoder.encode("chef123"))
                        .rol(Rol.CHEF)
                        .build());

                // GARZONES
                Usuario garzon1 = usuarioRepository.save(Usuario.builder().nombre("Garzón Pedro").email("pedro.g@ecogarzones.cl").password(passwordEncoder.encode("garzon123")).rol(Rol.GARZON).build());
                Usuario garzon2 = usuarioRepository.save(Usuario.builder().nombre("Garzón Diego").email("diego.g@ecogarzones.cl").password(passwordEncoder.encode("garzon123")).rol(Rol.GARZON).build());
                Usuario garzon3 = usuarioRepository.save(Usuario.builder().nombre("Garzón Andrea").email("andrea.g@ecogarzones.cl").password(passwordEncoder.encode("garzon123")).rol(Rol.GARZON).build());
                Usuario garzon4 = usuarioRepository.save(Usuario.builder().nombre("Garzón Sofia").email("sofia.g@ecogarzones.cl").password(passwordEncoder.encode("garzon123")).rol(Rol.GARZON).build());
                Usuario garzon5 = usuarioRepository.save(Usuario.builder().nombre("Garzón Felipe").email("felipe.g@ecogarzones.cl").password(passwordEncoder.encode("garzon123")).rol(Rol.GARZON).build());

                // BARTENDERS
                Usuario bartender1 = usuarioRepository.save(Usuario.builder().nombre("Bartender Luis").email("luis.b@ecogarzones.cl").password(passwordEncoder.encode("bar123")).rol(Rol.BARTENDER).build());
                Usuario bartender2 = usuarioRepository.save(Usuario.builder().nombre("Bartender Carlos").email("carlos.b@ecogarzones.cl").password(passwordEncoder.encode("bar123")).rol(Rol.BARTENDER).build());
                Usuario bartender3 = usuarioRepository.save(Usuario.builder().nombre("Bartender Valentina").email("vale.b@ecogarzones.cl").password(passwordEncoder.encode("bar123")).rol(Rol.BARTENDER).build());

                // ASEO
                Usuario aseo1 = usuarioRepository.save(Usuario.builder().nombre("Aseo Ana").email("ana.a@ecogarzones.cl").password(passwordEncoder.encode("aseo123")).rol(Rol.ASEO).build());
                Usuario aseo2 = usuarioRepository.save(Usuario.builder().nombre("Aseo Jorge").email("jorge.a@ecogarzones.cl").password(passwordEncoder.encode("aseo123")).rol(Rol.ASEO).build());
                Usuario aseo3 = usuarioRepository.save(Usuario.builder().nombre("Aseo Claudia").email("claudia.a@ecogarzones.cl").password(passwordEncoder.encode("aseo123")).rol(Rol.ASEO).build());

                System.out.println("Usuarios por defecto creados.");

                // MINUTAS
                Minuta m1 = minutaRepository.save(Minuta.builder()
                        .nombre("Menú Tradicional")
                        .descripcion("Entrada: Empanaditas surtidas.\nFondo: Asado de tira con puré rústico.\nPostre: Leche asada clásica.")
                        .precioPorPersona(22000.0)
                        .estado("APROBADA")
                        .chef(chef1)
                        .build());

                Minuta m2 = minutaRepository.save(Minuta.builder()
                        .nombre("Menú Vegano")
                        .descripcion("Entrada: Hummus con bastones de apio y zanahoria.\nFondo: Lasaña de berenjenas y zapallo italiano con salsa de castañas.\nPostre: Mousse de chocolate amargo con leche de almendras.")
                        .precioPorPersona(18000.0)
                        .estado("APROBADA")
                        .chef(chef1)
                        .build());

                Minuta m3 = minutaRepository.save(Minuta.builder()
                        .nombre("Menú Vegetariano")
                        .descripcion("Entrada: Ceviche de champiñones.\nFondo: Risotto de quinoa con verduras asadas y queso parmesano.\nPostre: Tiramisú vegetariano.")
                        .precioPorPersona(17500.0)
                        .estado("APROBADA")
                        .chef(chef2)
                        .build());

                Minuta m4 = minutaRepository.save(Minuta.builder()
                        .nombre("Menú Celíaco (Sin Gluten)")
                        .descripcion("Entrada: Brochetas caprese.\nFondo: Salmón a la plancha con papas salteadas al romero.\nPostre: Panna cotta con salsa de frutos rojos.")
                        .precioPorPersona(24000.0)
                        .estado("APROBADA")
                        .chef(chef2)
                        .build());

                Minuta m5 = minutaRepository.save(Minuta.builder()
                        .nombre("Banquetería Dulce y Salada (Cocktail)")
                        .descripcion("Salados: Tapaditos de ave, crostinis de salmón, mini empanadas, quiches variados.\nDulces: Mini tartaletas, cachitos rellenos, alfajores artesanales y brownies.")
                        .precioPorPersona(15000.0)
                        .estado("APROBADA")
                        .chef(chef3)
                        .build());

                Minuta m6 = minutaRepository.save(Minuta.builder()
                        .nombre("Menú Premium (Mar y Tierra)")
                        .descripcion("Entrada: Ostiones a la parmesana.\nFondo: Filete mignon envuelto en tocino con gratín de papas y salsa de vino tinto.\nPostre: Volcán de chocolate con helado de vainilla artesanal.")
                        .precioPorPersona(35000.0)
                        .estado("APROBADA")
                        .chef(chef1)
                        .build());

                System.out.println("Minutas iniciales creadas.");

                if (eventoRepository.count() == 0) {
                    Evento e1 = new Evento();
                    e1.setClientName("Banco de Chile");
                    e1.setClientEmail("contacto@bancochile.cl");
                    e1.setEventType("corporativo");
                    e1.setDate("2026-07-15");
                    e1.setGuests(100);
                    e1.setMinuta(m1);
                    e1.setBarId("cocteleria_autor");
                    e1.setTotalPrice(100 * m1.getPrecioPorPersona() + 500000); 
                    e1.setCost(500000.0);
                    e1.setStatus("APROBADO");
                    e1.setCreatedAt("2026-06-28");
                    e1 = eventoRepository.save(e1);

                    // Assign tasks to the event
                    tareaRepository.save(Tarea.builder()
                            .evento(e1)
                            .staff(chef1)
                            .rolAsignado(Rol.CHEF)
                            .detalle("Preparar 100 platos Menú Tradicional")
                            .build());

                    tareaRepository.save(Tarea.builder()
                            .evento(e1)
                            .staff(garzon1)
                            .rolAsignado(Rol.GARZON)
                            .detalle("Servir Mesas 1 a 5")
                            .build());
                            
                    tareaRepository.save(Tarea.builder()
                            .evento(e1)
                            .staff(bartender1)
                            .rolAsignado(Rol.BARTENDER)
                            .detalle("Encargado Barra Principal")
                            .build());

                    System.out.println("Eventos y tareas iniciales creados.");
                }
            }
        };
    }
}
