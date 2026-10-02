import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is missing. Add it to android-user/.env and restart Expo."
  );
}

export type RegistrationInput = {
  fullName: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  state: string;
  district: string;
  pinCode: string;
  emergencyContact: string;
  income?: string;
  rationCard?: string;
  insurance?: string;
  dependents?: string;
  occupation?: string;
  password: string;
  confirmPassword: string;
};

type ApiResponse = {
  message?: string;
  data?: {
    token?: string;
    profileComplete?: boolean;
    user?: Profile;
    challengeId?: string;
    expiresInSeconds?: number;
  };
};

let profileCache: Profile | null = null;

const textValue = (value: unknown) => (typeof value === "string" ? value : undefined);

const normalizeProfile = (user: Profile): Profile => ({
  ...user,
  fullName: textValue(user.fullName) || textValue(user.full_name),
  dateOfBirth: dateOnly(textValue(user.dateOfBirth) || textValue(user.date_of_birth)),
  pinCode: textValue(user.pinCode) || textValue(user.pin_code),
  emergencyContact: textValue(user.emergencyContact) || textValue(user.emergency_contact),
  profileImageUrl: textValue(user.profileImageUrl) || textValue(user.profile_image_url),
  bloodGroup: textValue(user.bloodGroup) || textValue(user.blood_group),
  medicalStage: textValue(user.medicalStage) || textValue(user.medical_stage),
  documentMetadata: user.documentMetadata || user.document_metadata || [],
});

const request = async (path: string, body: object): Promise<ApiResponse> => {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Make sure the backend is running and the device is on the same network."
    );
  }

  let payload: ApiResponse;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response");
  }
  if (!response.ok) throw new Error(payload.message || "Request failed");
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = payload.data;
    if (data?.token) {
      await AsyncStorage.setItem("auth_token", data.token);
      profileCache = data.user ? normalizeProfile(data.user) : null;
    }
  }
  return payload;
};

export const register = (input: RegistrationInput) => request("/auth/register", input);
export const login = (identifier: string, password: string) =>
  request("/auth/login", { identifier, password });

export const requestPasswordResetOtp = (identifier: string) =>
  request("/auth/password-reset/request", { identifier });
export const verifyPasswordResetOtp = (challengeId: string, code: string) =>
  request("/auth/password-reset/verify", { challengeId, code });
export const changeForgottenPassword = (challengeId: string, code: string, password: string) =>
  request("/auth/password-reset/change", { challengeId, code, password });

const catalogCache = new Map<string, unknown[]>();
const catalogRequests = new Map<string, Promise<unknown[]>>();

const catalogRequest = async <T>(path: string, key: string): Promise<T[]> => {
  const cached = catalogCache.get(path);
  if (cached) return cached as T[];

  const pending = catalogRequests.get(path);
  if (pending) return (await pending) as T[];

  const requestPromise = (async () => {
    const response = await fetch(`${API_URL}${path}`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Unable to load catalogue");
    const items = payload.data?.[key] || [];
    catalogCache.set(path, items);
    return items;
  })();
  catalogRequests.set(path, requestPromise);
  try {
    return (await requestPromise) as T[];
  } finally {
    catalogRequests.delete(path);
  }
};

export const getHospitals = () => catalogRequest<Record<string, unknown>>("/catalog/hospitals", "hospitals");
export const getAssistancePrograms = () =>
  catalogRequest<Record<string, unknown>>("/catalog/assistance", "assistance");
export type CatalogOptions = {
  income: string[];
  rationCard: string[];
  insurance: string[];
  gender: string[];
  cancerStage: string[];
};
export const getCatalogOptions = async (): Promise<CatalogOptions> => {
  const cached = catalogCache.get("/catalog/options");
  if (cached) return cached[0] as CatalogOptions;
  const pending = catalogRequests.get("/catalog/options");
  if (pending) return (await pending)[0] as CatalogOptions;

  const requestPromise = (async () => {
    const response = await fetch(`${API_URL}/catalog/options`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Unable to load options");
    const options = payload.data?.options || { income: [], rationCard: [], insurance: [], gender: [], cancerStage: [] };
    catalogCache.set("/catalog/options", [options]);
    return [options];
  })();
  catalogRequests.set("/catalog/options", requestPromise);
  try {
    return (await requestPromise)[0] as CatalogOptions;
  } finally {
    catalogRequests.delete("/catalog/options");
  }
};

export const clearCatalogCache = () => {
  catalogCache.clear();
};

export type Profile = Record<string, unknown> & {
  fullName?: string;
  full_name?: string;
  email?: string;
  mobile?: string;
  blood_group?: string;
  bloodGroup?: string;
  medical_stage?: string;
  medicalStage?: string;
  profile_image_url?: string;
  profileImageUrl?: string;
  document_metadata?: Array<string | DocumentMetadata>;
  documentMetadata?: Array<string | DocumentMetadata>;
};

export type DocumentMetadata = {
  key: string;
  name: string;
  mimeType?: string;
  size?: number;
  category?: string;
  createdAt?: string;
};

const dateOnly = (value?: string) => {
  if (!value) return undefined;
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : value;
};

export const getCachedProfile = () => profileCache;

export const getProfile = async (options: { force?: boolean } = {}): Promise<Profile> => {
  if (profileCache && !options.force) return profileCache;
  const token = await AsyncStorage.getItem("auth_token");
  if (!token) throw new Error("Please log in before loading your profile.");
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: "Bearer " + token },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Unable to load your profile");
  const user = payload.data?.user || payload.data || payload;
  profileCache = normalizeProfile(user);
  return profileCache!;
};

export const invalidateProfileCache = () => {
  profileCache = null;
};

export const updateProfileImage = async (key: string) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (!token) throw new Error("Please log in before updating your profile photo.");
  const response = await fetch(`${API_URL}/auth/profile/image`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ key }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Unable to save profile photo");
  const user = payload.data?.user || payload.data || payload;
  if (!user || typeof user !== "object") {
    throw new Error("The server did not return the updated profile photo");
  }
  profileCache = normalizeProfile(user as Profile);
  return profileCache;
};

