import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import trainerService from '../../services/trainerService';
import TraineeFeedbackModal from '../../components/trainer/TraineeFeedbackModal';
import '../../styles/trainer/batch-management.css';

export default function BatchManagement() {
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [rankingsData, setRankingsData] = useState(null);
  const [viewMode, setViewMode] = useState('progress'); // 'progress' | 'rankings'

  const [isBatchesLoading, setIsBatchesLoading] = useState(true);
  const [isTraineesLoading, setIsTraineesLoading] = useState(false);
  const [isRankingsLoading, setIsRankingsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Feedback Modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedTraineeForFeedback, setSelectedTraineeForFeedback] = useState(null);

  // Fetch batches on mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsBatchesLoading(true);
        const result = await trainerService.getBatches();
        setBatches(result);
        if (result.length > 0) {
          setActiveTab(result[0].id);
        }
      } catch (err) {
        console.error('Error fetching batches:', err);
        setError('Error loading batches');
      } finally {
        setIsBatchesLoading(false);
      }
    };
    fetchBatches();
  }, []);

  // Fetch trainees when activeTab changes
  const fetchTrainees = async (batchId) => {
    try {
      setIsTraineesLoading(true);
      const result = await trainerService.getBatchTrainees(batchId);
      setTrainees(result);
    } catch (err) {
      console.error('Error fetching trainees:', err);
    } finally {
      setIsTraineesLoading(false);
    }
  };

  // Fetch rankings when activeTab changes or viewMode is rankings
  const fetchRankings = async (batchId) => {
    try {
      setIsRankingsLoading(true);
      const result = await trainerService.getBatchRankings(batchId);
      setRankingsData(result);
    } catch (err) {
      console.error('Error fetching rankings:', err);
    } finally {
      setIsRankingsLoading(false);
    }
  };

  useEffect(() => {
    if (!activeTab) return;
    fetchTrainees(activeTab);
    fetchRankings(activeTab);
  }, [activeTab]);

  const handleOpenFeedback = (trainee) => {
    setSelectedTraineeForFeedback(trainee);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmitted = () => {
    if (activeTab) {
      fetchRankings(activeTab);
      fetchTrainees(activeTab);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'On Track':
        return 'status-on-track';
      case 'Behind Schedule':
        return 'status-behind-schedule';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const getAttendanceClass = (pct) => {
    if (pct >= 90) return 'attendance-high';
    if (pct >= 75) return 'attendance-medium';
    return 'attendance-low';
  };

  const getProgressBarColorClass = (status) => {
    switch (status) {
      case 'On Track':
        return 'bar-blue';
      case 'Behind Schedule':
        return 'bar-amber';
      case 'Completed':
        return 'bar-green';
      default:
        return 'bar-blue';
    }
  };

  const getTierClass = (tier) => {
    switch (tier) {
      case 'Top Performer':
        return 'tier-top';
      case 'On Track':
        return 'tier-ontrack';
      case 'Needs Attention':
        return 'tier-attention';
      default:
        return 'tier-ontrack';
    }
  };

  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-other';
  };

  if (isBatchesLoading) {
    return (
      <div className="batch-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Loading Batch Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="batch-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ color: '#dc2626', fontWeight: 600 }}>{error}</div>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="batch-container" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No Batches Assigned</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>You are not currently assigned to any batches as a trainer.</p>
      </div>
    );
  }

  return (
    <div className="batch-container">
      {/* 1. Page Header */}
      <div className="batch-banner">
        <div className="batch-banner-left">
          <h2>Trainee Batch Management</h2>
          <p>Track academic progress, course syllabus completion rate, and candidate rankings.</p>
        </div>
        <div className="batch-summary-pills">
          <div className="batch-summary-pill">
            <Icon name="users" style={{ width: '15px', height: '15px' }} />
            <span>Active: {batches.length} Batches</span>
          </div>
        </div>
      </div>

      {/* 2. Multi-tab Selector */}
      <div className="batch-tab-bar">
        {batches.map((batch) => (
          <button
            key={batch.id}
            className={`batch-tab ${activeTab === batch.id ? 'active' : ''}`}
            onClick={() => setActiveTab(batch.id)}
          >
            <span>{batch.name} — {batch.course_name}</span>
            <span className="batch-tab-count">{batch.trainee_count}</span>
          </button>
        ))}
      </div>

      {/* 3. Mode Toggle (Progress View vs Auto-Rankings) */}
      <div className="batch-mode-toggle-wrap">
        <div className="batch-mode-toggle">
          <button
            type="button"
            className={`batch-mode-btn ${viewMode === 'progress' ? 'active' : ''}`}
            onClick={() => setViewMode('progress')}
          >
            <Icon name="check-circle" style={{ width: 15, height: 15 }} />
            <span>Syllabus & Attendance</span>
          </button>
          <button
            type="button"
            className={`batch-mode-btn ${viewMode === 'rankings' ? 'active' : ''}`}
            onClick={() => setViewMode('rankings')}
          >
            <Icon name="award" style={{ width: 15, height: 15 }} />
            <span>Auto-Rankings & Standings</span>
          </button>
        </div>

        {viewMode === 'rankings' && rankingsData && (
          <div className="batch-ranking-summary-badge">
            <Icon name="bar-chart-2" style={{ width: 14, height: 14 }} />
            <span>Batch Average: {rankingsData.batch_average_score}%</span>
            {rankingsData.top_performer && (
              <span style={{ marginLeft: 6, color: '#047857' }}>
                • Top: {rankingsData.top_performer}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. Trainee Data Table */}
      <div className="trainee-table-card">
        {/* Table Header */}
        {viewMode === 'progress' ? (
          <div className="trainee-table-header">
            <div className="trainee-table-col-label">Employee Profile</div>
            <div className="trainee-table-col-label">Progress Track</div>
            <div className="trainee-table-col-label">Attendance</div>
            <div className="trainee-table-col-label">Status & Action</div>
          </div>
        ) : (
          <div className="trainee-table-header ranking-header">
            <div className="trainee-table-col-label" style={{ textAlign: 'center' }}>Rank</div>
            <div className="trainee-table-col-label">Candidate Profile</div>
            <div className="trainee-table-col-label">Composite Score</div>
            <div className="trainee-table-col-label">Assessments</div>
            <div className="trainee-table-col-label">Assignments</div>
            <div className="trainee-table-col-label">Trainer Review</div>
          </div>
        )}

        <div className="trainee-table-body">
          {viewMode === 'progress' ? (
            /* PROGRESS VIEW */
            isTraineesLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-medium)' }}>
                Loading trainees for this batch...
              </div>
            ) : trainees.length === 0 ? (
              <div className="trainee-table-empty">No trainees registered in this batch.</div>
            ) : (
              trainees.map((trainee) => {
                const name = trainee.name || 'Trainee';
                const parts = name.split(' ').filter(Boolean);
                const initials = parts.map(p => p[0].toUpperCase()).join('').substring(0, 2) || 'TR';
                const colors = ["#3563e9", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#0dcd94"];
                const color = colors[trainee.trainee_id % colors.length] || '#3563e9';

                return (
                  <div key={trainee.trainee_id} className="trainee-row">
                    {/* Employee Profile Cell */}
                    <div className="trainee-profile-cell">
                      <div
                        className="trainee-avatar"
                        style={{ backgroundColor: color }}
                      >
                        {initials}
                      </div>
                      <div className="trainee-info">
                        <span className="trainee-name">{name}</span>
                        <span className="trainee-email">{trainee.email}</span>
                        <span className="trainee-emp-id">ID: {trainee.employee_id}</span>
                      </div>
                    </div>

                    {/* Progress Track Cell */}
                    <div className="trainee-progress-cell">
                      <div className="trainee-progress-label">
                        <span className="trainee-progress-course">{trainee.progress_label}</span>
                        <span className="trainee-progress-pct">{trainee.progress_pct}%</span>
                      </div>
                      <div className="trainee-progress-track">
                        <div
                          className={`trainee-progress-bar ${getProgressBarColorClass(trainee.status)}`}
                          style={{ width: `${trainee.progress_pct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Attendance Cell */}
                    <div className="trainee-attendance-cell">
                      <span className={`attendance-badge ${getAttendanceClass(trainee.attendance_pct)}`}>
                        {trainee.attendance_pct}% Attendance
                      </span>
                    </div>

                    {/* Status & Feedback Action */}
                    <div className="trainee-status-cell" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span className={`status-badge ${getStatusClass(trainee.status)}`}>
                        {trainee.status}
                      </span>
                      <button
                        type="button"
                        className="feedback-action-btn"
                        onClick={() => handleOpenFeedback({ ...trainee, color, initials })}
                      >
                        <Icon name="message-square" style={{ width: 13, height: 13 }} />
                        <span>Feedback</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* RANKINGS & STANDINGS VIEW */
            isRankingsLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-medium)' }}>
                Calculating dynamic rankings from assessment and assignment metrics...
              </div>
            ) : !rankingsData || rankingsData.rankings.length === 0 ? (
              <div className="trainee-table-empty">No performance data found for ranking calculations.</div>
            ) : (
              rankingsData.rankings.map((item) => {
                const name = item.name || 'Trainee';
                const parts = name.split(' ').filter(Boolean);
                const initials = parts.map(p => p[0].toUpperCase()).join('').substring(0, 2) || 'TR';
                const colors = ["#3563e9", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#0dcd94"];
                const color = colors[item.trainee_id % colors.length] || '#3563e9';

                return (
                  <div key={item.trainee_id} className="trainee-row ranking-row">
                    {/* Rank Badge */}
                    <div className="rank-badge-cell">
                      <div className={`rank-badge ${getRankBadgeClass(item.rank)}`}>
                        #{item.rank}
                      </div>
                    </div>

                    {/* Candidate Profile */}
                    <div className="trainee-profile-cell">
                      <div
                        className="trainee-avatar"
                        style={{ backgroundColor: color }}
                      >
                        {initials}
                      </div>
                      <div className="trainee-info">
                        <span className="trainee-name">{name}</span>
                        <span className="trainee-email">{item.email}</span>
                        <span className="trainee-emp-id">ID: {item.employee_id} • Top {item.percentile}%</span>
                      </div>
                    </div>

                    {/* Composite Score & Tier */}
                    <div className="composite-score-cell">
                      <span className="composite-score-value">{item.composite_score}%</span>
                      <span className={`tier-badge ${getTierClass(item.tier)}`}>
                        {item.tier}
                      </span>
                    </div>

                    {/* Assessments Breakdown */}
                    <div className="ranking-metric-cell">
                      <span className="ranking-metric-num">{item.breakdown.assessment_avg}%</span>
                      <span className="ranking-metric-sub">
                        {item.breakdown.total_assessments_taken} test{item.breakdown.total_assessments_taken === 1 ? '' : 's'} taken
                      </span>
                    </div>

                    {/* Assignments Breakdown */}
                    <div className="ranking-metric-cell">
                      <span className="ranking-metric-num">{item.breakdown.assignment_avg}%</span>
                      <span className="ranking-metric-sub">
                        {item.breakdown.total_assignments_graded} graded
                      </span>
                    </div>

                    {/* Trainer Review / Action */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                      {item.last_feedback ? (
                        <div style={{ fontSize: '11px', color: '#475569', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.last_feedback}>
                          ★ {item.last_feedback_rating}/5: "{item.last_feedback}"
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>No review yet</span>
                      )}
                      <button
                        type="button"
                        className="feedback-action-btn"
                        onClick={() => handleOpenFeedback({ ...item, color, initials })}
                      >
                        <Icon name="edit-3" style={{ width: 13, height: 13 }} />
                        <span>{item.last_feedback ? 'Update' : 'Review'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Trainee Feedback Modal */}
      <TraineeFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        trainee={selectedTraineeForFeedback}
        batchId={activeTab}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </div>
  );
}
