"""
ExamPlat JEE Rank Prediction Service

Uses the student's average mock-test marks.
Mock tests are out of 20 marks.

The average score is converted to a JEE Main
equivalent score out of 300 before passing
it to the XGBoost model.

Flow:

Average Mock Marks
        ↓
Convert /20 → /300
        ↓
XGBoost
        ↓
Raw Percentile
        ↓
Calibration
        ↓
Estimated Percentile
        ↓
Expected Rank
"""

import os
import joblib
import numpy as np
import pandas as pd

from flask import Flask, request, jsonify
from flask_cors import CORS


# =========================================================
# Flask App
# =========================================================

app = Flask(__name__)
CORS(app)


# =========================================================
# Paths
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_DIR = os.path.join(
    os.path.dirname(BASE_DIR),
    "jee_model"
)

XGB_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "xgboost_model.pkl"
)

CALIBRATOR_PATH = os.path.join(
    MODEL_DIR,
    "percentile_calibrator.pkl"
)

JEE_DATA_PATH = os.path.join(
    MODEL_DIR,
    "cleaned_jee_data.csv"
)


# =========================================================
# Configuration
# =========================================================

# Prediction year is fixed to 2026
YEAR = 2026

# Your mock tests are out of 20
MOCK_TEST_TOTAL_MARKS = 20

# JEE Main is out of 300
JEE_TOTAL_MARKS = 300


# =========================================================
# Model Cache
# =========================================================

_model = None
_calibrator = None
_jee_data = None


# =========================================================
# Load Models
# =========================================================

def load_models():

    global _model
    global _calibrator
    global _jee_data

    if _model is None:

        print("Loading XGBoost model...")

        _model = joblib.load(
            XGB_MODEL_PATH
        )

    if _calibrator is None:

        print("Loading percentile calibrator...")

        _calibrator = joblib.load(
            CALIBRATOR_PATH
        )

    if _jee_data is None:

        print("Loading JEE dataset...")

        _jee_data = pd.read_csv(
            JEE_DATA_PATH
        )

    return (
        _model,
        _calibrator,
        _jee_data
    )


# =========================================================
# Get 2026 Candidate Count
# =========================================================

def get_total_candidates():

    _, _, jee_data = load_models()

    year_data = jee_data[
        jee_data["Year"] == YEAR
    ]

    if year_data.empty:

        raise ValueError(
            f"{YEAR} data not found in cleaned_jee_data.csv"
        )

    return int(
        year_data[
            "Total_Candidates"
        ].iloc[0]
    )


# =========================================================
# Convert Mock Marks to JEE Marks
# =========================================================

def convert_to_jee_marks(average_marks):

    """
    Convert mock-test average from /20 to /300.

    Example:

    8.33 / 20 × 300 = 124.95
    """

    jee_marks = (
        average_marks
        / MOCK_TEST_TOTAL_MARKS
        * JEE_TOTAL_MARKS
    )

    return float(jee_marks)


# =========================================================
# XGBoost Prediction
# =========================================================

def predict_percentile_xgboost(
    jee_marks
):

    model, _, _ = load_models()

    total_candidates = (
        get_total_candidates()
    )

    features = pd.DataFrame({

        "Marks": [
            float(jee_marks)
        ],

        "Year": [
            YEAR
        ],

        "Total_Candidates": [
            total_candidates
        ]

    })

    try:

        prediction = model.predict(
            features
        )[0]

        return float(prediction)

    except Exception as e:

        print(
            f"XGBoost prediction error: {e}"
        )

        raise


# =========================================================
# Calibration
# =========================================================

def calibrate_percentile(
    raw_percentile
):

    _, calibrator, _ = load_models()

    try:

        calibrated = calibrator.predict(
            [raw_percentile]
        )[0]

        return float(calibrated)

    except Exception as e:

        print(
            f"Calibration error: {e}"
        )

        raise


# =========================================================
# Calculate Rank
# =========================================================

def calculate_rank(
    percentile,
    total_candidates
):

    if percentile <= 0:

        return total_candidates

    if percentile >= 100:

        return 1

    rank = (
        (100 - percentile)
        / 100
    ) * total_candidates

    return max(
        1,
        int(round(rank))
    )


# =========================================================
# Health Check
# =========================================================

@app.route(
    "/health",
    methods=["GET"]
)
def health():

    try:

        total_candidates = (
            get_total_candidates()
        )

        return jsonify({

            "status": "ok",

            "service":
                "jee-rank-prediction",

            "year":
                YEAR,

            "totalCandidates":
                total_candidates,

            "mockTestTotalMarks":
                MOCK_TEST_TOTAL_MARKS,

            "jeeTotalMarks":
                JEE_TOTAL_MARKS

        })

    except Exception as e:

        return jsonify({

            "status": "error",

            "message":
                str(e)

        }), 500


# =========================================================
# Predict Rank
# =========================================================

