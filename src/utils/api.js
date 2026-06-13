// This file is maintained for backward compatibility
// Import all API services from the centralized apiService
import apiInstance from "../services/apiService";
export {
  authService,
  campManagerService,
  campService,
  notificationService,
  displacementService,
  distributionCriteriaService,
  distributionDocService,
  dpService,
  dpsHealthIssuesService,
  dpsReliefService,
  healthIssuesService,
  itemService,
  organizationService,
  organizationManagerService,
  reliefRequestService,
  reliefTrackingService,
  reliefRegisterService,
  systemManagerService,
  announcementService,
  reliefMinService,
} from "../services/apiService";

export default apiInstance;
