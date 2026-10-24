package com.grievance360.repository;

import com.grievance360.entity.ComplaintEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ComplaintEventRepository extends JpaRepository<ComplaintEvent, UUID> {
    List<ComplaintEvent> findByComplaintIdOrderByEventTimestampAsc(UUID complaintId);
}
