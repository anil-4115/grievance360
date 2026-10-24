package com.grievance360.service;

import com.grievance360.dto.InstitutionDto;
import com.grievance360.entity.Institution;
import com.grievance360.repository.InstitutionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class InstitutionService {
    private final InstitutionRepository institutionRepository;

    public InstitutionService(InstitutionRepository institutionRepository) {
        this.institutionRepository = institutionRepository;
    }

    public List<InstitutionDto> getAll() {
        return institutionRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InstitutionDto getById(UUID id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Institution not found"));
        return toDto(institution);
    }

    private InstitutionDto toDto(Institution institution) {
        String bureauCode = institution.getBureau() != null ? institution.getBureau().getCode() : null;
        String bureauName = institution.getBureau() != null ? institution.getBureau().getName() : null;
        return new InstitutionDto(institution.getId(), institution.getCode(), institution.getName(),
                institution.getLocation(), bureauCode, bureauName);
    }
}
