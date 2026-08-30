import { INITIAL_PROVIDERS } from "../mock/mockData";

const STORAGE_KEYS = {
  BOOKINGS_PREFIX: "app_bookings_",
  PROVIDERS: "app_providers_v1",
  CURRENT_USER: "currentUser", // Key where logged-in user details are stored
};

// Helper function to resolve the active user's unique storage key
const getActiveUserBookingKey = () => {
  try {
    const userObj = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userObj) {
      const parsed = JSON.parse(userObj);
      const userIdentifier = parsed.email || parsed.id || parsed.username;
      if (userIdentifier) {
        return `${STORAGE_KEYS.BOOKINGS_PREFIX}${userIdentifier}`;
      }
    }
  } catch (err) {
    console.error("Error reading current user from storage:", err);
  }
  return `${STORAGE_KEYS.BOOKINGS_PREFIX}default_v1`;
};

// Get bookings isolated to the logged-in user/Gmail
export const getStoredBookings = () => {
  const key = getActiveUserBookingKey();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Save a booking under the logged-in account's key
export const saveBooking = (bookingData) => {
  const key = getActiveUserBookingKey();
  const bookings = getStoredBookings();
  
  const newBooking = {
    id: `req_${Date.now()}`,
    customerName: bookingData.customerName || "Mariam",
    providerName: bookingData.providerName || "Service Specialist",
    category: bookingData.category || "General",
    urgency: bookingData.urgency || "Normal",
    notes: bookingData.notes || "",
    status: "Pending",
    createdAt: new Date().toISOString(),
    ...bookingData,
  };

  const updated = [newBooking, ...bookings];
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

// Update status of a booking for the current user
export const updateBookingStatus = (bookingId, newStatus) => {
  const key = getActiveUserBookingKey();
  const bookings = getStoredBookings();
  const updated = bookings.map((b) =>
    b.id === bookingId ? { ...b, status: newStatus } : b
  );
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

// Save review for a completed booking under the logged-in user
export const saveReview = (bookingId, rating, reviewText) => {
  const key = getActiveUserBookingKey();
  const bookings = getStoredBookings();
  const updated = bookings.map((b) => {
    if (b.id === bookingId) {
      return {
        ...b,
        isReviewed: true,
        review: { rating, text: reviewText, createdAt: new Date().toISOString() },
      };
    }
    return b;
  });
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

// Get shared providers list
export const getStoredProviders = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
    return INITIAL_PROVIDERS;
  }
  return JSON.parse(data);
};