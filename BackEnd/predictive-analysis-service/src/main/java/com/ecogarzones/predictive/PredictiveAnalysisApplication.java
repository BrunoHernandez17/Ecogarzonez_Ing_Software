package com.ecogarzones.predictive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PredictiveAnalysisApplication {
    public static void main(String[] args) {
        SpringApplication.run(PredictiveAnalysisApplication.class, args);
    }
}
