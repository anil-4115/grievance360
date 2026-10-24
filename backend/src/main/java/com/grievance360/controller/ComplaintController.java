package com.grievance360.controller;

import com.grievance360.dto.ComplaintDetailDto;
import com.grievance360.dto.ComplaintEventDto;
import com.grievance360.dto.ComplaintSummaryDto;
import com.grievance360.service.ComplaintService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {
    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<Page<ComplaintSummaryDto>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String bureau,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        if (size > 100) size = 100;
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(complaintService.getAll(search, status, bureau, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintDetailDto> getById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(complaintService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<ComplaintEventDto>> getEvents(@PathVariable UUID id) {
        return ResponseEntity.ok(complaintService.getEvents(id));
    }
}
