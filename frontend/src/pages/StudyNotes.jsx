import React, { useState } from 'react';
import "../styles/StudyNotes.css";

const initialNotes = [
  {
    id: 1,
    title: 'AI201',
    content: 'TEST',
    date: 'May 3, 2026',
    color: '#f5e6fe',
    pinned: true,
    tag: 'Artificial Intelligence'
  },
  {
    id: 2,
    title: 'Database Systems',
    content: 'Normalization: 1NF, 2NF, 3NF, BCNF - Eliminate repeating groups - Remove partial dependencies - Remove transitive dependencies',
    date: 'May 1, 2026',
    color: '#e6f0fa',
    pinned: true,
    tag: 'Core CS'
  },
  {
    id: 3,
    title: 'Machine Learning',
    content: 'Supervised vs Unsupervised Learning Key algorithms to review for midterm.',
    date: 'Apr 30, 2026',
    color: '#eafaf1',
    pinned: false,
    tag: 'Artificial Intelligence'
  },
  {
    id: 4,
    title: 'Web Development',
    content: 'React Hooks: - useState - useEffect - useContext - useMemo - useCallback',
    date: 'Apr 28, 2026',
    color: '#fef7e0',
    pinned: false,
    tag: 'Fullstack'
  },
  {
    id: 5,
    title: 'Data Structures',
    content: 'Time Complexity: O(1) - Constant, O(log n) - Logarithmic, O(n) - Linear, O(n²) - Quadratic',
    date: 'Apr 27, 2026',
    color: '#fdeaf2',
    pinned: false,
    tag: 'Core CS'
  },
  {
    id: 6,
    title: 'Algorithms',
    content: 'Sorting Algorithms: QuickSort, MergeSort, HeapSort Best for different scenarios.',
    date: 'Apr 25, 2026',
    color: '#eef2fe',
    pinned: false,
    tag: 'Core CS'
  }
];

const pastelColors = ['#f5e6fe', '#e6f0fa', '#eafaf1', '#fef7e0', '#fdeaf2', '#eef2fe'];

