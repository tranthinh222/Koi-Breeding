package com.koibreeding.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.koibreeding.domain.BreedingEvent;
import com.koibreeding.enums.BreedingStatus;

public interface BreedingEventRepository extends JpaRepository<BreedingEvent, Integer>,
        JpaSpecificationExecutor<BreedingEvent> {
    List<BreedingEvent> findByStatusNotIn(Collection<BreedingStatus> statuses);

    @Query("""
            select count(event) > 0 from BreedingEvent event
            where event.user.id = :userId
              and (event.male.id = :koiId or event.female.id = :koiId)
              and event.status not in :excludedStatuses
            """)
    boolean existsByUserAndParentKoiAndStatusNotIn(
            @Param("userId") Integer userId,
            @Param("koiId") Integer koiId,
            @Param("excludedStatuses") Collection<BreedingStatus> excludedStatuses);
}
