package com.flic.inventoryManagement.service.userservice.passwordservice;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordService {

@Bean
public PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
}


}
