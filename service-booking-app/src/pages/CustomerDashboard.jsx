import React, { useState, useEffect } from "react";
import { getStoredBookings, saveReview } from "../utils/storage";
import { Clock, CheckCircle2, AlertCircle, Star, User } from "lucide-react";

export const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Fetch logged-in user and isolated bookings on mount
  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentUser(parsed);
        } catch (e) {
          console.error("Failed to parse currentUser from storage", e);
        }
      }
      setBookings(getStoredBookings());
    };

    loadUserData();

    // Listen for storage changes in case account switches in another tab/window
    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, []);

  const handleReviewSubmit = (bookingId) => {
    if (!reviewText.trim()) {
      alert("Please enter review text before submitting.");
      return;
    }
    const updated = saveReview(bookingId, rating, reviewText);
    setBookings(updated);
    setReviewingId(null);
    setReviewText("");
    alert("Thank you! Your review has been saved.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header with Account Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Service Requests</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your ongoing bookings, emergency responses, and leave provider reviews.
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center space-x-2 bg-slate-900 px-3.5 py-2 border border-slate-800 rounded-xl text-xs text-slate-300">
            <User className="w-4 h-4 text-indigo-400" />
            <span>
              Logged in as:{" "}
              <strong className="text-white">
                {currentUser.email || currentUser.name || "User"}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 text-slate-400">
            <p className="text-sm font-medium">No active service requests found.</p>
            <p className="text-xs text-slate-500 mt-1">
              Book a provider from the Home page to see live updates here.
            </p>
          </div>
        ) : (
          bookings.map((item) => (
            <div
              key={item.id}
              className="p-5 glass-card rounded-2xl flex flex-col space-y-4 border border-slate-800 bg-slate-900/60"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-base">
                      {item.providerName || "Service Provider"}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {item.category || "General"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        item.urgency === "Emergency / Immediate"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : item.urgency === "High"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-indigo-500/20 text-indigo-300"
                      }`}
                    >
                      {item.urgency || "Normal"}
                    </span>
                  </div>

                  {/* Updated Description Line with Key Fallbacks */}
                  <p className="text-sm text-slate-300">
                    {item.notes ||
                      item.description ||
                      item.issueDescription ||
                      item.details ||
                      "No description provided."}
                  </p>

                  {/* Status Indicator Notification Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {item.status === "Pending" && (
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        Status: Request Pending Provider Acceptance
                      </span>
                    )}

                    {item.status === "In Progress" && (
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                        Status: Service Currently In Progress
                      </span>
                    )}

                    {item.status === "Completed" && (
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Status: Service Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Action / Review Form Launcher */}
                <div className="flex items-center">
                  {item.status === "Completed" && !item.isReviewed && (
                    <button
                      onClick={() =>
                        setReviewingId(reviewingId === item.id ? null : item.id)
                      }
                      className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                    >
                      <Star className="w-4 h-4 mr-1.5 fill-current" />
                      Write Review
                    </button>
                  )}

                  {item.isReviewed && (
                    <span className="text-xs text-amber-400 font-semibold flex items-center bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 mr-1 fill-current text-amber-400" />
                      Review Submitted ({item.review?.rating}★)
                    </span>
                  )}
                </div>
              </div>

              {/* Collapsible Inline Review Form */}
              {reviewingId === item.id && (
                <div className="w-full mt-2 p-4 border border-slate-700 bg-slate-950 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-white">
                    Rate Your Experience with {item.providerName}
                  </h3>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-xl transition-colors ${
                          star <= rating ? "text-amber-400" : "text-slate-600"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Provide feedback on service timing, quality, and professionalism..."
                    rows={2}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReviewSubmit(item.id)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg font-bold transition-all"
                    >
                      Submit Review
                    </button>
                    <button
                      onClick={() => setReviewingId(null)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};