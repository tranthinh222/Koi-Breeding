package com.koibreeding.repository;

import java.util.List;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.koibreeding.domain.Koi;

public interface KoiRepository extends JpaRepository<Koi, Integer> {
    interface BeautifulKoiView {
        Integer getId();
        String getName();
        String getImageUrl();
        Double getBeautifulScore();
    }

    @Query("""
            select k.id as id, k.name as name, k.dictionary.imageUrl as imageUrl,
                   (k.patternScore * 35 + k.colorScore * 25 + k.bodyScore * 20
                    + k.skinScore * 10 + k.scaleScore * 10) / 100.0 as beautifulScore
            from Koi k
            where k.pond.owner.id = :ownerId
            order by beautifulScore desc, k.id asc
            """)
    List<BeautifulKoiView> findMostBeautifulByOwner(@Param("ownerId") Integer ownerId, Pageable pageable);

    @Query("select k.id from Koi k")
    List<Integer> findAllIds();
    List<Koi> findTop3ByOrderByIdDesc();

    List<Koi> findTop3ByPond_Owner_IdOrderByIdDesc(Integer ownerId);

    List<Koi> findAllByPond_Id(Integer pondId);

    long countByPond_Id(Integer pondId);

    long countByPond_Owner_Id(Integer ownerId);

    List<Koi> findAllByPond_Owner_Id(Integer ownerId);

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

    interface LifeStageCount {
        String getLifeStage();

        Long getCount();
    }

    @Query("SELECT k.lifeStage AS lifeStage, COUNT(k.id) AS count FROM Koi k GROUP BY k.lifeStage")
    List<LifeStageCount> countKoiByLifeStage();
}