export default function StudyNotes() {
  const [notes, setNotes] = useState(initialNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewLayout, setViewLayout] = useState('grid');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);

  const handleOpenNote = (note) => {
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTag(note.tag || '');
    setIsEditing(false);
    setCopySuccess(false);
  };

  const handleSaveNote = () => {
    const finalTitle = editTitle.trim() || 'Untitled Note';
    const finalContent = editContent.trim() || 'No content provided.';
    const finalTag = editTag.trim() || 'General';

    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === activeNote.id
          ? { ...note, title: finalTitle, content: finalContent, tag: finalTag }
          : note
      )
    );
    setActiveNote(null);
  };

  const triggerDeleteConfirmation = (id) => {
    setNoteIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteIdToDelete));
    setActiveNote(null);
    setShowDeleteModal(false);
    setNoteIdToDelete(null);
  };

  const handleTogglePin = (e, id) => {
    e.stopPropagation();
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const handleCreateNote = () => {
    const randomColor = pastelColors[notes.length % pastelColors.length];
    const newNote = {
      id: Date.now(),
      title: '',
      content: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color: randomColor,
      pinned: false,
      tag: ''
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditTitle('');
    setEditContent('');
    setEditTag('');
    setIsEditing(true);
    setCopySuccess(false);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const totalNotesCount = notes.length;
  const pinnedNotesCount = notes.filter(n => n.pinned).length;
  const sortedNotes = [...notes].sort((a, b) => b.pinned - a.pinned);

  const filteredNotes = sortedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box">
            <div className="modal-icon-warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
            <h3 className="modal-title">Delete Study Note?</h3>
            <p className="modal-message">Are you sure you want to delete this? This action cannot be undone.</p>
            <div className="modal-actions-row">
              <button className="modal-btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="modal-btn-confirm" onClick={handleConfirmDelete}>Delete Note</button>
            </div>
          </div>
        </div>
      )}

      {activeNote ? (
        <div className="internal-focus-view" style={{ backgroundColor: activeNote.color }}>
          <div className="focus-header">
            <button className="focus-back-btn focus-themed-action" onClick={() => setActiveNote(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Overview</span>
            </button>
            <div className="focus-actions">
              {!isEditing && (
                <button 
                  className={`focus-copy-btn focus-themed-action ${copySuccess ? 'copy-success-active' : ''}`} 
                  onClick={() => handleCopyToClipboard(activeNote.content)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>{copySuccess ? 'Copied!' : 'Copy Text'}</span>
                </button>
              )}
              {isEditing ? (
                <button className="focus-save-btn" onClick={handleSaveNote}>Save Changes</button>
              ) : (
                <button className="focus-edit-btn" onClick={() => setIsEditing(true)}>Edit Note</button>
              )}
              <button className="focus-delete-btn" onClick={() => triggerDeleteConfirmation(activeNote.id)}>Delete</button>
            </div>
          </div>

          <div className="focus-body">
            {isEditing ? (
              <div className="focus-edit-form">
                <div className="edit-form-row">
                  <div className="input-group">
                    <label className="field-label">Subject / Title</label>
                    <input
                      type="text"
                      className="focus-title-input"
                      value={editTitle}
                      placeholder="Enter subject title..."
                      autoFocus
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>
                  <div className="input-group compact">
                    <label className="field-label">Category Tag</label>
                    <input
                      type="text"
                      className="focus-tag-input"
                      value={editTag}
                      placeholder="e.g. Core CS, Fullstack"
                      onChange={(e) => setEditTag(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="input-group textarea-group">
                  <div className="label-counter-row">
                    <label className="field-label">Notes Content</label>
                    <span className="character-counter">{editContent.length} characters</span>
                  </div>
                  <textarea
                    className="focus-textarea"
                    value={editContent}
                    placeholder="Start typing your study notes here..."
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="focus-preview-pane">
                <div className="preview-meta-row">
                  <span className="focus-tag-badge">{activeNote.tag || 'General'}</span>
                  {activeNote.pinned && <span className="focus-pinned-badge">📌 Pinned</span>}
                </div>
                <h2 className="focus-title-heading">{activeNote.title || 'Untitled Note'}</h2>
                <p className="focus-content-text">{activeNote.content || 'No content provided.'}</p>
                <div className="focus-date-stamp">Last Modified: {activeNote.date}</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Modified height via inline vertical padding styles here */}
          <header className="notes-dashboard-header" style={{ padding: '40px 32px' }}>
            <div className="header-identity">
              <div className="branding-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b52f6" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className="branding-text">
                <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Study Notes</h1>
                <p style={{ fontSize: '1rem' }}>Create and organize your study materials</p>
              </div>
            </div>
            
            <button className="header-action-add-btn" onClick={handleCreateNote}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>New Note</span>
            </button>
          </header>

          <div className="dashboard-search-bar-row">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search notes..."
                className="dashboard-search-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')} title="Clear search">
                  ✕
                </button>
              )}
            </div>
            
            <div className="dashboard-controls-right-group">
              <div className="dashboard-inline-counters">
                <div className="inline-stat-pill">
                  <span className="stat-value">{totalNotesCount}</span>
                  <span className="stat-label">Total Notes</span>
                </div>
                <div className="inline-stat-pill">
                  <span className="stat-value">{pinnedNotesCount}</span>
                  <span className="stat-label">Pinned</span>
                </div>
              </div>

              <div className="dashboard-layout-selectors">
                <button 
                  className={`layout-btn ${viewLayout === 'list' ? 'active' : ''}`}
                  onClick={() => setViewLayout('list')}
                  title="List View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                </button>
                <button 
                  className={`layout-btn ${viewLayout === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewLayout('grid')}
                  title="Grid View"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </button>
              </div>
            </div>
          </div>

          {filteredNotes.length > 0 ? (
            <main className={`dashboard-notes-grid-container ${viewLayout === 'list' ? 'layout-list-active' : ''}`}>
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`dashboard-individual-card ${note.pinned ? 'is-pinned' : ''}`}
                  style={{ backgroundColor: note.color }}
                  onClick={() => handleOpenNote(note)}
                >
                  <div className="card-top-content">
                    <div className="card-meta-header">
                      <span className="card-tag-pill">{note.tag || 'General'}</span>
                      <button 
                        className={`card-pin-trigger ${note.pinned ? 'pinned-active' : 'hidden-pin'}`}
                        onClick={(e) => handleTogglePin(e, note.id)}
                        title={note.pinned ? "Unpin Note" : "Pin Note"}
                      >
                        📌
                      </button>
                    </div>
                    <h3 className="card-item-title">{note.title || 'Untitled Note'}</h3>
                    <p className="card-item-body">{note.content || 'No content provided.'}</p>
                  </div>
                  <div className="card-item-footer-date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {note.date}
                  </div>
                </div>
              ))}
            </main>
          ) : (
            <div className="dashboard-empty-state">
              <div className="empty-state-icon-container">
                {searchQuery ? (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                )}
              </div>
              <h3 className="empty-state-title">
                {searchQuery ? "No matches found" : "No notes yet"}
              </h3>
              <p className="empty-state-message">
                {searchQuery 
                  ? `Could not find any results for "${searchQuery}". Please check your spelling or refine your keywords.`
                  : "Your study collection is empty. Create a brand new note to begin organizing your workspace."
                }
              </p>
              <button 
                className="empty-state-btn" 
                onClick={searchQuery ? () => setSearchQuery('') : handleCreateNote}
              >
                {searchQuery ? "Clear Search Filter" : "Create First Note"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}