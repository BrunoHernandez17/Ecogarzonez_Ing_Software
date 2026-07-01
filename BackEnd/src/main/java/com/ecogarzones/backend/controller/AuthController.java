package com.ecogarzones.backend.controller;

import com.ecogarzones.backend.model.Usuario;
import com.ecogarzones.backend.security.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecogarzones.backend.model.Rol;
import com.ecogarzones.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        final Usuario userDetails = (Usuario) userDetailsService.loadUserByUsername(request.getEmail());
        final String token = jwtUtil.generateToken(userDetails, userDetails.getRol().name());
        
        return ResponseEntity.ok(new AuthResponse(token, userDetails.getRol().name(), userDetails.getNombre()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo ya está en uso.");
        }

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.valueOf(request.getRol().toUpperCase()))
                .build();

        usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.ok("Usuario registrado exitosamente");
    }

    @org.springframework.web.bind.annotation.GetMapping("/staff")
    public ResponseEntity<java.util.List<Usuario>> getStaff() {
        java.util.List<Usuario> staff = usuarioRepository.findAll().stream()
                .filter(u -> !u.getRol().equals(Rol.ADMIN) && !u.getRol().equals(Rol.SUPERVISOR) && !u.getRol().equals(Rol.CLIENTE))
                .toList();
        return ResponseEntity.ok(staff);
    }

    @Data
    static class AuthRequest {
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    static class AuthResponse {
        private String token;
        private String rol;
        private String nombre;
    }

    @Data
    static class RegisterRequest {
        private String nombre;
        private String email;
        private String password;
        private String rol;
    }
}
