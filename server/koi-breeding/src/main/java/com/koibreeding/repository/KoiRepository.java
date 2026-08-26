package com.koibreeding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Koi;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface KoiRepository extends JpaRepository<Koi, Integer> {
    List<Koi> findTop3ByOrderByIdDesc();

    List<Koi> findTop3ByPond_Owner_IdOrderByIdDesc(Integer ownerId);

    long countByPond_Id(Integer pondId);

    @Query("""
    SELECT k
    FROM Koi k
    WHERE k.pond.owner.id = :userId
    AND NOT EXISTS (
        SELECT m
        FROM Marketplace m
        WHERE m.koi.id = k.id
    )
    """)
    List<Koi> findAvailableKoisByUserId(@Param("userId") Integer userId);
}
