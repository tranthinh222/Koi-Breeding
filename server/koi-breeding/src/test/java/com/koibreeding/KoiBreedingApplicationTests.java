package com.koibreeding;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class KoiBreedingApplicationTests {

	@Value("${spring.application.name}")
	private String title;

	@Test
	void contextLoads() {
		System.out.println(">>> Run in " + title);
	}

	@Test
	void checkApplicationProperties() {
		assertEquals("koi-breeding-test", title);
	}

}
