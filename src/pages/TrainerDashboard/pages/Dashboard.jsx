import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Layers,
  Calendar,
  Clock,
  Play,
  Upload,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useTrainer } from '../../../context/TrainerContext';
import LiveSessionCard from '../components/LiveSessionCard';
import {
  getTrainerBatchesAPI,
  getTrainerScheduleAPI,
  getTrainerQueriesAPI,
  getTrainerLiveSessionConfigAPI,
} from '../../../services/api';
import './Dashboard.css';

// ─── Animated counter ───────────────────────────────────────────────────────
const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let s = 0;
    const dur = 1400;
    const step = 16;
    const inc = target / (dur / step);
    const t = setInterval(() => {
      s += inc;
      if (s >= target) { s = target; clearInterval(t); }
      setCount(s);
    }, step);
    return () => clearInterval(t);
  }, [target]);
  return <span>{Math.floor(count)}</span>;
};

// ─── Skeleton placeholder card ──────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="modern-card skeleton-pulse">
    <div className="card-main-content">
      <div className="skeleton-icon" />
      <div className="card-details">
        <div className="skeleton-line title" />
        <div className="skeleton-line sub" />
        <div className="skeleton-line progress" />
      </div>
    </div>
    <div className="skeleton-btn" />
  </div>
);

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatTimeToAMPM = (time24) => {
  if (!time24 || !time24.includes(':')) return time24;
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
};

/**
 * Returns 'upcoming' | 'ongoing' | 'completed' based on the current time
 * compared to the session start time + duration.
 */
const computeRealtimeStatus = (dateStr, startTime, duration) => {
  if (!dateStr || !startTime || startTime === '--:--') return 'upcoming';
  try {
    const now = new Date();
    const start = new Date(`${dateStr}T${startTime}`);
    const durationMins = parseInt(duration) || 60;
    const end = new Date(start.getTime() + durationMins * 60 * 1000);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
  } catch {
    return 'upcoming';
  }
};

