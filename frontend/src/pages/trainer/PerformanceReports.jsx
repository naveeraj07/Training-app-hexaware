import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import trainerService from '../../services/trainerService';
import TraineeFeedbackModal from '../../components/trainer/TraineeFeedbackModal';
import '../../styles/trainer/performance-reports.css';

export default function PerformanceReports() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [modules, setModules] = useState([]);
  const [strugglingModules, setStrugglingModules] = useState([]);
  const [rankingsData, setRankingsData] = useState(null);

  const [isBatchesLoading, setIsBatchesLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
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
          setSelectedBatch(result[0].id);
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

  // Fetch modules, alerts, and rankings when selectedBatch changes
  const loadBatchAnalytics = async (batchId) => {
    if (!batchId) return;
    try {
      setIsDataLoading(true);
      const [modData, alertData, rankData] = await Promise.all([
        trainerService.getModuleAnalytics(batchId).catch(() => []),
        trainerService.getAnalyticsAlerts(batchId).catch(() => []),
        trainerService.getBatchRankings(batchId).catch(() => null),
      ]);

      const mappedModules = (modData || []).map(m => ({
        id: m.id || m.module_id,
        name: m.name || m.module_name || 'Module',
        avgScore: m.avgScore !== undefined ? m.avgScore : (m.average_score !== undefined ? m.average_score : 0)
      }));

      const mappedAlerts = (alertData || []).map(m => ({
        id: m.id || m.module_id,
        name: m.name || m.module_name || 'Module',
        avgScore: m.avgScore !== undefined ? m.avgScore : (m.average_score !== undefined ? m.average_score : 0)
      }));

      setModules(mappedModules);
      setStrugglingModules(mappedAlerts);
      setRankingsData(rankData);
    } catch (err) {
      console.error('Error loading module analytics:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadBatchAnalytics(selectedBatch);
  }, [selectedBatch]);

  const handleOpenFeedback = (trainee) => {
    setSelectedTraineeForFeedback(trainee);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSubmitted = () => {
    loadBatchAnalytics(selectedBatch);
  };

  // Compute average score of modules
  const totalAvg = modules.length > 0 
    ? Math.round(modules.reduce((sum, m) => sum + m.avgScore, 0) / modules.length)
    : 0;

  const getBarColorClass = (score) => {
    if (score >= 70) return 'bar-high';
    if (score >= 50) return 'bar-mid';
    return 'bar-low';
  };

  if (isBatchesLoading) {
    return (
      <div className="perf-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Loading batches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="perf-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ color: '#dc2626', fontWeight: 600 }}>{error}</div>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="perf-container" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No Batches Available</h2>
        <p style={{ color: 'var(--text-light)', marginTop: '8px' }}>Performance analytics will become active once batches are assigned.</p>
      </div>
    );
  }

  const top3 = rankingsData?.rankings?.slice(0, 3) || [];
  const atRiskTrainees = rankingsData?.rankings?.filter(t => t.tier === 'Needs Attention') || [];

  return (
    <div className="perf-container">
      {/* 1. Page Header */}
      <div className="perf-banner">
        <div className="perf-banner-left">
          <h2>Performance Analytics & Rankings</h2>
          <p>Analyze candidate standings, module mastery levels, and diagnostic intervention alerts.</p>
        </div>
        <div className="perf-banner-right">
          <div className="perf-summary-pill">
            <Icon name="bar-chart-2" style={{ width: '15px', height: '15px' }} />
            <span>Avg Batch Score: {rankingsData ? `${rankingsData.batch_average_score}%` : `${totalAvg}%`}</span>
          </div>
        </div>
      </div>

      {/* 2. Top Performers Podium */}
      {top3.length > 0 && (
        <div className="perf-podium-section">
          <div className="perf-podium-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                Batch Top Performers Podium
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Automatically calculated based on weighted Assessment (40%), Assignment (35%), Progress (15%), & Attendance (10%)
              </span>
            </div>
            <select
              className="perf-chart-batch-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.course_name})</option>
              ))}
            </select>
          </div>

          <div className="perf-podium-grid">
            {top3.map((cand) => {
              const medal = cand.rank === 1 ? '🥇' : cand.rank === 2 ? '🥈' : '🥉';
              const podiumClass = `perf-podium-${cand.rank}`;
              return (
                <div key={cand.trainee_id} className={`perf-podium-card ${podiumClass}`}>
                  <div className="perf-podium-medal">{medal}</div>
                  <span className="perf-podium-name">{cand.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>ID: {cand.employee_id}</span>
                  <div className="perf-podium-score">{cand.composite_score}%</div>
                  <div className="perf-podium-stats">
                    Assessments: {cand.breakdown.assessment_avg}% • Labs: {cand.breakdown.assignment_avg}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. At-Risk Trainees Intervention Panel (if any) */}
      {atRiskTrainees.length > 0 && (
        <div className="perf-at-risk-section">
          <div className="perf-at-risk-header">
            <Icon name="alert-triangle" style={{ width: 22, height: 22, color: '#ea580c' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#9a3412' }}>
                Diagnostic Intervention Alert ({atRiskTrainees.length} Candidate{atRiskTrainees.length > 1 ? 's' : ''} Need Attention)
              </h3>
              <span style={{ fontSize: '12px', color: '#c2410c' }}>
                Candidates falling below 65% composite benchmark. Proactive trainer feedback or mentorship recommended.
              </span>
            </div>
          </div>

          <div className="perf-at-risk-list">
            {atRiskTrainees.map((item) => (
              <div key={item.trainee_id} className="perf-at-risk-item">
                <div className="perf-at-risk-trainee">
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    backgroundColor: '#ea580c', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '13px'
                  }}>
                    {item.name ? item.name.substring(0, 2).toUpperCase() : 'TR'}
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '14px' }}>{item.name}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Composite Score: <span style={{ color: '#dc2626', fontWeight: 700 }}>{item.composite_score}%</span> • Assessment Avg: {item.breakdown.assessment_avg}% • Labs: {item.breakdown.assignment_avg}%
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="perf-at-risk-action-btn"
                  onClick={() => handleOpenFeedback(item)}
                >
                  <Icon name="message-square" style={{ width: 14, height: 14 }} />
                  <span>Send Feedback</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Split Layout: Modules & Alert Cards */}
      <div className="perf-split-layout">
        {/* Left Side: Module Performance Bars */}
        <div className="perf-chart-card">
          <div className="perf-chart-header">
            <h3 className="perf-chart-title">Module Performance Average</h3>
            {!top3.length && (
              <select
                className="perf-chart-batch-select"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.course_name})</option>
                ))}
              </select>
            )}
          </div>

          <div className="perf-chart-list">
            {isDataLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-medium)' }}>
                Loading analytics data...
              </div>
            ) : modules.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)', fontSize: '14px' }}>
                No module evaluation logs found for this batch.
              </div>
            ) : (
              modules.map((module) => (
                <div key={module.id} className="perf-module-item">
                  <div className="perf-module-info">
                    <span className="perf-module-name">{module.name}</span>
                    <span className="perf-module-avg" style={{
                      color: module.avgScore >= 70 ? '#059669' : module.avgScore >= 50 ? '#d97706' : '#dc2626'
                    }}>
                      {module.avgScore}% Batch Avg
                    </span>
                  </div>
                  <div className="perf-bar-track">
                    <div
                      className={`perf-bar-fill ${getBarColorClass(module.avgScore)}`}
                      style={{ width: `${module.avgScore}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Alerts Panel */}
        <div className="perf-alerts-card">
          <div className="perf-alerts-header">
            <Icon name="alert-triangle" style={{ width: '20px', height: '20px', color: '#d97706' }} />
            <h3 className="perf-alerts-title">Curriculum Diagnostic Alerts</h3>
          </div>

          <div className="perf-alerts-list">
            {isDataLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-medium)' }}>
                Checking for alerts...
              </div>
            ) : strugglingModules.length === 0 ? (
              <div className="perf-alerts-empty">
                <Icon name="check-circle" className="perf-alerts-empty-icon" />
                <span className="perf-alerts-empty-title">All Modules On Track</span>
                <span className="perf-alerts-empty-desc">All average module scores are above 65%.</span>
              </div>
            ) : (
              strugglingModules.map((module) => (
                <div key={module.id} className="perf-alert-item">
                  <div className="perf-alert-icon-wrap">
                    <Icon name="trending-down" style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div className="perf-alert-content">
                    <span className="perf-alert-item-title">{module.name}</span>
                    <span className="perf-alert-desc">
                      Concept weakness identified. Average score fell below recommended 65% benchmark.
                    </span>
                    <div className="perf-alert-badge">
                      {module.avgScore}% Batch Average — Review Recommended
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Trainee Feedback Modal */}
      <TraineeFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        trainee={selectedTraineeForFeedback}
        batchId={selectedBatch}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </div>
  );
}
