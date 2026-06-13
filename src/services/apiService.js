import axios from "axios";
import config from "../config";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ← change "token" to match your login's key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================
export const authService = {
  registerDP: (data) => api.post("/registerDp", data),
  register: (data) => api.post("/register", data),
  login: (data) => api.post("/login", data),
  getUser: (userId) => api.get(`/user/${userId}`),
};

// ============================================
// CAMP MANAGER ENDPOINTS
// ============================================
export const campManagerService = {
  getAll: () => api.get("/campmanagers"),
  getAllAuthorized: () => api.get("/allcampmanagers"),
  search: (query) => api.get("/campmanagers/search", { params: { query } }),
  getById: (id) => api.get(`/campmanager/${id}`),
  create: (data) => api.post("/campmanager", data),
  update: (id, data) => api.put(`/campmanager/${id}`, data),
  delete: (id) => api.delete(`/campmanager/${id}`),
};

// ============================================
// CAMP ENDPOINTS
// ============================================
export const campService = {
  getAll: (query) => api.get("/camp", { params: { query } }),
  getAllForRegistration: () => api.get("/campsreg"),
  getAllOtherCamps: () => api.get("/allcamp"),
  getMainCamps: () => api.get("/maincamps"),
  getOtherCamps: () => api.get("/DisCamps"),
  getById: (id) => api.get(`/camp/${id}`),
  getByManager: (managerId) => api.get(`/camp/byManager/${managerId}`),
  create: (formData) =>
    api.post("/camp", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/camp/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/camp/${id}`),
};

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================
export const notificationService = {
  getAll: () => api.get("/notifications"),
  getReceived: () => api.get("/rec-notifications"),
  getSent: () => api.get("/sen-notifications"),
  getById: (id) => api.get(`/notifications/${id}`),
  create: (data) => api.post("/notification", data),
  update: (id, data) => api.put(`/notification/${id}`, data),
  delete: (id) => api.delete(`/notification/${id}`),
};

// ============================================
// DISPLACEMENT ENDPOINTS
// ============================================
export const displacementService = {
  getAll: () => api.get("/displacement"),
  getById: (id) => api.get(`/displacement/${id}`),
  create: (data) => api.post("/displacement", data),
  update: (id, data) => api.put(`/displacement/${id}`, data),
  delete: (id) => api.delete(`/displacement/${id}`),
};

// ============================================
// DISTRIBUTION CRITERIA ENDPOINTS
// ============================================
export const distributionCriteriaService = {
  getAll: (query) => api.get("/distributioncriteria", { params: { query } }),
  getById: (id) => api.get(`/distributioncriteria/${id}`),
  getDPsByCriteria: (id) =>
    api.get(`/distributioncriteria/dps/bycriteria/${id}`),
  create: (data) => api.post("/distributioncriteria", data),
  update: (id, data) => api.put(`/distributioncriteria/${id}`, data),
  delete: (id) => api.delete(`/distributioncriteria/${id}`),
};

// ============================================
// DISTRIBUTION DOCUMENTATION ENDPOINTS
// ============================================
export const distributionDocService = {
  getWithReliefs: () => api.get("/DocswithReliefs"),
  getById: (id) => api.get(`/distributiondocumentation/${id}`),
  create: (formData) =>
    api.post("/distributiondocumentation", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) => api.put(`/distributiondocumentation/${id}`, data),
  delete: (id) => api.delete(`/distributiondocumentation/${id}`),
};

// ============================================
// DPs (DISPLACED PERSONS) ENDPOINTS
// ============================================
export const dpService = {
  getAll: () => api.get("/dps"),
  searchParent: (query) => api.get("/parentdps/search", { params: { query } }),
  getByCamp: (campId) => api.get(`/dps/byCamp/${campId}`),
  getByIdentification: (identificationNumber) =>
    api.get(`/dps/by-identification/${identificationNumber}`),
  getByIdentification2: (identificationNumber) =>
    api.get(`/dps/byidentification2/${identificationNumber}`),
  getById: (id) => api.get(`/dps/${id}`),
  getByIdentity: (identityNo) => api.get(`/dps/byidentity/${identityNo}`),
  getByIdentityRegistration: (identityNo) =>
    api.get(`/dps/byidentityreg/${identityNo}`),
  getParents: () => api.get("/parentdps"),
  createFromFlutter: (data) => api.post("/dpsfluuter", data),
  create: (data) => api.post("/dps", data),
  update: (id, data) => api.put(`/dps/${id}`, data),
  delete: (id) => api.delete(`/dps/${id}`),
  deleteByIdentification: (identificationNumber) =>
    api.delete(`/dps/by-identification/${identificationNumber}`),
};

// ============================================
// DPs HEALTH ISSUES ENDPOINTS
// ============================================
export const dpsHealthIssuesService = {
  getAll: () => api.get("/dpshealthissues"),
  getById: (id) => api.get(`/dpshealthissues/${id}`),
  create: (data) => api.post("/dpshealthissues", data),
  update: (id, data) => api.put(`/dpshealthissues/${id}`, data),
  delete: (id) => api.delete(`/dpshealthissues/${id}`),
};

// ============================================
// DPs RELIEF ENDPOINTS
// ============================================
export const dpsReliefService = {
  getAll: () => api.get("/dpsreleif"),
  getById: (id) => api.get(`/dpsreleif/${id}`),
  create: (data) => api.post("/dpsreleif", data),
  update: (id, data) => api.put(`/dpsreleif/${id}`, data),
  delete: (id) => api.delete(`/dpsreleif/${id}`),
};

// ============================================
// HEALTH ISSUES ENDPOINTS
// ============================================
export const healthIssuesService = {
  getAll: (query) => api.get("/healthisuues", { params: { query } }),
  getById: (id) => api.get(`/healthisuues/${id}`),
  create: (data) => api.post("/healthisuues", data),
  update: (id, data) => api.put(`/healthisuues/${id}`, data),
  delete: (id) => api.delete(`/healthisuues/${id}`),
};

// ============================================
// ITEM ENDPOINTS
// ============================================
export const itemService = {
  getAll: (query) => api.get("/item", { params: { query } }),
  getById: (id) => api.get(`/item/${id}`),
  create: (data) => api.post("/item", data),
  update: (id, data) => api.put(`/item/${id}`, data),
  delete: (id) => api.delete(`/item/${id}`),
};

// ============================================
// ORGANIZATION ENDPOINTS
// ============================================
export const organizationService = {
  getAll: (query) => api.get("/organization", { params: { query } }),
  getAllPublic: () => api.get("/allorganization"),
  getById: (id) => api.get(`/organization/${id}`),
  getByManager: (managerId) => api.get(`/organization/bymanager/${managerId}`),
  create: (formData) =>
    api.post("/organization", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/organization/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/organization/${id}`),
};

