import React, { useMemo, useState } from "react";
import "../styles/StudyNotes.css";

const initialNotes = [
  {
    id: 1,
    title: "Java Basics - OOP Concepts",
    category: "Java",
    date: "Today",
    videoTime: "04:12",
    pinned: true,
    content:
      "Object-Oriented Programming is based on classes and objects. The four main principles are encapsulation, inheritance, polymorphism, and abstraction.",
  },
  {
    id: 2,
    title: "Collections Framework",
    category: "Java",
    date: "Yesterday",
    videoTime: "12:34",
    pinned: false,
    content:
      "List, Set, and Map are the three major interfaces. ArrayList preserves insertion order, HashSet stores unique values, and HashMap stores key-value pairs.",
  },
  {
    id: 3,
    title: "Exception Handling",
    category: "Assessment",
    date: "Jun 20, 2026",
    videoTime: "45:10",
    pinned: false,
    content:
      "Use try-catch-finally to manage runtime issues. Checked exceptions must be handled or declared, while unchecked exceptions occur during execution.",
  },
  {
    id: 4,
    title: "SQL Quick Revision",
    category: "Database",
    date: "Jun 18, 2026",
    videoTime: "01:15:20",
    pinned: false,
    content:
      "Important commands include SELECT, INSERT, UPDATE, DELETE, GROUP BY, ORDER BY, and JOIN. Normalization improves data consistency.",
  },
];

const AVAILABLE_LANGUAGES = ["Java", "React", "JavaScript", "Python", "SQL", "Database", "Assessment", "General"];

