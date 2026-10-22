
import { useMemo, useState } from "react";
import "./App.css";

const initialRequests = [
  { id: "REQ-1048", patient: "Aarav Sharma", room: "Room 102", request: "Emergency", time: "10:42 AM", status: "Emergency", nurse: "Priya Patel" },
  { id: "REQ-1047", patient: "Meera Joshi", room: "Room 105", request: "Medicine", time: "10:38 AM", status: "Pending", nurse: "Ananya Rao" },
  { id: "REQ-1046", patient: "Rohan Mehta", room: "Room 108", request: "Water", time: "10:31 AM", status: "In Progress", nurse: "Priya Patel" },
  { id: "REQ-1045", patient: "Anjali Desai", room: "Room 110", request: "Consultation", time: "10:25 AM", status: "Completed", nurse: "Ananya Rao" },
  { id: "REQ-1044", patient: "Vikram Shah", room: "Room 112", request: "Water", time: "10:18 AM", status: "Pending", nurse: "Neha Singh" },
];

const nurses = [
  { name: "Priya Patel", role: "Senior Nurse", patients: 8, online: true },
  { name: "Ananya Rao", role: "Staff Nurse", patients: 6, online: true },
  { name: "Neha Singh", role: "Staff Nurse", patients: 5, online: false },
];

const patients = [
  { name: "Aarav Sharma", room: "Room 102", condition: "Needs assistance", color: "red" },
  { name: "Meera Joshi", room: "Room 105", condition: "Medicine scheduled", color: "yellow" },
  { name: "Rohan Mehta", room: "Room 108", condition: "Stable", color: "green" },
  { name: "Anjali Desai", room: "Room 110", condition: "Stable", color: "green" },
  { name: "Vikram Shah", room: "Room 112", condition: "Needs water", color: "yellow" },
];

function Icon({ name, size = 20 }) {
  const shapes = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>,
    requests: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h8M8 18h4"/></>,
    patients: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v2"/></>,
    team: <><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 15a5 5 0 0 1 5 5"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    water: <path d="M12 2.5S5 10 5 14a7 7 0 0 0 14 0c0-4-7-11.5-7-11.5Z"/>,
    medicine: <><path d="m10 3 11 11a4.2 4.2 0 0 1-6 6L4 9a4.2 4.2 0 0 1 6-6Z"/><path d="m8 13 6-6"/></>,
    emergency: <><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></>,
    consultation: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      {shapes[name] || shapes.dashboard}
    </svg>
  );
}

function initials(name) {
  return name.split(" ").map((part) => part[0]).slice(0, 2).join("");
}

function requestIcon(request) {
  if (request === "Water") return "water";
  if (request === "Medicine") return "medicine";
  if (request === "Emergency") return "emergency";
  return "consultation";
}

function Badge({ children }) {
  return <span className={`badge badge-${children.toLowerCase().replaceAll(" ", "-")}`}>{children}</span>;
}

function StatCard({ title, value, detail, icon, tone, onClick }) {
  return (
    <button type="button" className={`stat-card stat-${tone} stat-card-button`} onClick={onClick} aria-label={`View ${title.toLowerCase()}`}>
      <div className="stat-top">
        <span>{title}</span>
        <div className={`stat-icon ${tone}`}><Icon name={icon} size={21}/></div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail"><span className={`detail-dot ${tone}`}/>{detail}</div>
      <span className="stat-open-hint">Click to view requests →</span>
    </button>
  );
}

function RequestTools({ search, setSearch, filter, setFilter }) {
  return (
    <div className="table-toolbar">
      <div className="search-box">
        <Icon name="search" size={18}/>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient, room or request..."/>
      </div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter requests">
        {["All", "Emergency", "Pending", "In Progress", "Completed"].map((status) =>
          <option key={status}>{status}</option>
        )}
      </select>
    </div>
  );
}

