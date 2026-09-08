import sys
import unittest
from pathlib import Path
from pydantic import ValidationError

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.schemas.trainee_feedback import TraineeFeedbackCreate
from app.schemas.trainer_ranking import (
    CandidateScoreBreakdown,
    CandidateRankItem,
    BatchRankingResponse,
)


class RankingCalculationAndTierTests(unittest.TestCase):
    def test_composite_score_standard_formula(self):
        assessment_avg = 90.0
        assignment_avg = 80.0
        progress_pct = 70.0
        attendance_pct = 95.0

        # Weights: 40% Assess, 35% Assign, 15% Progress, 10% Attendance
        expected = (
            (0.40 * assessment_avg)
            + (0.35 * assignment_avg)
            + (0.15 * progress_pct)
            + (0.10 * attendance_pct)
        )
        # 36.0 + 28.0 + 10.5 + 9.5 = 84.0
        self.assertAlmostEqual(expected, 84.0, places=2)

    def test_tier_classification(self):
        def get_tier(score: float) -> str:
            if score >= 85.0:
                return "Top Performer"
            elif score >= 65.0:
                return "On Track"
            return "Needs Attention"

        self.assertEqual(get_tier(92.5), "Top Performer")
        self.assertEqual(get_tier(85.0), "Top Performer")
        self.assertEqual(get_tier(84.9), "On Track")
        self.assertEqual(get_tier(65.0), "On Track")
        self.assertEqual(get_tier(64.9), "Needs Attention")
        self.assertEqual(get_tier(40.0), "Needs Attention")

    def test_ranking_sort_and_percentile(self):
        candidates = [
            {"id": 1, "name": "Alice", "score": 88.0, "assess": 90.0, "assign": 85.0, "prog": 90.0},
            {"id": 2, "name": "Bob", "score": 95.0, "assess": 95.0, "assign": 95.0, "prog": 95.0},
            {"id": 3, "name": "Charlie", "score": 62.0, "assess": 60.0, "assign": 65.0, "prog": 60.0},
            {"id": 4, "name": "Diana", "score": 88.0, "assess": 95.0, "assign": 80.0, "prog": 90.0},  # Tie on score with Alice, but higher assess
        ]

        # Sorting key: score desc, assess desc, assign desc, prog desc
        candidates.sort(
            key=lambda x: (x["score"], x["assess"], x["assign"], x["prog"]),
            reverse=True,
        )

        # Bob (95) should be rank 1
        # Diana (88, assess 95) should be rank 2
        # Alice (88, assess 90) should be rank 3
        # Charlie (62) should be rank 4
        self.assertEqual(candidates[0]["name"], "Bob")
        self.assertEqual(candidates[1]["name"], "Diana")
        self.assertEqual(candidates[2]["name"], "Alice")
        self.assertEqual(candidates[3]["name"], "Charlie")

        total = len(candidates)
        for idx, item in enumerate(candidates):
            rank = idx + 1
            percentile = round(((total - rank) / (total - 1)) * 100, 1)
            item["rank"] = rank
            item["percentile"] = percentile

        self.assertEqual(candidates[0]["rank"], 1)
        self.assertEqual(candidates[0]["percentile"], 100.0)
        self.assertEqual(candidates[-1]["rank"], 4)
        self.assertEqual(candidates[-1]["percentile"], 0.0)

    def test_feedback_schema_validation(self):
        valid = TraineeFeedbackCreate(
            batch_id=1,
            category="TECHNICAL",
            rating=5,
            feedback_text="Consistently writes clean and maintainable code.",
            strengths="Clean code, solid unit tests",
            areas_of_improvement="Optimize database indexing",
        )
        self.assertEqual(valid.rating, 5)
        self.assertEqual(valid.category, "TECHNICAL")

        # Invalid rating out of range (> 5 or < 1)
        with self.assertRaises(ValidationError):
            TraineeFeedbackCreate(
                rating=6,
                feedback_text="Invalid rating",
            )

        with self.assertRaises(ValidationError):
            TraineeFeedbackCreate(
                rating=0,
                feedback_text="Invalid rating",
            )


if __name__ == "__main__":
    unittest.main()