// ============================================
// ORGANIZATION MANAGER ENDPOINTS
// ============================================
export const organizationManagerService = {
  getAll: () => api.get("/organizationmanager"),
  getById: (id) => api.get(`/organizationmanager/${id}`),
  create: (data) => api.post("/organizationmanager", data),
  update: (id, data) => api.put(`/organizationmanager/${id}`, data),
  delete: (id) => api.delete(`/organizationmanager/${id}`),
};

// ============================================
// RELIEF REQUEST ENDPOINTS
// ============================================
export const reliefRequestService = {
  getAll: () => api.get("/reliefrequest"),
  getByOrg: (orgId) => api.get(`/reliefrequests/org/${orgId}`),
  getById: (id) => api.get(`/reliefrequest/${id}`),
  getForCharts: () => api.get("/api/reliefrequestsforcharts"),
  create: (data) => api.post("/reliefrequest", data),
  update: (id, data) => api.put(`/reliefrequest/${id}`, data),
  delete: (id) => api.delete(`/reliefrequest/${id}`),
};

// ============================================
// RELIEF TRACKING ENDPOINTS
// ============================================
export const reliefTrackingService = {
  getAll: () => api.get("/relieftracking"),
  getById: (id) => api.get(`/relieftracking/${id}`),
  create: (data) => api.post("/relieftracking", data),
  update: (id, data) => api.put(`/relieftracking/${id}`, data),
  delete: (id) => api.delete(`/relieftracking/${id}`),
};

// ============================================
// RELIEF REGISTER ENDPOINTS
// ============================================
export const reliefRegisterService = {
  getAll: (query) => api.get("/reliefregister", { params: { query } }),
  getForCharts: () => api.get("/reliefscharts"),
  getById: (id) => api.get(`/reliefregister/${id}`),
  getByCamp: (campId) => api.get(`/relief/bycamp/${campId}`),
  getByOrgManager: (orgManagerId) =>
    api.get(`/relief/byorgmanager/${orgManagerId}`),
  create: (data) => api.post("/reliefregister", data),
  update: (id, data) => api.put(`/reliefregister/${id}`, data),
  confirm: (id, isReceived) =>
    api.put(`/Confirmreliefregister/${id}`, isReceived),
  delete: (id) => api.delete(`/reliefregister/${id}`),
};

// ============================================
// SYSTEM MANAGER ENDPOINTS
// ============================================
export const systemManagerService = {
  getAll: () => api.get("/systemmanager"),
  getById: (id) => api.get(`/systemmanager/${id}`),
  create: (data) => api.post("/systemmanager", data),
  update: (id, data) => api.put(`/systemmanager/${id}`, data),
  delete: (id) => api.delete(`/systemmanager/${id}`),
};

// ============================================
// ANNOUNCEMENTS ENDPOINTS
// ============================================
export const announcementService = {
  getAll: () => api.get("/announcments"),
  getById: (id) => api.get(`/announcments/${id}`),
  getByType: (type) => api.get("/announcments/byType", { params: { type } }),
  createOrg: (formData) =>
    api.post("/organnouncments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  createCamp: (formData) =>
    api.post("/campannouncments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    api.put(`/announcments/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/announcment/${id}`),
};

// ============================================
// RELIEF MIN ENDPOINTS
// ============================================
export const reliefMinService = {
  getAll: () => api.get("/reliefmin"),
  getById: (id) => api.get(`/reliefmin/${id}`),
  getByDp: (dpId) => api.get(`/reliefmin/byDp/${dpId}`),
  create: (data) => api.post("/reliefmin", data),
  update: (id, data) => api.put(`/reliefmin/${id}`, data),
  delete: (id) => api.delete(`/reliefmin/${id}`),
};

export default api;