@app.route(
    "/api/predict-rank",
    methods=["POST"]
)
def predict_rank():

    try:

        # -------------------------------------------------
        # Get JSON
        # -------------------------------------------------

        data = request.get_json()

        if not data:

            return jsonify({

                "success": False,

                "message":
                    "No data provided."

            }), 400


        # -------------------------------------------------
        # Get Average Mock Marks
        # -------------------------------------------------

        average_marks = data.get(
            "averageMarks"
        )


        if average_marks is None:

            return jsonify({

                "success": False,

                "message":
                    "Average marks are required."

            }), 400


        # -------------------------------------------------
        # Convert to number
        # -------------------------------------------------

        try:

            average_marks = float(
                average_marks
            )

        except (
            ValueError,
            TypeError
        ):

            return jsonify({

                "success": False,

                "message":
                    "Invalid average marks."

            }), 400


        # -------------------------------------------------
        # Validate Mock Marks
        # -------------------------------------------------

        if (
            average_marks < 0
            or average_marks > MOCK_TEST_TOTAL_MARKS
        ):

            return jsonify({

                "success": False,

                "message":
                    f"Average marks must be between "
                    f"0 and {MOCK_TEST_TOTAL_MARKS}."

            }), 400


        # =================================================
        # STEP 1
        # Convert /20 → /300
        # =================================================

        jee_marks = (
            convert_to_jee_marks(
                average_marks
            )
        )


        print(
            f"Average Mock Marks: "
            f"{average_marks}/20"
        )

        print(
            f"JEE Equivalent Marks: "
            f"{jee_marks}/300"
        )


        # =================================================
        # STEP 2
        # Get Candidate Count
        # =================================================

        total_candidates = (
            get_total_candidates()
        )


        # =================================================
        # STEP 3
        # XGBoost
        # =================================================

        raw_percentile = (
            predict_percentile_xgboost(
                jee_marks
            )
        )


        print(
            f"Raw Percentile: "
            f"{raw_percentile}"
        )


        # =================================================
        # STEP 4
        # Calibration
        # =================================================

        calibrated_percentile = (
            calibrate_percentile(
                raw_percentile
            )
        )


        # Keep percentile between 0 and 100

        calibrated_percentile = float(
            np.clip(
                calibrated_percentile,
                0,
                100
            )
        )


        print(
            f"Calibrated Percentile: "
            f"{calibrated_percentile}"
        )


        # =================================================
        # STEP 5
        # Percentile Range
        # =================================================

        percentile_low = max(
            0,
            calibrated_percentile - 0.2
        )

        percentile_high = min(
            100,
            calibrated_percentile + 0.2
        )


        # =================================================
        # STEP 6
        # Expected Rank
        # =================================================

        estimated_rank = calculate_rank(
            calibrated_percentile,
            total_candidates
        )


        # =================================================
        # STEP 7
        # Rank Range
        # =================================================

        rank_low = calculate_rank(
            percentile_high,
            total_candidates
        )

        rank_high = calculate_rank(
            percentile_low,
            total_candidates
        )


        # =================================================
        # STEP 8
        # Confidence
        # =================================================

        if calibrated_percentile >= 99:

            confidence = "High"

        elif calibrated_percentile >= 90:

            confidence = "Medium"

        else:

            confidence = "Low"


        # =================================================
        # FINAL RESPONSE
        # =================================================

        response = {

            "success": True,

            "prediction": {

                # Original mock-test average
                "averageMarks":
                    round(
                        average_marks,
                        2
                    ),

                # Converted JEE score
                "jeeEquivalentMarks":
                    round(
                        jee_marks,
                        2
                    ),

                "year":
                    YEAR,

                "rawPercentile":
                    round(
                        raw_percentile,
                        4
                    ),

                "percentile":
                    round(
                        calibrated_percentile,
                        2
                    ),

                "percentileRange": {

                    "low":
                        round(
                            percentile_low,
                            2
                        ),

                    "high":
                        round(
                            percentile_high,
                            2
                        )

                },

                "estimatedRank":
                    estimated_rank,

                "rankRange": {

                    "low":
                        min(
                            rank_low,
                            rank_high
                        ),

                    "high":
                        max(
                            rank_low,
                            rank_high
                        )

                },

                "totalCandidates":
                    total_candidates,

                "confidence":
                    confidence

            }

        }


        return jsonify(
            response
        )


    except Exception as e:

        print(
            f"Predict rank error: {e}"
        )

        return jsonify({

            "success": False,

            "message":
                str(e)

        }), 500


# =========================================================
# Start Server
# =========================================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PYTHON_PORT",
            5001
        )
    )

    print()
    print(
        "===================================="
    )

    print(
        " JEE Rank Prediction Service"
    )

    print(
        "===================================="
    )

    print(
        f"Prediction Year: {YEAR}"
    )

    print(
        f"Mock Test: "
        f"{MOCK_TEST_TOTAL_MARKS} marks"
    )

    print(
        f"JEE Scale: "
        f"{JEE_TOTAL_MARKS} marks"
    )

    try:

        total_candidates = (
            get_total_candidates()
        )

        print(
            f"Total Candidates: "
            f"{total_candidates}"
        )

    except Exception as e:

        print(
            f"Warning: {e}"
        )

    print(
        f"Server: http://localhost:{port}"
    )

    print(
        "===================================="
    )

    print()

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )