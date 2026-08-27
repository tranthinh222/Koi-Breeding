package com.koibreeding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Koi;

public interface KoiRepository extends JpaRepository<Koi, Integer> {
    List<Koi> findTop3ByOrderByIdDesc();

    List<Koi> findTop3ByPond_Owner_IdOrderByIdDesc(Integer ownerId);

    List<Koi> findAllByPond_Id(Integer pondId);

    long countByPond_Id(Integer pondId);
}
