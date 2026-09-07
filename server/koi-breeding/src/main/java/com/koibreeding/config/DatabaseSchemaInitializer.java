package com.koibreeding.config;

import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import com.koibreeding.enums.Location;
import java.util.Arrays;
import java.util.stream.Collectors;

@Configuration
public class DatabaseSchemaInitializer {
    @Bean
    @Order(0)
    CommandLineRunner updateEnumConstraints(DataSource dataSource, JdbcTemplate jdbcTemplate,
            @Value("${spring.jpa.properties.hibernate.default_schema:koi_breeding}") String schema) {
        return args -> {
            if (!isPostgreSql(dataSource)) {
                return;
            }
            if (!schema.matches("[A-Za-z_][A-Za-z0-9_]*")) {
                throw new IllegalArgumentException("Invalid database schema name: " + schema);
            }

            jdbcTemplate.execute("ALTER TABLE " + schema
                    + ".item DROP CONSTRAINT IF EXISTS item_effect_type_check");
            jdbcTemplate.execute("ALTER TABLE " + schema
                    + ".item ADD CONSTRAINT item_effect_type_check "
                    + "CHECK (effect_type IS NULL OR effect_type IN "
                    + "('WATER_QUALITY', 'COOLING', 'HEATING', 'GROWTH', 'MUTATION'))");

            jdbcTemplate.execute("UPDATE " + schema + ".users SET location = CASE location "
                    + "WHEN 'Ho Chi Minh City' THEN 'HO_CHI_MINH_CITY' "
                    + "WHEN 'Hanoi' THEN 'HANOI' "
                    + "WHEN 'Da Nang' THEN 'DA_NANG' "
                    + "ELSE NULL END "
                    + "WHERE location IS NOT NULL AND location NOT IN (" + locationValues() + ")");
            jdbcTemplate.execute("ALTER TABLE " + schema
                    + ".users DROP CONSTRAINT IF EXISTS users_location_check");
            jdbcTemplate.execute("ALTER TABLE " + schema
                    + ".users ADD CONSTRAINT users_location_check "
                    + "CHECK (location IS NULL OR location IN (" + locationValues() + "))");
        };
    }

    private boolean isPostgreSql(DataSource dataSource) throws SQLException {
        try (var connection = dataSource.getConnection()) {
            return "PostgreSQL".equalsIgnoreCase(connection.getMetaData().getDatabaseProductName());
        }
    }

    private String locationValues() {
        return Arrays.stream(Location.values())
                .map(location -> "'" + location.name() + "'")
                .collect(Collectors.joining(", "));
    }
}