export const requestContactChangeOtp = (changeType: "mobile" | "email", newValue: string) =>
  request("/auth/contact-change/request", { changeType, newValue });

export const verifyContactChangeOtp = (
  challengeId: string,
  currentCode: string,
  newCode?: string
) => request("/auth/contact-change/verify", { challengeId, currentCode, newCode });

export const updateProfile = async (body: Record<string, unknown>) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (!token) throw new Error("Please log in before updating your profile.");
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Unable to update your profile");
  invalidateProfileCache();
  const user = payload.data?.user || payload.data || payload;
  if (user && typeof user === "object") {
    profileCache = normalizeProfile(user as Profile);
  }
  return user;
};

export const getDocumentUrl = async (key: string) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (!token) throw new Error("Please log in before viewing documents.");
  const response = await fetch(`${API_URL}/storage/download?key=${encodeURIComponent(key)}`, {
    headers: { Authorization: "Bearer " + token },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Unable to open document");
  return payload.data.downloadUrl as string;
};

export const saveExpoPushToken = async (expoPushToken: string) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (!token) throw new Error("Please log in before registering notifications.");
  const response = await fetch(`${API_URL}/notifications/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify({ token: expoPushToken, platform: Platform.OS }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Unable to save notification token");
  return payload.data?.user || payload.data || payload;
};

export const completeRegistration = async (body: RegistrationInput & { documentMetadata: string[] }) => {
  const result = await request("/auth/complete-registration", body);
  invalidateProfileCache();
  return result;
};

export const uploadFile = async (
  file: { uri: string; name: string; mimeType?: string },
  category: "document" | "profile"
) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (!token) throw new Error("Please log in before uploading files.");

  const presignResponse = await fetch(`${API_URL}/storage/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.mimeType || "application/octet-stream",
      category,
    }),
  });
  const presignPayload = await presignResponse.json();
  if (!presignResponse.ok) {
    throw new Error(presignPayload.message || "Unable to prepare file upload");
  }

  const uploadUrl = presignPayload.data?.uploadUrl;
  if (typeof uploadUrl !== "string" || !uploadUrl) {
    throw new Error("The server did not return an image upload URL");
  }
  const contentType = file.mimeType || "application/octet-stream";
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      reject(new Error(`File upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Unable to upload the image. Check your network connection."));
    xhr.ontimeout = () => reject(new Error("Image upload timed out. Please try again."));
    xhr.timeout = 60_000;
    xhr.send({ uri: file.uri, type: contentType, name: file.name } as unknown as XMLHttpRequestBodyInit);
  });

  return { key: presignPayload.data.key };
};
