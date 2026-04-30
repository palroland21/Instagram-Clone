package utcn.ac.backendadmin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import utcn.ac.backendadmin.model.AdminActionLog;

public interface AdminActionLogRepository extends JpaRepository<AdminActionLog, Long> {
}