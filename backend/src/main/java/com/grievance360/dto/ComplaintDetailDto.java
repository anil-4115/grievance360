package com.grievance360.dto;

import java.time.Instant;
import java.util.UUID;

public class ComplaintDetailDto {
    private UUID id;
    private String referenceId;
    private UUID institutionId;
    private String institutionName;
    private String institutionCode;
    private String category;
    private String bureau;
    private String status;
    private String subject;
    private String description;
    private Instant createdAt;
    private Instant lastUpdatedAt;
    private Integer ageDays;
    private String assignedTo;
    private Integer transferCount;
    private Boolean unassigned;
    private Boolean stale;

    public ComplaintDetailDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    public UUID getInstitutionId() { return institutionId; }
    public void setInstitutionId(UUID institutionId) { this.institutionId = institutionId; }
    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }
    public String getInstitutionCode() { return institutionCode; }
    public void setInstitutionCode(String institutionCode) { this.institutionCode = institutionCode; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getBureau() { return bureau; }
    public void setBureau(String bureau) { this.bureau = bureau; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getLastUpdatedAt() { return lastUpdatedAt; }
    public void setLastUpdatedAt(Instant lastUpdatedAt) { this.lastUpdatedAt = lastUpdatedAt; }
    public Integer getAgeDays() { return ageDays; }
    public void setAgeDays(Integer ageDays) { this.ageDays = ageDays; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public Integer getTransferCount() { return transferCount; }
    public void setTransferCount(Integer transferCount) { this.transferCount = transferCount; }
    public Boolean getUnassigned() { return unassigned; }
    public void setUnassigned(Boolean unassigned) { this.unassigned = unassigned; }
    public Boolean getStale() { return stale; }
    public void setStale(Boolean stale) { this.stale = stale; }
}
