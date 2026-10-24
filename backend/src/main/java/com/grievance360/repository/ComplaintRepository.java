package com.grievance360.repository;

import com.grievance360.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
    Optional<Complaint> findByReferenceId(String referenceId);
    boolean existsByReferenceId(String referenceId);

    @Query("SELECT c FROM Complaint c " +
            "LEFT JOIN FETCH c.institution i " +
            "LEFT JOIN FETCH c.bureau b " +
            "WHERE (:search IS NULL OR :search = '' OR " +
            "LOWER(c.referenceId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.subject) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:status IS NULL OR :status = '' OR c.status = :status) " +
            "AND (:bureau IS NULL OR :bureau = '' OR b.code = :bureau)")
    Page<Complaint> findAllWithFilters(@Param("search") String search,
                                       @Param("status") String status,
                                       @Param("bureau") String bureau,
                                       Pageable pageable);
}
