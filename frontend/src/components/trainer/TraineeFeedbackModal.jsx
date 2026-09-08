import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import trainerService from '../../services/trainerService';
import '../../styles/trainer/feedback-modal.css';

export default function TraineeFeedbackModal({
  isOpen,
  onClose,
  trainee,
  batchId,
  onFeedbackSubmitted,
}) {
  const [category, setCategory] = useState('TECHNICAL');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [strengths, setStrengths] = useState('');
  const [areasOfImprovement, setAreasOfImprovement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isOpen && trainee?.trainee_id) {
      // Reset form
      setCategory('TECHNICAL');
      setRating(5);
      setFeedbackText('');
      setStrengths('');
      setAreasOfImprovement('');
      setShowHistory(false);

      // Fetch history
      trainerService.getTraineeFeedbackHistory(trainee.trainee_id)
        .then((res) => setHistory(res || []))
        .catch((err) => console.error('Error fetching feedback history:', err));
    }
  }, [isOpen, trainee]);

  if (!isOpen || !trainee) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      alert('Please enter constructive feedback remarks.');
      return;
    }

    try {
      setIsSubmitting(true);
      await trainerService.submitTraineeFeedback(trainee.trainee_id, {
        batch_id: batchId,
        category,
        rating,
        feedback_text: feedbackText.trim(),
        strengths: strengths.trim() || null,
        areas_of_improvement: areasOfImprovement.trim() || null,
      });

      alert(`Feedback submitted successfully for ${trainee.name}!`);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
      onClose();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 5: return 'Outstanding (5/5)';
      case 4: return 'Exceeds Expectations (4/5)';
      case 3: return 'Meets Standards (3/5)';
      case 2: return 'Needs Guidance (2/5)';
      case 1: return 'Critical Support Needed (1/5)';
      default: return '';
    }
  };

  return (
    <div className="feedback-modal-backdrop" onClick={onClose}>
      <div
        className="feedback-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="feedback-modal-header">
          <div className="feedback-modal-trainee-profile">
            <div
              className="feedback-trainee-avatar"
              style={{ backgroundColor: trainee.color || '#2563eb' }}
            >
              {trainee.initials || (trainee.name ? trainee.name.substring(0, 2).toUpperCase() : 'TR')}
            </div>
            <div className="feedback-trainee-names">
              <h3>{trainee.name}</h3>
              <span>ID: {trainee.employee_id} • {trainee.email}</span>
            </div>
          </div>
          <button
            type="button"
            className="feedback-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="x" style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="feedback-modal-body">
            {/* Feedback History Toggle */}
            {history.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {history.length} previous review{history.length > 1 ? 's' : ''} on record
                </span>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Hide Previous Reviews' : 'View Previous Reviews'}
                </button>
              </div>
            )}

            {/* Historical Reviews List */}
            {showHistory && (
              <div className="feedback-history-list">
                {history.map((h) => (
                  <div key={h.id} className="feedback-history-item">
                    <div className="feedback-history-header">
                      <strong style={{ color: '#0f172a' }}>{h.category}</strong>
                      <span style={{ color: '#d97706', fontWeight: 600 }}>★ {h.rating}/5</span>
                    </div>
                    <p style={{ margin: '0.2rem 0', color: '#334155' }}>"{h.feedback_text}"</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      <span>By {h.trainer_name}</span>
                      <span>{new Date(h.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Category Select */}
            <div className="feedback-form-group">
              <label htmlFor="feedback-category">
                Review Focus Area
              </label>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="TECHNICAL">Technical Skills & Syntax Mastery</option>
                <option value="PROBLEM_SOLVING">Problem Solving & Algorithms</option>
                <option value="COMMUNICATION">Team Collaboration & Communication</option>
                <option value="GENERAL">General Mentorship & Work Ethic</option>
              </select>
            </div>

            {/* Star Rating */}
            <div className="feedback-form-group">
              <label>
                Overall Competency Rating
              </label>
              <div className="feedback-stars-container">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      className={`feedback-star-btn ${isActive ? 'active' : ''}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} star`}
                    >
                      <Icon
                        name="star"
                        style={{
                          width: 22,
                          height: 22,
                          fill: isActive ? '#f59e0b' : 'none',
                          stroke: isActive ? '#f59e0b' : '#94a3b8',
                        }}
                      />
                    </button>
                  );
                })}
                <span className="feedback-rating-label">
                  {getRatingLabel(hoverRating || rating)}
                </span>
              </div>
            </div>

            {/* Remarks / Guidance */}
            <div className="feedback-form-group">
              <label htmlFor="feedback-remarks">
                Actionable Remarks & Feedback *
              </label>
              <textarea
                id="feedback-remarks"
                rows={3}
                placeholder="Share specific observations, code-level feedback, or suggestions to help the trainee progress..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
              />
            </div>

            {/* Strengths & Improvement in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="feedback-form-group">
                <label htmlFor="feedback-strengths">Key Strengths</label>
                <input
                  id="feedback-strengths"
                  type="text"
                  placeholder="e.g. Clean OOP design, proactive"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                />
              </div>

              <div className="feedback-form-group">
                <label htmlFor="feedback-improvement">Focus Area</label>
                <input
                  id="feedback-improvement"
                  type="text"
                  placeholder="e.g. Edge case testing, regex"
                  value={areasOfImprovement}
                  onChange={(e) => setAreasOfImprovement(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="feedback-modal-footer">
            <button
              type="button"
              className="feedback-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="feedback-submit-btn"
              disabled={isSubmitting}
            >
              <Icon name="check" style={{ width: 16, height: 16 }} />
              <span>{isSubmitting ? 'Saving...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
