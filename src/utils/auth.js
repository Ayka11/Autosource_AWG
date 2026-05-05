const AUTH_TOKEN_KEY = "oauth_token";
const USER_NAME_KEY = "username";
const USER_EMAIL_KEY = "useremail";
const USER_PHOTO_KEY = "userphoto";
const USER_FIRSTNAME_KEY = "user_firstname";
const USER_LASTNAME_KEY = "user_lastname";
const USER_USERNAME_KEY = "user_username";
const REGISTERED_EMAILS_KEY = "registered_user_emails";
const USER_PROFILES_KEY = "user_profiles_by_email";

const AUTH_CHANGED_EVENT = "authChanged";

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

export const decodeGoogleCredential = (credential) => {
  if (!credential) {
    return null;
  }
  const parts = credential.split(".");
  if (parts.length < 2) {
    return null;
  }
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const readRegisteredSet = () => {
  try {
    const raw = localStorage.getItem(REGISTERED_EMAILS_KEY);
    if (!raw) {
      return new Set();
    }
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.map(normalizeEmail).filter(Boolean) : []);
  } catch {
    return new Set();
  }
};

export const isRegisteredUser = (email) => {
  const n = normalizeEmail(email);
  if (!n) {
    return false;
  }
  return readRegisteredSet().has(n);
};

export const registerUser = (email) => {
  const n = normalizeEmail(email);
  if (!n) {
    return;
  }
  const set = readRegisteredSet();
  if (set.has(n)) {
    return;
  }
  set.add(n);
  localStorage.setItem(REGISTERED_EMAILS_KEY, JSON.stringify([...set]));
};

const readProfilesMap = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILES_KEY);
    if (!raw) {
      return {};
    }
    const map = JSON.parse(raw);
    return map && typeof map === "object" ? map : {};
  } catch {
    return {};
  }
};

export const saveUserProfile = (email, { firstName, lastName, userName }) => {
  const n = normalizeEmail(email);
  if (!n) {
    return;
  }
  const map = readProfilesMap();
  map[n] = {
    firstName: (firstName || "").trim(),
    lastName: (lastName || "").trim(),
    userName: (userName || "").trim(),
  };
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(map));
};

export const isUsernameTaken = (userName, exceptEmail) => {
  const un = (userName || "").trim().toLowerCase();
  if (!un) {
    return false;
  }
  const except = normalizeEmail(exceptEmail);
  const map = readProfilesMap();
  for (const [email, profile] of Object.entries(map)) {
    if (normalizeEmail(email) === except) {
      continue;
    }
    if ((profile?.userName || "").trim().toLowerCase() === un) {
      return true;
    }
  }
  return false;
};

export const getUserProfile = (email) => {
  const n = normalizeEmail(email);
  if (!n) {
    return null;
  }
  const map = readProfilesMap();
  return map[n] || null;
};

export const buildSessionFromGoogleLogin = (idToken, payload) => {
  if (!payload?.email) {
    return null;
  }
  const stored = getUserProfile(payload.email);
  const firstName = (stored?.firstName || payload.given_name || "").trim();
  const lastName = (stored?.lastName || payload.family_name || "").trim();
  const userName = (stored?.userName || "").trim();
  const name =
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    payload.name ||
    "";
  return {
    token: idToken,
    email: payload.email,
    photo: payload.picture || "",
    firstName,
    lastName,
    userName,
    name,
  };
};

export const ensureRegisteredForCurrentSession = () => {
  const session = {
    token: localStorage.getItem(AUTH_TOKEN_KEY) || "",
    email: localStorage.getItem(USER_EMAIL_KEY) || "",
  };
  if (session.token && session.email && !isRegisteredUser(session.email)) {
    registerUser(session.email);
  }
};

export const getAuthSession = () => ({
  token: localStorage.getItem(AUTH_TOKEN_KEY) || "",
  name: localStorage.getItem(USER_NAME_KEY) || "",
  email: localStorage.getItem(USER_EMAIL_KEY) || "",
  photo: localStorage.getItem(USER_PHOTO_KEY) || "",
  firstName: localStorage.getItem(USER_FIRSTNAME_KEY) || "",
  lastName: localStorage.getItem(USER_LASTNAME_KEY) || "",
  userName: localStorage.getItem(USER_USERNAME_KEY) || "",
});

export const isAuthenticated = () => Boolean(getAuthSession().token);

export const setAuthSession = ({
  token,
  name,
  email,
  photo,
  firstName,
  lastName,
  userName,
}) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token || "");
  localStorage.setItem(USER_NAME_KEY, name || "");
  localStorage.setItem(USER_EMAIL_KEY, email || "");
  localStorage.setItem(USER_PHOTO_KEY, photo || "");
  if (firstName !== undefined) {
    localStorage.setItem(USER_FIRSTNAME_KEY, firstName || "");
  }
  if (lastName !== undefined) {
    localStorage.setItem(USER_LASTNAME_KEY, lastName || "");
  }
  if (userName !== undefined) {
    localStorage.setItem(USER_USERNAME_KEY, userName || "");
  }
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_PHOTO_KEY);
  localStorage.removeItem(USER_FIRSTNAME_KEY);
  localStorage.removeItem(USER_LASTNAME_KEY);
  localStorage.removeItem(USER_USERNAME_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const AUTH_EVENTS = {
  changed: AUTH_CHANGED_EVENT,
};
