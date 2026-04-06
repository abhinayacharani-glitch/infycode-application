import React, { useState } from 'react';

const Schedule = () => {
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(2); // March 2026 (0-indexed)

  const holidays = [
    { m: 0, d: 1, name: "New Year's Day" },
    { m: 0, d: 14, name: 'Makar Sankranti' },
    { m: 0, d: 26, name: 'Republic Day' },
    { m: 1, d: 26, name: 'Maha Shivaratri' },
    { m: 2, d: 14, name: 'Holi' },
    { m: 2, d: 31, name: 'Id-ul-Fitr (Eid)' },
    { m: 3, d: 6, name: 'Ugadi' },
    { m: 3, d: 10, name: 'Ram Navami' },
    { m: 3, d: 14, name: 'Ambedkar Jayanti' },
    { m: 3, d: 18, name: 'Good Friday' },
    { m: 4, d: 1, name: 'May Day' },
    { m: 4, d: 12, name: 'Buddha Purnima' },
    { m: 6, d: 7, name: 'Bakrid (Eid al-Adha)' },
    { m: 7, d: 15, name: 'Independence Day' },
    { m: 7, d: 16, name: 'Parsi New Year' },
    { m: 8, d: 5, name: 'Milad un-Nabi' },
    { m: 9, d: 2, name: 'Gandhi Jayanti' },
    { m: 9, d: 2, name: 'Dussehra' },
    { m: 9, d: 20, name: 'Diwali' },
    { m: 9, d: 21, name: 'Diwali Holiday' },
    { m: 10, d: 5, name: 'Guru Nanak Jayanti' },
    { m: 11, d: 25, name: 'Christmas' }
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const changeMonth = (dir) => {
    let newMonth = calMonth + dir;
    let newYear = calYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setCalMonth(newMonth);
    setCalYear(newYear);
  };

  const isSessionDay = (year, month, day) => {
    const dow = new Date(year, month, day).getDay();
    return dow >= 1 && dow <= 5;
  };

  const getHolidays = (year, month, day) => {
    return holidays.filter(h => h.m === month && h.d === day);
  };

  const renderCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div className="cal-day empty" key={`empty-${i}`}></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(calYear, calMonth, d).getDay();
      const hols = getHolidays(calYear, calMonth, d);
      const isToday = (today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d);
      const isSunday = dow === 0;
      const session = isSessionDay(calYear, calMonth, d) && hols.length === 0;

      let cls = 'cal-day';
      if (hols.length > 0) cls += ' holiday';
      else if (session) cls += ' session';
      else cls += ' normal';
      if (isToday) cls += ' today-cal';
      if (isSunday) cls += ' sunday';

      const title = hols.length > 0 ? hols.map(h => h.name).join(', ') : (session ? 'Session Day' : (isSunday ? 'Sunday' : 'Saturday'));

      cells.push(
        <div className={cls} title={title} key={`day-${d}`}>
          {d}
          {hols.length > 0 && <span className="cal-dot holiday-dot"></span>}
          {session && <span className="cal-dot session-dot"></span>}
        </div>
      );
    }
    return cells;
  };

  const monthHolidays = holidays.filter(h => h.m === calMonth);

  const upcomingSessions = [
    { date: 'Tomorrow', course: 'Full Stack Dev – React Hooks', batch: 'B12', time: '09:00 AM', mode: 'Online', color: 'var(--blue-500)' },
    { date: 'Mar 20', course: 'Python – Machine Learning Basics', batch: 'C09', time: '12:00 PM', mode: 'Offline', color: 'var(--green)' },
    { date: 'Mar 20', course: 'DevOps – Docker & Containers', batch: 'D02', time: '06:00 PM', mode: 'Online', color: 'var(--amber)' },
    { date: 'Mar 21', course: 'UI/UX – Prototyping in Figma', batch: 'A05', time: '03:30 PM', mode: 'Online', color: 'var(--purple)' },
    { date: 'Mar 22', course: 'Full Stack Dev – Node.js APIs', batch: 'B12', time: '09:00 AM', mode: 'Online', color: 'var(--blue-500)' },
    { date: 'Mar 24', course: 'Python – Pandas & Data Analysis', batch: 'C09', time: '12:00 PM', mode: 'Offline', color: 'var(--green)' },
  ];

  return (
    <div className="page active" id="page-schedule">

      {/* KPI Row */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card blue">
          <div className="kpi-top"><div className="kpi-icon blue">📅</div><span className="kpi-trend up">Today</span></div>
          <div className="kpi-val">3</div>
          <div className="kpi-label">Sessions Today</div>
          <div className="kpi-bar"><div className="kpi-bar-fill blue" style={{ width: '75%' }}></div></div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top"><div className="kpi-icon green">📆</div><span className="kpi-trend up">Week</span></div>
          <div className="kpi-val">14</div>
          <div className="kpi-label">Sessions This Week</div>
          <div className="kpi-bar"><div className="kpi-bar-fill green" style={{ width: '80%' }}></div></div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-top"><div className="kpi-icon amber">⏱️</div><span className="kpi-trend up">Hrs</span></div>
          <div className="kpi-val">42</div>
          <div className="kpi-label">Hours This Month</div>
          <div className="kpi-bar"><div className="kpi-bar-fill amber" style={{ width: '65%' }}></div></div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top"><div className="kpi-icon purple">🏖️</div><span className="kpi-trend up">Month</span></div>
          <div className="kpi-val">{monthHolidays.length || 0}</div>
          <div className="kpi-label">Holidays This Month</div>
          <div className="kpi-bar"><div className="kpi-bar-fill purple" style={{ width: `${(monthHolidays.length / 5) * 100}%` }}></div></div>
        </div>
      </div>

      {/* MAIN 3-col layout: Weekly Schedule | Upcoming Sessions | Calendar */}
      <div className="sched-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.4fr', gap: '24px', marginBottom: '24px' }}>

        {/* Weekly Timetable */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🗓️ Weekly Schedule</div>
              <div className="card-sub">March 16 – March 22, 2026</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(5, 1fr)', gap: '4px', fontSize: '11px' }}>
              <div></div>
              {['Mon', 'Tue', 'Wed ●', 'Thu', 'Fri'].map((d, idx) => (
                <div key={idx} style={{ textAlign: 'center', fontWeight: '700', color: idx === 2 ? 'var(--blue-600)' : 'var(--text-muted)', padding: '6px 0', borderBottom: idx === 2 ? '2px solid var(--blue-400)' : 'none' }}>{d}</div>
              ))}
            </div>
            {[
              { time: '09:00', slots: [null, { id: 'B12', label: 'Full Stack', color: 'var(--blue-50)', border: 'var(--blue-200)', textColor: 'var(--blue-600)' }, { id: 'B12', label: 'Full Stack', color: 'var(--blue-50)', border: 'var(--blue-200)', textColor: 'var(--blue-600)' }, null, { id: 'B12', label: 'Full Stack', color: 'var(--blue-50)', border: 'var(--blue-200)', textColor: 'var(--blue-600)' }] },
              { time: '12:00', slots: [{ id: 'C09', label: 'Python', color: 'var(--green-light)', border: 'var(--blue-100)', textColor: 'var(--green)' }, null, { id: 'C09', label: 'Python', color: 'var(--green-light)', border: 'var(--blue-100)', textColor: 'var(--green)' }, { id: 'C09', label: 'Python', color: 'var(--green-light)', border: 'var(--blue-100)', textColor: 'var(--green)' }, null] },
              { time: '03:30', slots: [{ id: 'A05', label: 'UI/UX', color: 'var(--purple-light)', border: 'var(--blue-100)', textColor: 'var(--purple)' }, { id: 'A05', label: 'UI/UX', color: 'var(--purple-light)', border: 'var(--blue-100)', textColor: 'var(--purple)' }, { id: 'A05', label: 'UI/UX', color: 'var(--purple-light)', border: 'var(--blue-100)', textColor: 'var(--purple)' }, null, null] },
              { time: '06:00', slots: [null, null, { id: 'D02', label: 'DevOps', color: 'var(--amber-light)', border: 'var(--blue-100)', textColor: 'var(--amber)' }, { id: 'D02', label: 'DevOps', color: 'var(--amber-light)', border: 'var(--blue-100)', textColor: 'var(--amber)' }, { id: 'D02', label: 'DevOps', color: 'var(--amber-light)', border: 'var(--blue-100)', textColor: 'var(--amber)' }] },
            ].map((row, ri) => (
              <div key={ri} style={{ display: 'grid', gridTemplateColumns: '60px repeat(5, 1fr)', gap: '4px', marginTop: '6px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: '"Urbanist", sans-serif', paddingTop: '6px' }}>{row.time}</div>
                {row.slots.map((slot, si) => (
                  slot ? (
                    <div key={si} style={{ background: slot.color, border: `1px solid ${slot.border}`, borderRadius: '8px', padding: '5px 7px', fontSize: '10px' }}>
                      <b style={{ color: slot.textColor }}>{slot.id}</b>
                      <div style={{ color: 'var(--text-muted)' }}>{slot.label}</div>
                    </div>
                  ) : <div key={si}></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📝 Upcoming Sessions</div>
              <div className="card-sub">Next 7 days</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: '12px 18px' }}>
            {upcomingSessions.map((s, i) => (
              <div key={i} className="schedule-item">
                <div className="sch-time">{s.date}</div>
                <div className="sch-dot" style={{ background: s.color }}></div>
                <div className="sch-info">
                  <div className="sch-course">{s.course}</div>
                  <div className="sch-batch">Batch {s.batch} · {s.time}</div>
                  <span className={`sch-mode ${s.mode.toLowerCase()}`}>{s.mode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Calendar */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📆 Monthly Calendar</div>
              <div className="card-sub">Sessions &amp; holidays</div>
            </div>
            <div className="month-nav">
              <div className="month-nav-btn" onClick={() => changeMonth(-1)}>◀</div>
              <div className="month-nav-label">{monthNames[calMonth]} {calYear}</div>
              <div className="month-nav-btn" onClick={() => changeMonth(1)}>▶</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: '12px 18px' }}>
            <div className="cal-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div className="cal-head" key={`${day}-${idx}`}>{day}</div>
              ))}
            </div>
            <div className="cal-grid" id="monthly-cal">
              {renderCalendarDays()}
            </div>
            <div className="cal-legend">
              <div className="cal-leg"><div className="cal-leg-dot" style={{ background: 'var(--blue-500)' }}></div>Session</div>
              <div className="cal-leg"><div className="cal-leg-dot" style={{ background: 'var(--accent)' }}></div>Holiday</div>
              <div className="cal-leg"><div className="cal-leg-dot" style={{ background: 'var(--blue-50)', border: '2px solid var(--blue-500)' }}></div>Today</div>
            </div>
            {monthHolidays.length > 0 && (
              <div className="holiday-list" style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>🏖️ Holidays</div>
                {monthHolidays.map((h, i) => {
                  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(calYear, calMonth, h.d).getDay()];
                  return (
                    <div className="holiday-item" key={i}>
                      <span className="h-date">{dayName}, {h.d}</span>
                      <span className="h-name">{h.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
