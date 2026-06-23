import { useState, useMemo, useCallback, useEffect } from 'react';

const CATEGORIES = ['Frontend', 'Backend', 'Design', 'DevOps', 'General'];
const COURSES = [
  'React Fundamentals',
  'JavaScript ES6+',
  'CSS Grid Layout',
  'Node.js Basics',
  'System Design',
];

const INITIAL_NOTES = [
  {
    id: 1,
    title: 'React Hooks Deep Dive',
    course: 'React Fundamentals',
    category: 'Frontend',
    content:
      '## React Hooks\n\n### useState\n- Returns stateful value and setter function\n- Preserves state across re-renders\n\n### useEffect\n- Side effects in function components\n- Dependency array controls when effect runs\n\n### useCallback & useMemo\n- Performance optimization hooks\n- Memoize functions and computed values\n\n### Custom Hooks\n- Extract reusable logic into custom hooks\n- Follow naming convention: use* prefix',
    isFavorite: true,
    videoTimestamp: '12:34',
    updatedAt: new Date(2026, 5, 12, 14, 30),
  },
  {
    id: 2,
    title: 'ES6 Arrow Functions & Destructuring',
    course: 'JavaScript ES6+',
    category: 'Frontend',
    content:
      '## Arrow Functions\n\n- Concise syntax: `(a, b) => a + b`\n- Lexical `this` binding\n- No own `arguments` object\n\n## Destructuring\n\n### Object Destructuring\n```js\nconst { name, age } = person;\n```\n\n### Array Destructuring\n```js\nconst [first, second] = array;\n```\n\n### Default Values\n```js\nconst { name = "Unknown" } = obj;\n```',
    isFavorite: false,
    videoTimestamp: '05:12',
    updatedAt: new Date(2026, 5, 11, 9, 15),
  },
  {
    id: 3,
    title: 'CSS Grid Layout Patterns',
    course: 'CSS Grid Layout',
    category: 'Frontend',
    content:
      '## Grid Layout Essentials\n\n### Basic Setup\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n```\n\n### Named Grid Areas\n```css\ngrid-template-areas:\n  "header header header"\n  "sidebar main main"\n  "footer footer footer";\n```\n\n### Auto-fit vs Auto-fill\n- `auto-fit`: Collapses empty tracks\n- `auto-fill`: Preserves empty tracks',
    isFavorite: true,
    videoTimestamp: '08:45',
    updatedAt: new Date(2026, 5, 10, 16, 45),
  },
  {
    id: 4,
    title: 'Node.js Event Loop',
    course: 'Node.js Basics',
    category: 'Backend',
    content:
      '## Event Loop Phases\n\n1. **Timers** — execute setTimeout/setInterval callbacks\n2. **Pending callbacks** — I/O callbacks deferred to next loop iteration\n3. **Idle, prepare** — internal\n4. **Poll** — retrieve new I/O events\n5. **Check** — setImmediate callbacks\n6. **Close callbacks** — close events\n\n### Key Concepts\n- Single-threaded but non-blocking\n- Microtasks (Promises) execute before next phase\n- process.nextTick has highest priority',
    isFavorite: false,
    videoTimestamp: '15:20',
    updatedAt: new Date(2026, 5, 9, 11, 20),
  },
  {
    id: 5,
    title: 'System Design — Load Balancing',
    course: 'System Design',
    category: 'DevOps',
    content:
      '## Load Balancing Strategies\n\n### Round Robin\n- Sequential distribution\n- Simple but ignores server capacity\n\n### Least Connections\n- Routes to server with fewest active connections\n- Better for variable request durations\n\n### IP Hash\n- Consistent routing based on client IP\n- Good for session persistence\n\n### Health Checks\n- Active: periodic probes\n- Passive: monitor actual requests',
    isFavorite: true,
    videoTimestamp: '22:10',
    updatedAt: new Date(2026, 5, 8, 13, 0),
  },
  {
    id: 6,
    title: 'REST API Design Principles',
    course: 'Node.js Basics',
    category: 'Backend',
    content:
      '## REST API Best Practices\n\n### Resource Naming\n- Use nouns, not verbs: `/users` not `/getUsers`\n- Plural for collections: `/users`\n- Nest for relationships: `/users/:id/posts`\n\n### HTTP Methods\n- GET: Read\n- POST: Create\n- PUT: Full update\n- PATCH: Partial update\n- DELETE: Remove\n\n### Status Codes\n- 200: Success\n- 201: Created\n- 204: No Content\n- 400: Bad Request\n- 401: Unauthorized\n- 404: Not Found\n- 500: Server Error',
    isFavorite: false,
    videoTimestamp: '31:05',
    updatedAt: new Date(2026, 5, 7, 10, 30),
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'recent', label: 'Recent' },
  { key: 'favorites', label: 'Favorites' },
];

function formatDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CATEGORY_COLORS = {
  Frontend: { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  Backend: { bg: '#ECFDF5', text: '#047857', dot: '#10B981' },
  Design: { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
  DevOps: { bg: '#F5F3FF', text: '#6D28D9', dot: '#8B5CF6' },
  General: { bg: '#F3F4F6', text: '#374151', dot: '#6B7280' },
};

export default function StudyNotes({ currentVideoTimestamp, currentCourse }) {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState(INITIAL_NOTES[0].id);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const videoTime = currentVideoTimestamp || '00:00';
  const autoCourse = currentCourse || '';

  const filteredNotes = useMemo(() => {
    let result = [...notes];
    if (activeTab === 'favorites') result = result.filter((n) => n.isFavorite);
    if (activeTab === 'recent') {
      result = [...result].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.course.toLowerCase().includes(q)
      );
    }
    if (filterCategory) result = result.filter((n) => n.category === filterCategory);
    if (sortBy === 'updated') result.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [notes, activeTab, searchQuery, filterCategory, sortBy]);

  const stats = useMemo(
    () => ({
      total: notes.length,
      favorites: notes.filter((n) => n.isFavorite).length,
    }),
    [notes]
  );

  const handleNewNote = useCallback(() => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled',
      course: autoCourse,
      category: 'General',
      content: '',
      isFavorite: false,
      videoTimestamp: videoTime,
      updatedAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
  }, [autoCourse, videoTime]);

  const handleDeleteNote = useCallback(
    (id) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setActiveNoteId((prevId) => {
        if (prevId === id) {
          const remaining = notes.filter((n) => n.id !== id);
          return remaining.length > 0 ? remaining[0].id : null;
        }
        return prevId;
      });
    },
    [notes]
  );

  const updateNote = useCallback((id, updates) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  }, []);

  const toggleFavorite = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  }, []);

  const handleSave = useCallback(() => {
    updateNote(activeNoteId, { updatedAt: new Date() });
    setSavedAt(new Date());
    setIsEditing(false);
  }, [activeNoteId, updateNote]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  return (
    <div className="sn-root">
      {/* Compact Header */}
      <header className="sn-header">
        <div className="sn-header-left">
          <button
            className="sn-sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          <h1 className="sn-header-title">Study Notes</h1>
          <div className="sn-header-divider" />
          <span className="sn-header-stat">{stats.total} notes</span>
          <span className="sn-header-stat-dot" />
          <span className="sn-header-stat">{stats.favorites} favorites</span>
          <span className="sn-header-stat-dot" />
          <span className="sn-header-timestamp-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {videoTime}
          </span>
        </div>
        <div className="sn-header-right">
          <div className="sn-header-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="sn-search-clear" onClick={() => setSearchQuery('')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button className="sn-header-new" onClick={handleNewNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Note
          </button>
        </div>
      </header>

      <div className="sn-body">
        {/* Sidebar */}
        <aside className={`sn-sidebar ${sidebarCollapsed ? 'sn-sidebar--collapsed' : ''}`}>
          {/* Filter tabs */}
          <div className="sn-sidebar-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`sn-sidebar-tab ${activeTab === tab.key ? 'sn-sidebar-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="sn-sidebar-tab-count">
                  {tab.key === 'all'
                    ? notes.length
                    : tab.key === 'favorites'
                    ? stats.favorites
                    : Math.min(5, notes.length)}
                </span>
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="sn-sidebar-filters">
            <select
              className="sn-filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="sn-filter-select sn-filter-select--sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updated">Last updated</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>

          {/* Notes list */}
          <div className="sn-sidebar-list">
            {filteredNotes.length === 0 && (
              <div className="sn-sidebar-empty">No notes found</div>
            )}
            {filteredNotes.map((note) => {
              const cat = CATEGORY_COLORS[note.category] || CATEGORY_COLORS.General;
              return (
                <button
                  key={note.id}
                  className={`sn-note-item ${activeNoteId === note.id ? 'sn-note-item--active' : ''}`}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setIsEditing(false);
                  }}
                >
                  <div className="sn-note-item-top">
                    <span className="sn-note-item-title">{note.title}</span>
                    {note.isFavorite && (
                      <span className="sn-note-item-icons">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="sn-note-item-meta">
                    <span className="sn-note-item-course">{note.course}</span>
                    <span
                      className="sn-note-item-cat"
                      style={{ color: cat.text, backgroundColor: cat.bg }}
                    >
                      <span className="sn-note-item-cat-dot" style={{ backgroundColor: cat.dot }} />
                      {note.category}
                    </span>
                  </div>
                  <div className="sn-note-item-footer">
                    <span className="sn-note-item-date">{formatDate(note.updatedAt)}</span>
                    <span className="sn-note-item-video-time">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {note.videoTimestamp}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="sn-workspace">
          {activeNote ? (
            <div className="sn-editor">
              {/* Editor toolbar */}
              <div className="sn-editor-bar">
                <div className="sn-editor-bar-left">
                  <button
                    className={`sn-action-btn ${activeNote.isFavorite ? 'sn-action-btn--on' : ''}`}
                    onClick={() => toggleFavorite(activeNote.id)}
                    title="Favorite"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={activeNote.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                  <div className="sn-editor-bar-sep" />
                  <select
                    className="sn-inline-select"
                    value={activeNote.category}
                    onChange={(e) => updateNote(activeNote.id, { category: e.target.value })}
                    disabled={!isEditing}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    className="sn-inline-select"
                    value={activeNote.course}
                    onChange={(e) => updateNote(activeNote.id, { course: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="">Select course</option>
                    {COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="sn-editor-bar-right">
                  <span className="sn-editor-video-time">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {activeNote.videoTimestamp}
                  </span>
                  <span className="sn-editor-timestamp">{formatDate(activeNote.updatedAt)}</span>
                  {isEditing ? (
                    <button className="sn-save-btn" onClick={handleSave}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Save
                    </button>
                  ) : (
                    <button className="sn-edit-btn" onClick={handleEdit}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                  )}
                  <button
                    className="sn-action-btn sn-action-btn--danger"
                    onClick={() => handleDeleteNote(activeNote.id)}
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Title */}
              <input
                type="text"
                className="sn-editor-title"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                placeholder="Untitled"
                readOnly={!isEditing}
              />

              {/* Metadata row */}
              <div className="sn-editor-meta">
                <span
                  className="sn-editor-cat-badge"
                  style={{
                    color: CATEGORY_COLORS[activeNote.category]?.text,
                    backgroundColor: CATEGORY_COLORS[activeNote.category]?.bg,
                  }}
                >
                  <span
                    className="sn-editor-cat-dot"
                    style={{ backgroundColor: CATEGORY_COLORS[activeNote.category]?.dot }}
                  />
                  {activeNote.category}
                </span>
                {activeNote.course && (
                  <span className="sn-editor-course">{activeNote.course}</span>
                )}
                {savedAt && !isEditing && (
                  <span className="sn-editor-saved">Saved {formatDate(savedAt)}</span>
                )}
              </div>

              {/* Content */}
              <textarea
                className="sn-editor-content"
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                placeholder="Start writing..."
                readOnly={!isEditing}
              />
            </div>
          ) : (
            <div className="sn-empty-state">
              <div className="sn-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>No note selected</h3>
              <p>Choose a note from the library or create a new one</p>
              <button className="sn-empty-btn" onClick={handleNewNote}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Note
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
