package com.koibreeding;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KoiBreedingApplication {

	public static void main(String[] args) {
		SpringApplication.run(KoiBreedingApplication.class, args);
	}

}
