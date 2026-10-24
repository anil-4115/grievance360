package com.grievance360.repository;

import com.grievance360.entity.Bureau;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BureauRepository extends JpaRepository<Bureau, UUID> {
    Optional<Bureau> findByCode(String code);
    boolean existsByCode(String code);
}
