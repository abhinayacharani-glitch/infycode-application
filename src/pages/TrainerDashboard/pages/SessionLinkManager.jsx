import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  Save,
  Video,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SessionLinkManager = () => {
  const [sessionData, setSessionData] = useState({
    meetingLink: '',
    startTime: '',
    endTime: '',
    status: 'Upcoming' // Upcoming, Live, Completed
  });

  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Session Data Saved:', sessionData);
    // Add success toast or notification logic here if needed
    alert('Session details saved successfully (Console log)!');
  };

  const handleCopyLink = () => {
    if (sessionData.meetingLink) {
      navigator.clipboard.writeText(sessionData.meetingLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleJoinNow = () => {
    if (sessionData.meetingLink) {
      window.open(sessionData.meetingLink, '_blank', 'noopener,noreferrer');
    } else {
      alert('Please provide a meeting link first!');
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Live Session Manager</h1>
          <p className="text-slate-500 mt-1">Configure and manage your virtual classroom links</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold flex items-center gap-2 ${getStatusStyles(sessionData.status)}`}>
          {sessionData.status === 'Live' && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          )}
          {sessionData.status}
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-[1px] shadow-2xl transition-all duration-300 hover:shadow-blue-200/50">
        <div className="relative flex flex-col md:flex-row items-center gap-8 bg-white/90 backdrop-blur-xl p-8 rounded-[23px]">

          {/* Main Content Side */}
          <div className="flex-1 w-full space-y-6">
            <div className="space-y-4">
              <div className="group/input">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Meeting Link</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                    <LinkIcon size={18} />
                  </div>
                  <input
                    type="url"
                    name="meetingLink"
                    value={sessionData.meetingLink}
                    onChange={handleInputChange}
                    placeholder="Paste Google Meet / Teams link"
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group/input">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Start Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                      <Clock size={18} />
                    </div>
                    <input
                      type="time"
                      name="startTime"
                      value={sessionData.startTime}
                      onChange={handleInputChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="group/input">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">End Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                      <Clock size={18} />
                    </div>
                    <input
                      type="time"
                      name="endTime"
                      value={sessionData.endTime}
                      onChange={handleInputChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={handleSave}
                className="flex-1 min-w-[140px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Save size={19} />
                Save Details
              </button>

              <button
                onClick={handleJoinNow}
                className="flex-1 min-w-[140px] bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-blue-600 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ExternalLink size={19} />
                Join Now
              </button>

              <button
                onClick={handleCopyLink}
                title="Copy Link"
                className={`p-3.5 rounded-2xl transition-all border-2 active:scale-95 ${copySuccess
                  ? 'bg-green-50 border-green-200 text-green-600'
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-blue-500 hover:border-blue-100 hover:bg-white'
                  }`}
              >
                {copySuccess ? <CheckCircle2 size={22} /> : <Copy size={22} />}
              </button>
            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="hidden lg:flex w-72 h-72 items-center justify-center bg-blue-50/50 rounded-3xl relative overflow-hidden group-hover:bg-blue-50 transition-colors duration-500">
            {/* SVG Illustration - Simplified Premium Video Call Style */}
            <svg className="w-48 h-48 text-blue-500/80 drop-shadow-xl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="50" width="140" height="100" rx="16" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
              <rect x="50" y="70" width="40" height="30" rx="8" fill="currentColor" fillOpacity="0.2" />
              <rect x="110" y="70" width="40" height="30" rx="8" fill="currentColor" fillOpacity="0.2" />
              <rect x="50" y="110" width="100" height="20" rx="6" fill="currentColor" fillOpacity="0.15" />
              <circle cx="100" cy="40" r="4" fill="currentColor" />
              <path d="M170 85L190 75V125L170 115V85Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
              <circle cx="100" cy="100" r="25" fill="white" fillOpacity="0.5" />
              <path d="M95 90L110 100L95 110V90Z" fill="currentColor" />
            </svg>

            {/* Abstract Decorative Elements */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-400/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-400/10 rounded-full blur-xl"></div>
          </div>

        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
            <Video size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">One-Click Entry</h3>
          <p className="text-sm text-slate-500">Students can join instantly from their dashboard once the link is saved.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-4">
            <Clock size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Status Auto-Tracking</h3>
          <p className="text-sm text-slate-500">The session status updates based on your scheduled time automatically.</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">Quick Management</h3>
          <p className="text-sm text-slate-500">Update link or timings anytime to keep your classroom accessible.</p>
        </div>
      </div>
    </div>
  );
};

export default SessionLinkManager;
