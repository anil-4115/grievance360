package com.grievance360.seed;

import com.grievance360.entity.Bureau;
import com.grievance360.entity.Complaint;
import com.grievance360.entity.ComplaintEvent;
import com.grievance360.entity.Institution;
import com.grievance360.repository.BureauRepository;
import com.grievance360.repository.ComplaintEventRepository;
import com.grievance360.repository.ComplaintRepository;
import com.grievance360.repository.InstitutionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Component
@Profile("seed")
public class DataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final BureauRepository bureauRepository;
    private final InstitutionRepository institutionRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintEventRepository complaintEventRepository;

    public DataSeeder(BureauRepository bureauRepository, InstitutionRepository institutionRepository,
                      ComplaintRepository complaintRepository, ComplaintEventRepository complaintEventRepository) {
        this.bureauRepository = bureauRepository;
        this.institutionRepository = institutionRepository;
        this.complaintRepository = complaintRepository;
        this.complaintEventRepository = complaintEventRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (complaintRepository.count() > 0) {
            log.info("Seed data already present, skipping seeder");
            return;
        }

        Bureau rb = createBureau("RB", "Regulatory Bureau (illustrative)");
        Bureau pgrc = createBureau("PGRC", "Public Grievance Redressal Cell (illustrative)");

        Institution inst1 = createInstitution("GEC-01", "Government Engineering College", "City A", rb);
        Institution inst2 = createInstitution("IOT-02", "Institute of Technology", "City B", pgrc);
        Institution inst3 = createInstitution("POL-03", "Polytechnic College", "City C", rb);

        createComplaint("GRV-2026-0001", inst1, rb, "FEE", "OVERDUE", "Excess fee charged during admission",
                "Student claims additional fee collected beyond approved structure.", null, 3, true, true, 39);
        createComplaint("GRV-2026-0002", inst1, pgrc, "HOSTEL", "PENDING", "Hostel maintenance issues",
                "Water supply and sanitation concerns in hostel block.", "Officer Kumar", 1, false, false, 23);
        createComplaint("GRV-2026-0003", inst2, rb, "EXAMINATION", "IN_PROGRESS", "Result discrepancy in semester exam",
                "Marks not updated correctly for applied courses.", "Officer Sharma", 0, false, false, 19);
        createComplaint("GRV-2026-0004", inst2, pgrc, "SCHOLARSHIP", "PENDING", "Scholarship disbursement delay",
                "Approved scholarship not credited to account.", null, 2, true, true, 29);
        createComplaint("GRV-2026-0005", inst3, rb, "ADMISSION", "RESOLVED", "Admission eligibility clarification",
                "Query regarding lateral entry eligibility resolved.", "Officer Patel", 1, false, false, 44);
        createComplaint("GRV-2026-0006", inst3, pgrc, "INFRASTRUCTURE", "OVERDUE", "Laboratory equipment shortage",
                "Critical equipment missing affecting practical sessions.", "Officer Singh", 4, false, true, 36);
        createComplaint("GRV-2026-0007", inst1, rb, "FACULTY", "IN_PROGRESS", "Faculty allocation issue",
                "Course sections without assigned faculty.", "Officer Kumar", 0, false, false, 16);
        createComplaint("GRV-2026-0008", inst2, pgrc, "OTHERS", "PENDING", "Transport facility grievance",
                "Bus route coverage inadequate for remote areas.", null, 2, true, true, 26);

        log.info("Seeded 2 bureaus, 3 institutions, 8 complaints (fictional demo data)");
    }

    private Bureau createBureau(String code, String name) {
        Bureau bureau = new Bureau();
        bureau.setId(UUID.randomUUID());
        bureau.setCode(code);
        bureau.setName(name);
        bureau.setCreatedAt(Instant.now());
        bureau.setUpdatedAt(Instant.now());
        return bureauRepository.save(bureau);
    }

    private Institution createInstitution(String code, String name, String location, Bureau bureau) {
        Institution institution = new Institution();
        institution.setId(UUID.randomUUID());
        institution.setCode(code);
        institution.setName(name);
        institution.setLocation(location);
        institution.setBureau(bureau);
        institution.setCreatedAt(Instant.now());
        institution.setUpdatedAt(Instant.now());
        return institutionRepository.save(institution);
    }

    private Complaint createComplaint(String ref, Institution inst, Bureau bureau, String category,
                                      String status, String subject, String desc, String assignedTo,
                                      int transferCount, boolean unassigned, boolean stale, int ageDays) {
        Complaint complaint = new Complaint();
        complaint.setId(UUID.randomUUID());
        complaint.setReferenceId(ref);
        complaint.setInstitution(inst);
        complaint.setBureau(bureau);
        complaint.setCategory(category);
        complaint.setStatus(status);
        complaint.setSubject(subject);
        complaint.setDescription(desc);
        complaint.setAssignedTo(assignedTo);
        complaint.setTransferCount(transferCount);
        complaint.setUnassigned(unassigned);
        complaint.setStale(stale);
        complaint.setAgeDays(ageDays);
        Instant created = Instant.now().minus(ageDays, ChronoUnit.DAYS);
        complaint.setCreatedAt(created);
        complaint.setUpdatedAt(Instant.now());
        complaint.setLastUpdatedAt(Instant.now().minus(1, ChronoUnit.DAYS));
        complaint = complaintRepository.save(complaint);

        if (ref.equals("GRV-2026-0001")) {
            createEvent(complaint, Instant.now().minus(39, ChronoUnit.DAYS), "Student", "REGISTERED", "Complaint submitted via portal.");
            createEvent(complaint, Instant.now().minus(38, ChronoUnit.DAYS), "System", "ASSIGNED_TO_BUREAU", "Routed to RB (illustrative).");
            createEvent(complaint, Instant.now().minus(34, ChronoUnit.DAYS), "RB Officer", "TRANSFERRED", "Transferred for review (repeated transfer).");
            createEvent(complaint, Instant.now().minus(26, ChronoUnit.DAYS), "RB Officer", "TRANSFERRED", "Transferred again due to jurisdiction clarity.");
            createEvent(complaint, Instant.now().minus(14, ChronoUnit.DAYS), "RB Officer", "TRANSFERRED", "Third transfer - awaiting assignment.");
        } else if (ref.equals("GRV-2026-0006")) {
            createEvent(complaint, Instant.now().minus(36, ChronoUnit.DAYS), "Student", "REGISTERED", "Complaint submitted.");
            createEvent(complaint, Instant.now().minus(35, ChronoUnit.DAYS), "System", "ASSIGNED_TO_BUREAU", "Routed to PGRC (illustrative).");
            createEvent(complaint, Instant.now().minus(32, ChronoUnit.DAYS), "PGRC Officer", "TRANSFERRED", "Transferred for technical review.");
            createEvent(complaint, Instant.now().minus(29, ChronoUnit.DAYS), "PGRC Officer", "TRANSFERRED", "Transferred again.");
            createEvent(complaint, Instant.now().minus(24, ChronoUnit.DAYS), "PGRC Officer", "TRANSFERRED", "Third transfer.");
            createEvent(complaint, Instant.now().minus(19, ChronoUnit.DAYS), "PGRC Officer", "TRANSFERRED", "Fourth transfer - case stale.");
        } else {
            createEvent(complaint, created, "Student", "REGISTERED", "Complaint submitted.");
        }
        return complaint;
    }

    private void createEvent(Complaint complaint, Instant ts, String actor, String action, String details) {
        ComplaintEvent event = new ComplaintEvent();
        event.setId(UUID.randomUUID());
        event.setComplaint(complaint);
        event.setEventTimestamp(ts);
        event.setActor(actor);
        event.setAction(action);
        event.setDetails(details);
        event.setCreatedAt(Instant.now());
        complaintEventRepository.save(event);
    }
}
