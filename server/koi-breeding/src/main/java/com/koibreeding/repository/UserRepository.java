package com.koibreeding.repository;

import com.koibreeding.domain.User;
import com.koibreeding.enums.Role;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepository extends JpaRepository<User, Integer> {
    Page<User> findAllByRole(Role role, Pageable pageable);
    boolean existsByRole(Role role);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    long countByCreatedAtBetween(Instant start, Instant end);
    List<User> findTopByOrderByLevelDesc();
    List<User> findTop3ByOrderByLevelDesc();
    Optional<User> findFirstByOrderByLevelDesc();

    // 1. Interface hứng dữ liệu biểu đồ Location
    interface LocationCount {
        String getLocation();
        Long getCount();
    }

    // Query đếm user theo từng thành phố
    @Query("SELECT u.location AS location, COUNT(u.id) AS count FROM User u GROUP BY u.location")
    List<LocationCount> countUsersByLocation();

    // Projection cho Biểu đồ User Growth
    interface UserGrowthProjection {
        String getLabel();
        Long getValue();
    }

    // Đổi sang JPQL: Dùng "User u" và FUNCTION('TO_CHAR', ...)
    @Query("""
        SELECT FUNCTION('TO_CHAR', u.createdAt, 'MM/YYYY') AS label, 
               COUNT(u.id) AS value
        FROM User u
        WHERE u.createdAt >= :startDate
        GROUP BY FUNCTION('TO_CHAR', u.createdAt, 'MM/YYYY')
        ORDER BY MIN(u.createdAt) ASC
    """)
    List<UserGrowthProjection> countUserGrowthByMonth(@Param("startDate") Instant startDate);
}