// ─── Main component ─────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { trainerData } = useTrainer();
  const userName = trainerData.fullName || trainerData.fullname || trainerData.name || 'Trainer';

  const [isLoading, setIsLoading]               = useState(true);
  const [dashData,  setDashData]                = useState(null);
  const [activeBatches, setActiveBatches]       = useState(0);
  const [totalStudents, setTotalStudents]       = useState(0);
  const [sessionsTodayCount, setSessionsTodayCount] = useState(0);
  const [schedule, setSchedule]                 = useState([]);
  const [refreshTick, setRefreshTick]           = useState(0);

  // ── Data loader ────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // 1. Batches
        const batchesRes = await getTrainerBatchesAPI();
        const batchesList = batchesRes.success ? (batchesRes.batches || []) : [];

        // 2. Schedule
        const scheduleRes = await getTrainerScheduleAPI();
        const scheduleList = scheduleRes.success ? (scheduleRes.schedule || []) : [];

        // 3. Queries
        const queriesRes = await getTrainerQueriesAPI();
        const queriesList = queriesRes.success ? (queriesRes.queries || []) : [];

        // 4. Fetch meeting links for every unique batchId in one pass
        const uniqueBatchIds = [...new Set(scheduleList.map(s => s.batchId).filter(Boolean))];
        const meetingLinkMap = {};
        await Promise.all(
          uniqueBatchIds.map(async (batchId) => {
            try {
              const res = await getTrainerLiveSessionConfigAPI(batchId);
              if (res.success && res.config?.sessionLink) {
                meetingLinkMap[batchId] = res.config.sessionLink;
              }
            } catch (_) { /* ignore per-batch errors */ }
          })
        );

        // 5. Stats
        const activeCount   = batchesList.length;
        const studentsCount = batchesList.reduce((sum, b) => sum + (parseInt(b.students) || 0), 0);

        // 6. Today's non-holiday sessions with real-time status + meeting link
        const todayStr      = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const todaysSessions = scheduleList.filter(
          s => s.date === todayStr && s.type !== 'Holiday'
        );

        const formattedSessions = todaysSessions.map(s => {
          const matchingBatch   = batchesList.find(
            b => b.id === s.batchId || b.firebaseId === s.batchId
          );
          const realtimeStatus  = computeRealtimeStatus(s.date, s.startTime, s.duration);
          const meetingLink     = meetingLinkMap[s.batchId] || s.meetingLink || '';
          return {
            id:       s.id,
            time:     formatTimeToAMPM(s.startTime),
            rawTime:  s.startTime,
            course:   s.courseName || s.course || 'Live Session',
            batch:    s.batchName  || s.batchId || 'Batch',
            students: matchingBatch ? matchingBatch.students : 0,
            duration: s.duration   || 60,
            mode:     s.mode       || 'Online',
            status:   realtimeStatus,
            active:   realtimeStatus === 'ongoing',
            link:     meetingLink,
            date:     s.date,
          };
        });

        // 7. Show only next 2 upcoming/ongoing sessions sorted by time
        const upcomingSessions = formattedSessions
          .filter(s => s.status === 'upcoming' || s.status === 'ongoing')
          .sort((a, b) => (a.rawTime || '').localeCompare(b.rawTime || ''))
          .slice(0, 2);

        setActiveBatches(activeCount);
        setTotalStudents(studentsCount);
        setSessionsTodayCount(todaysSessions.length);
        setSchedule(upcomingSessions);

        // 8. Queries data
        const unreadQueries  = queriesList.filter(q => !q.readByTrainer);
        const latestQueryText = unreadQueries.length > 0
          ? (unreadQueries[0].queryText || unreadQueries[0].message || 'New query pending review')
          : 'No pending student queries.';

        const studentMap = new Map();
        unreadQueries.forEach(q => {
          const name = q.studentName || 'Student';
          const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          studentMap.set(name, initials);
        });

        const palette = [
          { color: '#6366F1', bg: '#EEF2FF' },
          { color: '#10B981', bg: '#ECFDF5' },
          { color: '#F59E0B', bg: '#FFFBEB' },
        ];
        const queryAvatars = Array.from(studentMap.entries())
          .slice(0, 3)
          .map(([, initials], idx) => ({ initials, ...palette[idx % palette.length] }));

        setDashData({
          materials: {
            moduleName: batchesList.length > 0
              ? `Manage syllabuses and files for ${batchesList[0].name || batchesList[0].course}`
              : 'Upload files for your assigned courses.',
            uploaded: ['Syllabus overview', 'Reference guidelines'],
            pending:  ['Video tutorial links'],
          },
          queries: {
            count:         unreadQueries.length,
            latestMessage: latestQueryText,
            students:      queryAvatars,
            totalAvatars:  studentMap.size,
          },
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading trainer dashboard:', error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [refreshTick]);

  // Auto-refresh every 60 s so completed sessions drop off automatically
  useEffect(() => {
    const interval = setInterval(() => setRefreshTick(t => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── KPI config ─────────────────────────────────────────────────────────────
  const kpis = [
    { label: 'Active Batches',  value: activeBatches,       trend: 'Updated', icon: <Layers size={22} />,   color: 'blue'  },
    { label: 'Total Students',  value: totalStudents,        trend: 'Updated', icon: <Users size={22} />,    color: 'green' },
    { label: 'Sessions Today',  value: sessionsTodayCount,  trend: 'Today',   icon: <Calendar size={22} />, color: 'amber' },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container-v2 animate-fade-in">

      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <div className="banner-content">
          <div className="banner-left">
            <h1>Welcome Back, {userName}!</h1>
            <p>Here's what's happening with your batches today.</p>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="dashboard-kpi-row-v2">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card-v2">
            <div className={`kpi-icon-v2 ${kpi.color}`}>{kpi.icon}</div>
            <div className="kpi-info-v2">
              <span className="kpi-label-v2">{kpi.label}</span>
              <h3 className="kpi-value-v2"><Counter target={kpi.value} /></h3>
              <span className="kpi-trend-v2 pos">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="dashboard-main-content-v2">

        {/* TODAY'S LIVE SESSIONS */}
        <section className="dashboard-section-v2">
          <div className="section-header-v2">
            <h2 className="section-title-v2">Today's Live Sessions</h2>
            <button className="text-btn-v2" onClick={() => navigate('/trainer-dashboard/schedule')}>
              View Full Schedule <ChevronRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div className="schedule-list-v2">
            {isLoading ? (
              <>
                <div className="schedule-item-saas skeleton-pulse" style={{ height: 72 }} />
                <div className="schedule-item-saas skeleton-pulse" style={{ height: 72 }} />
              </>
            ) : schedule.length > 0 ? (
              schedule.map((session, idx) => (
                <LiveSessionCard key={session.id || idx} session={session} />
              ))
            ) : (
              <div className="empty-state-v2" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                <Calendar size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ fontWeight: 600 }}>No upcoming live classes for today.</p>
              </div>
            )}
          </div>
        </section>

        {/* PENDING ACTIONS */}
        <section className="dashboard-section-v2">
          <div className="section-header-v2">
            <h2 className="section-title-v2">Pending Actions</h2>
          </div>
          <div className="pending-actions-grid-v2">
            {isLoading ? (
              <><SkeletonCard /><SkeletonCard /></>
            ) : dashData ? (
              <>
                {/* Materials Card */}
                <div
                  className="modern-card materials-card-v2 clickable"
                  onClick={() => navigate('/trainer-dashboard/materials')}
                >
                  <div className="card-main-content">
                    <div className="card-icon-wrapper"><Upload size={26} /></div>
                    <div className="card-details">
                      <h4>Upload Materials</h4>
                      <p className="module-name">{dashData.materials.moduleName}</p>
                      <div className="upload-items">
                        {dashData.materials.uploaded.map((item, i) => (
                          <span key={i} className="upload-item"><div className="dot" /> {item}</span>
                        ))}
                        {dashData.materials.pending.map((item, i) => (
                          <span key={i} className="upload-item pending"><div className="dot grey" /> {item} (Pending)</span>
                        ))}
                      </div>
                    </div>
                    <button className="modern-card-cta secondary">Upload Files <Upload size={16} /></button>
                  </div>
                </div>

                {/* Queries Card */}
                <div
                  className="modern-card queries-card-v2 clickable"
                  onClick={() => navigate('/trainer-dashboard/student-connect')}
                >
                  <div className="card-main-content">
                    <span className="query-count">{dashData.queries.count} New Messages</span>
                    <div className="card-icon-wrapper"><MessageSquare size={26} /></div>
                    <div className="card-details">
                      <h4>Respond to Queries</h4>
                      <p className="message-preview">"{dashData.queries.latestMessage}"</p>
                      <div className="student-avatars">
                        {dashData.queries.count > 0 && (
                          <div className="avatar-stack">
                            {dashData.queries.students.map((st, i) => (
                              <div key={i} className="avatar" style={{ backgroundColor: st.bg, color: st.color }}>{st.initials}</div>
                            ))}
                            {dashData.queries.totalAvatars > dashData.queries.students.length && (
                              <div className="avatar-more">+{dashData.queries.totalAvatars - dashData.queries.students.length}</div>
                            )}
                          </div>
                        )}
                        <p className="avatar-text">
                          {dashData.queries.count > 0 ? 'Students are waiting' : 'All caught up'}
                        </p>
                      </div>
                    </div>
                    <button className="modern-card-cta accent">Open Queries <MessageSquare size={16} /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state-v2">
                <AlertCircle size={48} />
                <p>No pending actions available right now.</p>
              </div>
            )}
          </div>
        </section>

        {/* QUICK INSIGHTS */}
        <section className="dashboard-section-v2">
          <div className="section-header-v2">
            <h2 className="section-title-v2">Quick Insights</h2>
          </div>
          <div className="quick-actions-row-v2">
            <button className="qa-pill" onClick={() => navigate('/trainer-dashboard/live-session')}>
              <Play size={18} /> Start New Class
            </button>
            <button className="qa-pill" onClick={() => navigate('/trainer-dashboard/batches')}>
              <TrendingUp size={18} /> Batch Progress
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