function RequestTable({ requests, onSelect }) {
  if (!requests.length) {
    return (
      <div className="empty-state">
        <Icon name="requests" size={30}/>
        <strong>No requests found</strong>
        <span>Try another search or status filter.</span>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="request-table">
        <thead>
          <tr><th>Patient</th><th>Request</th><th>Time</th><th>Assigned nurse</th><th>Status</th><th/></tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} onClick={() => onSelect(r)}>
              <td>
                <div className="patient-cell">
                  <div className="avatar table-avatar">{initials(r.patient)}</div>
                  <div><strong>{r.patient}</strong><span>{r.room} · {r.id}</span></div>
                </div>
              </td>
              <td><div className="request-cell"><span className={`request-symbol ${r.request.toLowerCase()}`}><Icon name={requestIcon(r.request)} size={17}/></span>{r.request}</div></td>
              <td className="time-cell">{r.time}</td>
              <td><span className="nurse-name">{r.nurse}</span></td>
              <td><Badge>{r.status}</Badge></td>
              <td><button className="row-action" aria-label={`Manage ${r.id}`} onClick={(e) => { e.stopPropagation(); onSelect(r); }}><Icon name="arrow" size={17}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverviewRow({ color, label, count }) {
  return <div className="overview-row"><span className={`overview-dot ${color}`}/><span>{label}</span><strong>{count}</strong></div>;
}

export default function App() {
  const [dashboard, setDashboard] = useState("central");
  const [page, setPage] = useState("Dashboard");
  const [requests, setRequests] = useState(initialRequests);
  const [patientList, setPatientList] = useState(patients);
  const [nurseList, setNurseList] = useState(nurses);
  const [patientForm, setPatientForm] = useState({ name: "", room: "", nurse: nurses[0]?.name || "", wristband: "" });
  const [nurseForm, setNurseForm] = useState({ name: "", role: "Staff Nurse" });
  const [formMessage, setFormMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [nurseAvailable, setNurseAvailable] = useState(true);

  const isAssigned = dashboard === "assigned";
  const currentNurse = "Priya Patel";

  const allVisible = isAssigned ? requests.filter((r) => r.nurse === currentNurse) : requests;
  const emergencyCount = allVisible.filter((r) => r.status === "Emergency").length;
  const pendingCount = allVisible.filter((r) => r.status === "Pending").length;
  const progressCount = allVisible.filter((r) => r.status === "In Progress").length;
  const completedCount = allVisible.filter((r) => r.status === "Completed").length;

  const visibleRequests = useMemo(() => requests.filter((r) => {
    const nurseMatch = !isAssigned || r.nurse === currentNurse;
    const filterMatch = filter === "All" || r.status === filter;
    const text = `${r.id} ${r.patient} ${r.room} ${r.request} ${r.nurse}`.toLowerCase();
    return nurseMatch && filterMatch && text.includes(search.toLowerCase());
  }), [requests, isAssigned, filter, search]);

  function saveRequest() {
    const selected = selectedRequest;
    if (!selected) return;
    setRequests((old) => old.map((r) => r.id === selected.id
      ? { ...r, nurse: selected.nurse, status: selected.status }
      : r
    ));
    setSelectedRequest(null);
  }

  const navItems = [
    { label: "Dashboard", icon: "dashboard" },
    { label: "All Requests", icon: "requests" },
    ...(!isAssigned ? [
      { label: "Patients", icon: "patients" },
      { label: "Nursing Team", icon: "team" },
      { label: "Register Patient", icon: "patients" },
      { label: "Register Nurse", icon: "team" },
    ] : []),
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Icon name="emergency" size={25}/></div>
          <div><h2>CareConnect</h2><p>Patient assistance</p></div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="navigation">
          {navItems.map((item) => (
            <button key={item.label}
              className={`nav-item ${page === item.label ? "active" : ""}`}
              onClick={() => { setPage(item.label); setFilter("All"); setSearch(""); }}>
              <Icon name={item.icon} size={19}/><span>{item.label}</span>
              {item.label === "All Requests" && emergencyCount > 0 && <span className="nav-count">{emergencyCount}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="status-card">
            <span className="status-dot"/>
            <div><strong>System operational</strong><p>All services running</p></div>
          </div>
          <div className="profile">
            <div className="avatar">{isAssigned ? "PP" : "NA"}</div>
            <div className="profile-info">
              <strong>{isAssigned ? currentNurse : "Nursing Admin"}</strong>
              <span>{isAssigned ? "Assigned nurse" : "Central control"}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>CareConnect</span><span className="crumb-divider">/</span><strong>{page}</strong></div>

          <nav className="top-page-nav" aria-label="Main pages">
            {["Dashboard", "All Requests", ...(!isAssigned ? ["Register Patient", "Register Nurse"] : [])].map((label) => (
              <button key={label} className={`top-page-link ${page === label ? "active" : ""}`} onClick={() => { setPage(label); setFilter("All"); setSearch(""); setFormMessage(""); }}>
                {label === "Register Patient" ? "+ Register Patient" : label === "Register Nurse" ? "+ Register Nurse" : label}
              </button>
            ))}
          </nav>

          <div className="topbar-right">
            <div className="notification-wrap">
              <button className="notification-button" aria-label="View notifications"
                onClick={() => setNotificationsOpen((open) => !open)}>
                <Icon name="bell" size={20}/>
                {emergencyCount > 0 && <i/>}
              </button>
              {notificationsOpen && (
                <div className="notification-panel">
                  <div className="notification-heading">
                    <strong>Notifications</strong>
                    <button onClick={() => setNotificationsOpen(false)}>×</button>
                  </div>
                  {allVisible.filter((r) => r.status === "Emergency").length ? (
                    allVisible.filter((r) => r.status === "Emergency").map((r) => (
                      <button className="notification-item" key={r.id} onClick={() => {
                        setSelectedRequest(r);
                        setNotificationsOpen(false);
                      }}>
                        <span className="notification-alert"><Icon name="alert" size={17}/></span>
                        <span><strong>{r.patient} · {r.room}</strong><small>Emergency request · {r.time}</small></span>
                      </button>
                    ))
                  ) : <p className="no-notifications">No active emergency requests.</p>}
                </div>
              )}
            </div>

            <select className="dashboard-select" aria-label="Choose dashboard"
              value={dashboard}
              onChange={(e) => {
                setDashboard(e.target.value);
                setPage("Dashboard");
                setFilter("All");
                setSearch("");
                setNotificationsOpen(false);
              }}>
              <option value="central">Central Nurse Dashboard</option>
              <option value="assigned">Assigned Nurse Dashboard</option>
            </select>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot"/> HEALTHCARE OPERATIONS</div>
              <h1>{isAssigned ? "Welcome, Priya" : "Good morning, Admin"} <span className="wave">✦</span></h1>
              <p>{isAssigned
                ? "Here is an overview of the patients and requests assigned to you."
                : "Here is what's happening across your patient care facility today."}</p>
            </div>
          </section>

          {isAssigned && (
            <section className="nurse-shift-panel">
              <div className="nurse-shift-top">
                <div><span className="nurse-shift-eyebrow">YOUR WORKSPACE</span><h2>My Shift</h2><p>Manage your availability and focus on urgent patient needs.</p></div>
                <span className={`nurse-availability ${nurseAvailable ? "is-available" : "is-break"}`}><span />{nurseAvailable ? "Available" : "On break"}</span>
              </div>
              <div className="nurse-shift-actions">
                <button type="button" className={`nurse-toggle ${nurseAvailable ? "is-on" : ""}`} role="switch" aria-checked={nurseAvailable} onClick={() => setNurseAvailable(v => !v)}><span className="switch-track"><span /></span>{nurseAvailable ? "Go on break" : "Mark available"}</button>
                <button type="button" className="nurse-primary-action" onClick={() => { setPage("All Requests"); setFilter("Pending"); setSearch(""); }}>Review pending <Icon name="arrow" size={17}/></button>
              </div>
            </section>
          )}

          {emergencyCount > 0 && (
            <section className="emergency-banner">
              <div className="emergency-icon"><Icon name="alert" size={23}/></div>
              <div className="emergency-copy">
                <strong>{emergencyCount} active emergency {emergencyCount === 1 ? "request" : "requests"}</strong>
                <span>Immediate attention may be required. Review the request below.</span>
              </div>
              <button onClick={() => { setPage("All Requests"); setFilter("Emergency"); }}>
                View emergency <Icon name="arrow" size={17}/>
              </button>
            </section>
          )}

          {!isAssigned && (
            <section className="stats-grid" aria-label="Request summary. Select a card to open matching requests.">
              <StatCard title="Total Requests" value={allVisible.length} detail="Requests received" icon="requests" tone="teal" onClick={() => { setPage("All Requests"); setFilter("All"); setSearch(""); }}/>
              <StatCard title="Pending Requests" value={pendingCount} detail="Awaiting response" icon="clock" tone="yellow" onClick={() => { setPage("All Requests"); setFilter("Pending"); setSearch(""); }}/>
              <StatCard title="In Progress" value={progressCount} detail="Currently being handled" icon="water" tone="lavender" onClick={() => { setPage("All Requests"); setFilter("In Progress"); setSearch(""); }}/>
              <StatCard title="Completed" value={completedCount} detail="Successfully resolved" icon="check" tone="green" onClick={() => { setPage("All Requests"); setFilter("Completed"); setSearch(""); }}/>
            </section>
          )}

          {page === "Dashboard" && (
            <div className="dashboard-grid">
              <section className="panel requests-panel">
                <div className="panel-header">
                  <div><div className="panel-title-row"><h2>Recent Requests</h2><span className="small-count">{visibleRequests.length}</span></div><p>Monitor and manage patient assistance requests</p></div>
                  <button className="text-button" onClick={() => setPage("All Requests")}>View all <Icon name="arrow" size={16}/></button>
                </div>
                <RequestTools search={search} setSearch={setSearch} filter={filter} setFilter={setFilter}/>
                {isAssigned ? (
                  <div className="nurse-request-cards">
                    {visibleRequests.slice(0, 5).length ? visibleRequests.slice(0, 5).map((r) => (
                      <article key={r.id} className={`nurse-request-card ${r.status === "Emergency" ? "urgent-card" : ""}`}>
                        <div className="nurse-request-card-top"><span className={`request-symbol ${r.request.toLowerCase()}`}><Icon name={requestIcon(r.request)} size={18}/></span><Badge>{r.status}</Badge></div>
                        <div className="nurse-request-person"><div className="avatar patient-avatar">{initials(r.patient)}</div><div><strong>{r.patient}</strong><span>{r.room} · {r.id}</span></div></div>
                        <div className="nurse-request-meta"><span>{r.request}</span><span>{r.time}</span></div>
                        <button className="nurse-manage-button" onClick={() => setSelectedRequest(r)}>{r.status === "Completed" ? "View details" : r.status === "In Progress" ? "Continue request" : r.status === "Emergency" ? "Accept emergency" : "Accept request"}<Icon name="arrow" size={16}/></button>
                      </article>
                    )) : <div className="empty-state"><Icon name="requests" size={30}/><strong>No requests found</strong><span>Try another search or status filter.</span></div>}
                  </div>
                ) : <RequestTable requests={visibleRequests.slice(0, 5)} onSelect={setSelectedRequest}/>}
                <div className="panel-footer"><span>Showing {Math.min(visibleRequests.length, 5)} of {visibleRequests.length} requests</span><button onClick={() => setPage("All Requests")}>Open request centre <Icon name="arrow" size={15}/></button></div>
              </section>

              <div className="right-column">
                <section className="panel quick-panel">
                  <div className="panel-header"><div><h2>Request Overview</h2><p>Current request status</p></div></div>
                  <div className="overview-list">
                    <OverviewRow color="red" label="Emergency" count={emergencyCount}/>
                    <OverviewRow color="yellow" label="Pending" count={pendingCount}/>
                    <OverviewRow color="lavender" label="In Progress" count={progressCount}/>
                    <OverviewRow color="green" label="Completed" count={completedCount}/>
                  </div>
                  <div className="overview-total"><span>Total active requests</span><strong>{allVisible.length}</strong></div>
                </section>

                <section className="panel care-panel">
                  <div className="panel-header"><div><h2>{isAssigned ? "My Patients" : "Nursing Team"}</h2><p>{isAssigned ? "Patients under your care" : "Team availability"}</p></div>
                    <button className="icon-button" aria-label="View details" onClick={() => setPage(isAssigned ? "Patients" : "Nursing Team")}><Icon name="arrow" size={17}/></button>
                  </div>
                  {isAssigned
                    ? patientList.filter((p) => requests.some((r) => r.patient === p.name && r.nurse === currentNurse)).slice(0, 4).map((p) => (
                      <div className="mini-person" key={p.name}><div className="avatar patient-avatar">{initials(p.name)}</div><div className="person-detail"><strong>{p.name}</strong><span>{p.room}</span></div><span className={`patient-dot ${p.color}`}/></div>
                    ))
                    : nurseList.map((n) => (
                      <div className="mini-person" key={n.name}><div className="avatar nurse-avatar">{initials(n.name)}</div><div className="person-detail"><strong>{n.name}</strong><span>{n.role}</span></div><span className={`online-pill ${n.online ? "online" : "offline"}`}>{n.online ? "Online" : "Away"}</span></div>
                    ))}
                </section>
              </div>
            </div>
          )}

          {page === "All Requests" && (
            <section className="panel full-panel">
              <div className="panel-header"><div><h2>All Patient Requests</h2><p>Search, filter, assign, and update request status.</p></div><span className="table-total">{visibleRequests.length} requests</span></div>
              <RequestTools search={search} setSearch={setSearch} filter={filter} setFilter={setFilter}/>
              <RequestTable requests={visibleRequests} onSelect={setSelectedRequest}/>
            </section>
          )}

          {page === "Patients" && (
            <section className="panel full-panel">
              <div className="panel-header"><div><h2>Patient Directory</h2><p>Registered patients and their current needs.</p></div></div>
              <div className="patient-grid">
                {patientList.filter((p) => !isAssigned || requests.some((r) => r.patient === p.name && r.nurse === currentNurse)).map((p) => (
                  <div className="patient-card" key={p.name}>
                    <div className="patient-card-top"><div className="avatar patient-avatar">{initials(p.name)}</div><span className={`patient-dot ${p.color}`}/></div>
                    <h3>{p.name}</h3><p>{p.room}</p>
                    <div className={`patient-condition ${p.color}`}><span/>{p.condition}</div>
                    <div className="patient-card-bottom"><span>Open requests</span><strong>{requests.filter((r) => r.patient === p.name && r.status !== "Completed").length}</strong></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {page === "Nursing Team" && (
            <section className="panel full-panel">
              <div className="panel-header"><div><h2>Nursing Team</h2><p>Team members and their current workload.</p></div></div>
              <div className="nurse-grid">
                {nurseList.map((n) => {
                  const workload = requests.filter((r) => r.nurse === n.name && r.status !== "Completed").length;
                  return (
                    <div className="nurse-card" key={n.name}>
                      <div className="nurse-card-top"><div className="avatar nurse-avatar large-avatar">{initials(n.name)}</div><span className={`online-pill ${n.online ? "online" : "offline"}`}>{n.online ? "Online" : "Away"}</span></div>
                      <h3>{n.name}</h3><p>{n.role}</p>
                      <div className="nurse-metrics"><div><strong>{n.patients}</strong><span>Patients</span></div><div><strong>{workload}</strong><span>Open requests</span></div></div>
                      <button className="secondary-button" onClick={() => { setDashboard("assigned"); setPage("Dashboard"); }}>View assigned dashboard <Icon name="arrow" size={16}/></button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {page === "Register Patient" && (
            <section className="panel full-panel registration-panel">
              <div className="panel-header"><div><h2>Register New Patient</h2><p>Create a patient record and connect it to a room, nurse, and wristband.</p></div></div>
              <form className="registration-form" onSubmit={(e) => {
                e.preventDefault();
                const name = patientForm.name.trim();
                const room = patientForm.room.trim();
                if (!name || !room) { setFormMessage("Please enter the patient's name and room/bed."); return; }
                if (patientList.some((p) => p.name.toLowerCase() === name.toLowerCase())) { setFormMessage("A patient with this name is already registered."); return; }
                const wristband = patientForm.wristband.trim() || `WB-${String(patientList.length + 1).padStart(3, "0")}`;
                setPatientList((old) => [...old, { name, room, condition: "Stable", color: "green", wristband }]);
                setFormMessage(`${name} registered successfully with wristband ${wristband}.`);
                setPatientForm({ name: "", room: "", nurse: nurseList[0]?.name || "", wristband: "" });
              }}>
                <label>Patient full name<input value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} placeholder="e.g. Asha Sharma" required /></label>
                <label>Room / bed number<input value={patientForm.room} onChange={(e) => setPatientForm({ ...patientForm, room: e.target.value })} placeholder="e.g. Room 204, Bed 2" required /></label>
                <label>Assign nurse<select value={patientForm.nurse} onChange={(e) => setPatientForm({ ...patientForm, nurse: e.target.value })}>{nurseList.map((n) => <option key={n.name} value={n.name}>{n.name}</option>)}</select></label>
                <label>Wristband ID <span className="optional-label">(optional)</span><input value={patientForm.wristband} onChange={(e) => setPatientForm({ ...patientForm, wristband: e.target.value })} placeholder="Auto-generated if empty" /></label>
                {formMessage && <p className="form-message" role="status">{formMessage}</p>}
                <div className="registration-actions"><button className="primary-button" type="submit">Register patient <Icon name="check" size={17}/></button><button className="secondary-button" type="button" onClick={() => { setPatientForm({ name: "", room: "", nurse: nurseList[0]?.name || "", wristband: "" }); setFormMessage(""); }}>Clear form</button></div>
              </form>
            </section>
          )}

          {page === "Register Nurse" && (
            <section className="panel full-panel registration-panel">
              <div className="panel-header"><div><h2>Register New Nurse</h2><p>Add a nursing team member to the demo directory.</p></div></div>
              <form className="registration-form" onSubmit={(e) => {
                e.preventDefault();
                const name = nurseForm.name.trim();
                if (!name) { setFormMessage("Please enter the nurse's full name."); return; }
                if (nurseList.some((n) => n.name.toLowerCase() === name.toLowerCase())) { setFormMessage("This nurse is already registered."); return; }
                setNurseList((old) => [...old, { name, role: nurseForm.role, patients: 0, online: true }]);
                setFormMessage(`${name} has been added to the nursing team.`);
                setNurseForm({ name: "", role: "Staff Nurse" });
              }}>
                <label>Nurse full name<input value={nurseForm.name} onChange={(e) => setNurseForm({ ...nurseForm, name: e.target.value })} placeholder="e.g. Kavya Deshmukh" required /></label>
                <label>Role<select value={nurseForm.role} onChange={(e) => setNurseForm({ ...nurseForm, role: e.target.value })}><option>Staff Nurse</option><option>Senior Nurse</option><option>Head Nurse</option><option>On-call Nurse</option></select></label>
                <div className="registration-note"><Icon name="alert" size={17}/> Demo only: this nurse is added to the current interface but is not yet saved to a shared database or login system.</div>
                {formMessage && <p className="form-message" role="status">{formMessage}</p>}
                <div className="registration-actions"><button className="primary-button" type="submit">Register nurse <Icon name="check" size={17}/></button><button className="secondary-button" type="button" onClick={() => { setNurseForm({ name: "", role: "Staff Nurse" }); setFormMessage(""); }}>Clear form</button></div>
              </form>
            </section>
          )}

          <footer className="page-footer">
            <span><span className="footer-dot"/>CareConnect patient assistance system</span>
            <span>Demo dashboard · Sample patient data</span>
          </footer>
        </div>
      </main>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <section className="request-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><span className="modal-kicker">REQUEST DETAILS</span><h2>{selectedRequest.id}</h2></div>
              <button className="close-button" aria-label="Close" onClick={() => setSelectedRequest(null)}>×</button>
            </div>
            <div className="modal-patient">
              <div className="avatar patient-avatar large-avatar">{initials(selectedRequest.patient)}</div>
              <div><h3>{selectedRequest.patient}</h3><p>{selectedRequest.room} · {selectedRequest.time}</p></div>
              <Badge>{selectedRequest.status}</Badge>
            </div>
            <div className="request-type-box">
              <span className={`request-symbol ${selectedRequest.request.toLowerCase()}`}><Icon name={requestIcon(selectedRequest.request)} size={22}/></span>
              <div><span>REQUEST TYPE</span><strong>{selectedRequest.request}</strong></div>
            </div>
            {isAssigned ? (
              <>
                <div className="request-readonly-field"><span>ASSIGNED NURSE</span><strong>{selectedRequest.nurse}</strong></div>
                <div className="request-readonly-field"><span>REQUEST STATUS</span><strong><Badge>{selectedRequest.status}</Badge></strong></div>
                <div className="modal-actions nurse-request-actions">
                  <button className="secondary-button" onClick={() => setSelectedRequest(null)}>Close</button>
                  {(selectedRequest.status === "Pending" || selectedRequest.status === "Emergency") && (
                    <button className="primary-button" onClick={() => {
                      setRequests(old => old.map(r => r.id === selectedRequest.id ? { ...r, status: "In Progress" } : r));
                      setSelectedRequest(null);
                    }}>Accept request <Icon name="check" size={17}/></button>
                  )}
                  {selectedRequest.status === "In Progress" && (
                    <button className="primary-button" onClick={() => {
                      setRequests(old => old.map(r => r.id === selectedRequest.id ? { ...r, status: "Completed" } : r));
                      setSelectedRequest(null);
                    }}>Mark completed <Icon name="check" size={17}/></button>
                  )}
                </div>
              </>
            ) : (
              <>
                <label className="field-label">Assigned nurse</label>
                <select className="modal-select" value={selectedRequest.nurse} onChange={(e) => setSelectedRequest({ ...selectedRequest, nurse: e.target.value })}>
                  {nurseList.map((n) => <option key={n.name}>{n.name}</option>)}
                </select>
                <label className="field-label">Request status</label>
                <select className="modal-select" value={selectedRequest.status} onChange={(e) => setSelectedRequest({ ...selectedRequest, status: e.target.value })}>
                  {["Emergency", "Pending", "In Progress", "Completed"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <div className="modal-actions">
                  <button className="secondary-button" onClick={() => setSelectedRequest(null)}>Cancel</button>
                  <button className="primary-button" onClick={saveRequest}>Save changes <Icon name="check" size={17}/></button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
