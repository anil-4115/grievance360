package com.grievance360.service;

import com.grievance360.dto.ComplaintDetailDto;
import com.grievance360.dto.ComplaintEventDto;
import com.grievance360.dto.ComplaintSummaryDto;
import com.grievance360.entity.Complaint;
import com.grievance360.entity.ComplaintEvent;
import com.grievance360.repository.ComplaintEventRepository;
import com.grievance360.repository.ComplaintRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final ComplaintEventRepository complaintEventRepository;

    public ComplaintService(ComplaintRepository complaintRepository, ComplaintEventRepository complaintEventRepository) {
        this.complaintRepository = complaintRepository;
        this.complaintEventRepository = complaintEventRepository;
    }

    public Page<ComplaintSummaryDto> getAll(String search, String status, String bureau, Pageable pageable) {
        Page<Complaint> page = complaintRepository.findAllWithFilters(search, status, bureau, pageable);
        return page.map(this::toSummaryDto);
    }

    public ComplaintDetailDto getById(UUID id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));
        return toDetailDto(complaint);
    }

    public List<ComplaintEventDto> getEvents(UUID complaintId) {
        List<ComplaintEvent> events = complaintEventRepository.findByComplaintIdOrderByEventTimestampAsc(complaintId);
        return events.stream().map(this::toEventDto).collect(Collectors.toList());
    }

    private ComplaintSummaryDto toSummaryDto(Complaint complaint) {
        ComplaintSummaryDto dto = new ComplaintSummaryDto();
        dto.setId(complaint.getId());
        dto.setReferenceId(complaint.getReferenceId());
        dto.setInstitutionId(complaint.getInstitution().getId());
        dto.setInstitutionName(complaint.getInstitution().getName());
        dto.setInstitutionCode(complaint.getInstitution().getCode());
        dto.setCategory(complaint.getCategory());
        dto.setBureau(complaint.getBureau() != null ? complaint.getBureau().getCode() : null);
        dto.setStatus(complaint.getStatus());
        dto.setSubject(complaint.getSubject());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setLastUpdatedAt(complaint.getLastUpdatedAt());
        dto.setAgeDays(complaint.getAgeDays());
        dto.setAssignedTo(complaint.getAssignedTo());
        dto.setTransferCount(complaint.getTransferCount());
        dto.setUnassigned(complaint.getUnassigned());
        dto.setStale(complaint.getStale());
        return dto;
    }

    private ComplaintDetailDto toDetailDto(Complaint complaint) {
        ComplaintDetailDto dto = new ComplaintDetailDto();
        dto.setId(complaint.getId());
        dto.setReferenceId(complaint.getReferenceId());
        dto.setInstitutionId(complaint.getInstitution().getId());
        dto.setInstitutionName(complaint.getInstitution().getName());
        dto.setInstitutionCode(complaint.getInstitution().getCode());
        dto.setCategory(complaint.getCategory());
        dto.setBureau(complaint.getBureau() != null ? complaint.getBureau().getCode() : null);
        dto.setStatus(complaint.getStatus());
        dto.setSubject(complaint.getSubject());
        dto.setDescription(complaint.getDescription());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setLastUpdatedAt(complaint.getLastUpdatedAt());
        dto.setAgeDays(complaint.getAgeDays());
        dto.setAssignedTo(complaint.getAssignedTo());
        dto.setTransferCount(complaint.getTransferCount());
        dto.setUnassigned(complaint.getUnassigned());
        dto.setStale(complaint.getStale());
        return dto;
    }

    private ComplaintEventDto toEventDto(ComplaintEvent event) {
        ComplaintEventDto dto = new ComplaintEventDto();
        dto.setId(event.getId());
        dto.setComplaintId(event.getComplaint().getId());
        dto.setTimestamp(event.getEventTimestamp());
        dto.setActor(event.getActor());
        dto.setAction(event.getAction());
        dto.setDetails(event.getDetails());
        return dto;
    }
}