export default function StudyNotes() {
  const [notes, setNotes] = useState(initialNotes);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedNoteId, setSelectedNoteId] = useState(initialNotes[0]?.id || null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const [rightPanelMode, setRightPanelMode] = useState("view");

  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Java");
  const [formContent, setFormContent] = useState("");
  const [formVideoTime, setFormVideoTime] = useState("");

  const categories = useMemo(() => {
    return ["All", ...new Set(notes.map((note) => note.category))];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesCategory = activeCategory === "All" || note.category === activeCategory;
        const matchesSearch =
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()) ||
          note.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [notes, search, activeCategory]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const openCreateMode = () => {
    setFormTitle("");
    setFormCategory("React"); 
    setFormContent("");
    setFormVideoTime("03:45");
    setRightPanelMode("create");
  };

  const openEditMode = () => {
    if (!selectedNote) return;
    setFormTitle(selectedNote.title);
    setFormCategory(selectedNote.category);
    setFormContent(selectedNote.content);
    setFormVideoTime(selectedNote.videoTime || "00:00");
    setRightPanelMode("edit");
  };

  const handleSaveNote = () => {
    if (!formTitle.trim() || !formContent.trim()) return;

    if (rightPanelMode === "create") {
      const newNote = {
        id: Date.now(),
        title: formTitle.trim(),
        category: formCategory,
        date: "Just now",
        videoTime: formVideoTime || "00:00",
        pinned: false,
        content: formContent.trim(),
      };
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
    } else if (rightPanelMode === "edit") {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNoteId
            ? {
                ...note,
                title: formTitle.trim(),
                category: formCategory,
                content: formContent.trim(),
                videoTime: formVideoTime,
              }
            : note
        )
      );
    }
    setRightPanelMode("view");
  };

  const confirmDeleteNote = (id, e) => {
    e.stopPropagation();
    setNoteIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleExecuteDelete = () => {
    if (!noteIdToDelete) return;
    const updated = notes.filter((note) => note.id !== noteIdToDelete);
    setNotes(updated);
    if (selectedNoteId === noteIdToDelete) {
      setSelectedNoteId(updated[0]?.id || null);
      setRightPanelMode("view");
    }
    setShowDeleteModal(false);
    setNoteIdToDelete(null);
  };

  const handleTogglePin = (id, e) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  return (
    <div className="study-notes-fullscreen">
      
      {/* CUSTOM POPUP DELETE MODAL */}
      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box">
            <h3>Delete Study Note</h3>
            <p>Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="custom-modal-actions">
              <button className="modal-btn-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="modal-btn-confirm" onClick={handleExecuteDelete}>
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO HEADER */}
      <header className="notes-hero-premium">
        <div className="notes-hero-left">
          <div>
            <h1 className="white-title text-shadow-subtle">Study Notes</h1>
            <p className="light-subtext">Organize your learning, summaries, and quick revisions</p>
          </div>
        </div>

        <div className="notes-search-wrapper">
          <input
            type="text"
            className="notes-search-input-premium"
            placeholder="Search notes, topics, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear-btn" onClick={() => setSearch("")} title="Clear search">
              &times;
            </button>
          )}
        </div>

        <div className="notes-hero-stats">
          <button className="primary-nav-btn-light" onClick={openCreateMode}>
            + Create Note
          </button>
        </div>
      </header>

      {/* CATEGORIES STRIP */}
      <div className="notes-filter-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-chip ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT SPLIT */}
      <main className="workspace-layout">
        
        {/* SIDEBAR */}
        <section className="workspace-sidebar">
          <div className="sidebar-header">
            <h2>Your Notes</h2>
            <span>{filteredNotes.length} items</span>
          </div>

          <div className="sidebar-scrollable">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`note-list-item ${selectedNoteId === note.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setRightPanelMode("view");
                  }}
                >
                  <div className="note-list-top">
                    <span className="note-badge">{note.category}</span>
                    <div className="card-badges-right">
                      {note.videoTime && <span className="timestamp-badge">⏱ {note.videoTime}</span>}
                      {note.pinned && <span className="pin-tag">Pinned</span>}
                    </div>
                  </div>

                  <h3>{note.title}</h3>
                  {/* Expanded preview length parameter to look balanced inside full screen deck list layouts */}
                  <p>{note.content.slice(0, 110)}...</p>

                  <div className="note-list-footer">
                    <span>{note.date}</span>
                    <div className="note-actions">
                      <button onClick={(e) => handleTogglePin(note.id, e)}>
                        {note.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={(e) => confirmDeleteNote(note.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-notes">
                <h3>No notes found</h3>
                <p>Try changing the search or create a new note.</p>
                <button className="link-style-btn" onClick={openCreateMode}>
                  + Create note now
                </button>
              </div>
            )}
          </div>
        </section>

        {/* DETAILS WORKSPACE PANEL */}
        <section className="workspace-main-panel">
          {rightPanelMode === "view" && selectedNote && (
            <div className="note-detailed-view">
              <div className="view-header-meta">
                <div className="meta-left">
                  <span className="preview-category">{selectedNote.category}</span>
                  {selectedNote.videoTime && (
                    <span className="preview-timestamp">⏱ Timestamp: <strong>{selectedNote.videoTime}</strong></span>
                  )}
                </div>
                <div className="meta-right">
                  <button className="secondary-action-btn" onClick={openEditMode}>Edit Note</button>
                </div>
              </div>
              <h2 className="detailed-title">{selectedNote.title}</h2>
              <p className="detailed-date-subtitle">Saved {selectedNote.date}</p>
              <hr className="divider" />
              <p className="detailed-content">{selectedNote.content}</p>
            </div>
          )}

          {(rightPanelMode === "create" || rightPanelMode === "edit") && (
            <div className="note-form-workspace">
              <div className="form-workspace-header">
                <h2>{rightPanelMode === "create" ? "Create Note" : "Edit Note"}</h2>
                <button className="close-form-btn" onClick={() => setRightPanelMode("view")}>Cancel</button>
              </div>
              
              <div className="form-grid-fields">
                <div className="field-group">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Note title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                <div className="field-row-split">
                  <div className="field-group">
                    <label>Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="form-select"
                    >
                      {AVAILABLE_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Video Timestamp</label>
                    <input
                      type="text"
                      placeholder="00:00"
                      value={formVideoTime}
                      onChange={(e) => setFormVideoTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group body-group">
                  <label>Content</label>
                  <textarea
                    placeholder="Write your study note here..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-workspace-footer">
                <button className="add-note-btn-premium" onClick={handleSaveNote}>
                  Save Note
                </button>
              </div>
            </div>
          )}

          {(!selectedNote && rightPanelMode === "view") && (
            <div className="empty-state-main">
              <h3>No note selected</h3>
              <p>Select a note from your deck list or generate a new study timeline marker.</p>
              <button className="add-note-btn-premium" onClick={openCreateMode}>+ Create note now</button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}