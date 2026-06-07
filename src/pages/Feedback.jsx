import React, { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import { 
  FiStar, 
  FiMessageSquare, 
  FiSearch, 
  FiFilter, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiX, 
  FiSave,
  FiSend,
  FiCornerDownRight
} from "react-icons/fi";
import { getCRMData, saveCRMData } from "../lib/crmData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Feedback = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Dialog state
  const [activeReview, setActiveReview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Refs
  const replyTextareaRef = useRef(null);

  useEffect(() => {
    const db = getCRMData();
    setReviews(db.reviews);
  }, []);

  // Auto-focus reply textarea when dialog opens
  useEffect(() => {
    if (isDialogOpen && replyTextareaRef.current) {
      setTimeout(() => replyTextareaRef.current.focus(), 150);
    }
  }, [isDialogOpen]);

  // Statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";
  const positiveCount = reviews.filter(r => r.sentiment === "Positive").length;
  const neutralCount = reviews.filter(r => r.sentiment === "Neutral").length;
  const negativeCount = reviews.filter(r => r.sentiment === "Negative").length;

  // Filter
  const filteredReviews = reviews.filter(rev => {
    const matchesSearch = 
      rev.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSentiment = filterSentiment === "All" || rev.sentiment === filterSentiment;
    const matchesStatus = filterStatus === "All" || rev.status === filterStatus;

    return matchesSearch && matchesSentiment && matchesStatus;
  });

  const openReplyDialog = (rev) => {
    setActiveReview(rev);
    setReplyText(rev.adminReply || "");
    setIsDialogOpen(true);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();

    const updatedReviews = reviews.map(r => {
      if (r.id === activeReview.id) {
        return {
          ...r,
          adminReply: replyText,
          status: "Approved" // Auto-approve once responded
        };
      }
      return r;
    });

    setReviews(updatedReviews);

    const db = getCRMData();
    db.reviews = updatedReviews;
    saveCRMData(db);

    setIsDialogOpen(false);
    setActiveReview(null);
    setReplyText("");
    alert(`Success! Response sent to ${activeReview.customerName}.`);
  };

  const updateReviewStatus = (id, newStatus) => {
    const updatedReviews = reviews.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus };
      }
      return r;
    });

    setReviews(updatedReviews);

    const db = getCRMData();
    db.reviews = updatedReviews;
    saveCRMData(db);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins text-[#262626]">
      <PageHeader title="Feedback & Review Directory" breadcrumb={["CRM", "Feedback"]} />

      {/* 1. RATING AND SENTIMENT STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 mb-8">
        
        {/* Rating Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm text-center md:text-left md:flex items-center gap-5">
          <div className="mx-auto md:mx-0 w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
            <FiStar className="fill-amber-500" size={28} />
          </div>
          <div className="mt-3 md:mt-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Average Rating</p>
            <h3 className="text-3xl font-bold text-[#262626] mt-0.5">{avgRating} / 5.0</h3>
          </div>
        </div>

        {/* Positive Sentiment */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><FiCheckCircle size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Positive sentiment</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">{positiveCount} Reviews</h3>
          </div>
        </div>

        {/* Neutral Sentiment */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-gray-100 text-gray-500 rounded-2xl"><FiMessageSquare size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Neutral sentiment</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-0.5">{neutralCount} Reviews</h3>
          </div>
        </div>

        {/* Spam / Flagged */}
        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl"><FiAlertTriangle size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Flagged Spam</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-0.5">{reviews.filter(r => r.status === "Spam").length} Reviews</h3>
          </div>
        </div>

      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        
        {/* Search */}
        <div className="relative flex-grow">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40" />
          <input 
            type="text" 
            placeholder="Search review ID, username, keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-[#F3F3F3] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#4F5C18]/20 text-sm font-medium transition-all"
          />
        </div>

        {/* Sentiment Filter */}
        <select 
          value={filterSentiment}
          onChange={(e) => setFilterSentiment(e.target.value)}
          className="px-6 py-4 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
        >
          <option value="All">All Sentiment</option>
          <option value="Positive">Positive Only</option>
          <option value="Neutral">Neutral Only</option>
          <option value="Negative">Negative Only</option>
        </select>

        {/* Approval Status Filter */}
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-6 py-4 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Spam">Spam</option>
        </select>
      </div>

      {/* 3. REVIEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-[2rem] p-8 border border-[#F3F3F3] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              
              {/* Header profile & rating */}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-[#4F5C18]/10">
                      <AvatarFallback className="bg-[#4F5C18] text-white text-xs font-bold">{rev.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-[#262626] leading-none mb-1">{rev.customerName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">{rev.id} • {rev.date}</p>
                    </div>
                  </div>
                  
                  {/* Sentiment Badge */}
                  <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    rev.sentiment === "Positive" ? "bg-emerald-50 text-emerald-600" :
                    rev.sentiment === "Neutral" ? "bg-slate-50 text-slate-500" : "bg-rose-50 text-rose-600"
                  }`}>
                    {rev.sentiment}
                  </span>
                </div>

                {/* Star Ratings */}
                <div className="flex gap-0.5 text-amber-400 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className={i < rev.rating ? "fill-amber-400" : ""} size={14} />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Admin Response block if exists */}
                {rev.adminReply && (
                  <div className="mt-6 p-4 bg-[#F3F3F3]/50 rounded-2xl border border-[#F3F3F3]/80 flex gap-3">
                    <FiCornerDownRight className="text-[#4F5C18] mt-1 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#4F5C18] mb-1">Response from Admin</p>
                      <p className="text-xs text-[#262626] font-medium leading-relaxed">
                        {rev.adminReply}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-8 pt-4 border-t border-[#F3F3F3] flex justify-between items-center">
                
                {/* Status Toggle badges */}
                <div className="flex gap-1">
                  <button 
                    onClick={() => updateReviewStatus(rev.id, "Approved")}
                    className={`text-[8px] font-black uppercase px-2.5 py-1 rounded transition-colors ${
                      rev.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-50 text-gray-400 border border-transparent hover:bg-gray-100"
                    }`}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => updateReviewStatus(rev.id, "Spam")}
                    className={`text-[8px] font-black uppercase px-2.5 py-1 rounded transition-colors ${
                      rev.status === "Spam" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-gray-50 text-gray-400 border border-transparent hover:bg-gray-100"
                    }`}
                  >
                    Flag Spam
                  </button>
                </div>

                {/* Reply action trigger */}
                <button 
                  onClick={() => openReplyDialog(rev)}
                  className="px-4 py-2 bg-[#F3F3F3] text-gray-500 hover:bg-[#4F5C18] hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  {rev.adminReply ? "Edit Response" : "Respond"}
                </button>

              </div>

            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 bg-white rounded-[2rem] border border-[#F3F3F3] text-gray-400 italic">
            No feedback entries matches the query.
          </div>
        )}
      </div>

      {/* 4. REPLY DIALOG POPUP */}
      {isDialogOpen && activeReview && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-playfair font-bold text-2xl text-[#262626]">Respond to Review</h3>
              <button onClick={() => { setIsDialogOpen(false); setActiveReview(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-6">
              <div className="p-4 bg-[#F3F3F3]/40 rounded-2xl border border-[#F3F3F3]/60 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] mb-1">{activeReview.customerName} wrote:</p>
                <p className="text-xs text-gray-600 italic">"{activeReview.comment}"</p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Your Response Message</label>
                <textarea 
                  ref={replyTextareaRef}
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm leading-relaxed resize-none focus:ring-2 focus:ring-[#4F5C18]/20"
                  placeholder="Thank you for your review. We are delighted you like our product..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>

              <button type="submit" className="w-full bg-[#4F5C18] text-white py-4.5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4F5C18]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <FiSend /> Send Response
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Feedback;
