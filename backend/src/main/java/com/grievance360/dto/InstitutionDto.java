package com.grievance360.dto;

import java.util.UUID;

public class InstitutionDto {
    private UUID id;
    private String code;
    private String name;
    private String location;
    private String bureauCode;
    private String bureauName;

    public InstitutionDto() {}

    public InstitutionDto(UUID id, String code, String name, String location, String bureauCode, String bureauName) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.location = location;
        this.bureauCode = bureauCode;
        this.bureauName = bureauName;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getBureauCode() { return bureauCode; }
    public void setBureauCode(String bureauCode) { this.bureauCode = bureauCode; }
    public String getBureauName() { return bureauName; }
    public void setBureauName(String bureauName) { this.bureauName = bureauName; }
}
