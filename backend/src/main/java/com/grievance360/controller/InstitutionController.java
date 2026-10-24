package com.grievance360.controller;

import com.grievance360.dto.InstitutionDto;
import com.grievance360.service.InstitutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/institutions")
public class InstitutionController {
    private final InstitutionService institutionService;

    public InstitutionController(InstitutionService institutionService) {
        this.institutionService = institutionService;
    }

    @GetMapping
    public ResponseEntity<List<InstitutionDto>> getAll() {
        return ResponseEntity.ok(institutionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstitutionDto> getById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(institutionService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
