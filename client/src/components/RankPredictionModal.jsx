import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { predictRank } from "../services/rankPredictionService";
import { predictColleges } from "../services/collegePredictionService";

function PredictionStatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition duration-200 hover:border-cyan-200 hover:bg-cyan-50/60">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}


function PredictionCollegeCard({ title, branch, index }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex h-full min-h-[150px] flex-col justify-between rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">

        {/* Rank */}
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-700">
            #{index}
          </span>
        </div>


        {/* College + Branch */}
        <div className="mt-4">

          <p className="text-base font-bold leading-snug text-slate-900">
            {title}
          </p>

          <p className="mt-2 text-sm font-semibold leading-snug text-cyan-700">
            {branch}
          </p>

          <p className="mt-3 text-sm font-medium text-slate-500">
            Suggested
          </p>

        </div>

      </div>
    </div>
  );
}


function RankPredictionModal({ exam, open, onClose }) {

  const [prediction, setPrediction] = useState(null);

  const [predictedColleges, setPredictedColleges] = useState([]);

  const [loading, setLoading] = useState(false);

  const [collegeLoading, setCollegeLoading] = useState(false);

  const [error, setError] = useState(null);


  useEffect(() => {

    if (!open || !exam) {
      return;
    }

    const attempts = exam.attempts || [];
    const scores = attempts.map((item) => item.score || 0);
    const percentages = attempts.map((item) => Number(item.percentage || 0));

    const highestMarks = attempts.length ? Math.max(...scores) : 0;
    const lowestMarks = attempts.length ? Math.min(...scores) : 0;
    const averageMarks = attempts.length
      ? Number((scores.reduce((sum, s) => sum + s, 0) / attempts.length).toFixed(2))
      : 0;

    const highestPercentage = attempts.length ? Math.max(...percentages) : 0;
    const lowestPercentage = attempts.length ? Math.min(...percentages) : 0;
    const averagePercentage = attempts.length
      ? Number((percentages.reduce((sum, p) => sum + p, 0) / attempts.length).toFixed(2))
      : 0;

    // Compute stats and predicted colleges inside useEffect
    const stats = [
      { label: "Exam Name", value: exam.examType || "N/A" },
      { label: "Total Attempts", value: exam.totalAttempts ?? attempts.length },
      { label: "Highest Marks", value: highestMarks },
      { label: "Lowest Marks", value: lowestMarks },
      { label: "Average Marks", value: averageMarks },
      { label: "Highest Percentage", value: `${highestPercentage}%` },
      { label: "Lowest Percentage", value: `${lowestPercentage}%` },
      { label: "Average Percentage", value: `${averagePercentage}%` },
    ];


    const runPrediction = async () => {

      setLoading(true);
      setCollegeLoading(false);

      setError(null);

      setPrediction(null);

      setPredictedColleges([]);


      try {

        // ==========================================
        // 1. Predict JEE Rank
        // ==========================================

        const result = await predictRank({
          averageMarks,
          examType: exam.examType || "JEE Main",
        });


        if (!result?.success) {

          setError(
            result?.message || "Prediction failed."
          );

          return;
        }


        // Store rank prediction
        setPrediction(result);


        // ==========================================
        // 2. Get predicted rank
        // ==========================================

        const predictedRank =
          result.prediction?.estimatedRank;


        if (!predictedRank) {

          setError(
            "Predicted rank was not returned."
          );

          return;
        }


        // ==========================================
        // 3. Predict Colleges
        // ==========================================

        setCollegeLoading(true);


        const collegeResult =
          await predictColleges(predictedRank);


        if (collegeResult?.success) {

          setPredictedColleges(
            collegeResult.colleges || []
          );

        } else {

          console.error(
            "College prediction failed:",
            collegeResult?.message
          );

        }

      } catch (err) {

        console.error(
          "Prediction Error:",
          err
        );

        setError(
          err?.message ||
          "Failed to predict rank."
        );

      } finally {

        setLoading(false);

        setCollegeLoading(false);
      }
    };


    runPrediction();

  }, [open, exam]);


  if (!open || !exam) {
    return null;
  }


  // Re-compute stats for rendering from the exam's attempts
  const attempts = exam.attempts || [];
  const scores = attempts.map((item) => item.score || 0);
  const percentages = attempts.map((item) => Number(item.percentage || 0));

  const highestMarks = attempts.length ? Math.max(...scores) : 0;
  const lowestMarks = attempts.length ? Math.min(...scores) : 0;
  const averageMarks = attempts.length
    ? Number((scores.reduce((sum, s) => sum + s, 0) / attempts.length).toFixed(2))
    : 0;

  const highestPercentage = attempts.length ? Math.max(...percentages) : 0;
  const lowestPercentage = attempts.length ? Math.min(...percentages) : 0;
  const averagePercentage = attempts.length
    ? Number((percentages.reduce((sum, p) => sum + p, 0) / attempts.length).toFixed(2))
    : 0;

  const stats = [
    { label: "Exam Name", value: exam.examType || "N/A" },
    { label: "Total Attempts", value: exam.totalAttempts ?? attempts.length },
    { label: "Highest Marks", value: highestMarks },
    { label: "Lowest Marks", value: lowestMarks },
    { label: "Average Marks", value: averageMarks },
    { label: "Highest Percentage", value: `${highestPercentage}%` },
    { label: "Lowest Percentage", value: `${lowestPercentage}%` },
    { label: "Average Percentage", value: `${averagePercentage}%` },
  ];


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">


        {/* ======================================
            Header
        ====================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-[#103f7c] to-[#0d3a70] px-6 py-4 text-white">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
              Prediction Preview
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              {exam.examType || "Exam"}
            </h3>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Close
          </button>

        </div>


        <div className="space-y-7 p-6">


          {/* ======================================
              Statistics
          ====================================== */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((item) => (

              <PredictionStatCard
                key={item.label}
                label={item.label}
                value={item.value}
              />

            ))}

          </div>


          {/* ======================================
              Rank Loading
          ====================================== */}

          {loading && (

            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-200 bg-cyan-50 p-8">

              <FaSpinner className="mb-3 h-8 w-8 animate-spin text-cyan-700" />

              <p className="text-sm font-semibold text-cyan-700">
                Predicting your rank...
              </p>

            </div>

          )}


          {/* ======================================
              Error
          ====================================== */}

          {error && (

            <div className="rounded-3xl border border-red-200 bg-red-50 p-5">

              <p className="text-sm font-semibold text-red-700">
                {error}
              </p>

            </div>

          )}


          {/* ======================================
              Prediction Result
          ====================================== */}

          {!loading && !error && prediction && (

            <>


              {/* ==================================
                  Estimated Rank
              ================================== */}

              <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-5">

                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                  Estimated Rank
                </p>


                <div className="mt-3 flex flex-wrap items-end gap-6">


                  {/* Predicted Rank */}

                  <div>

                    <p className="text-slate-500">
                      Predicted Rank
                    </p>

                    <p className="text-5xl font-bold text-slate-900">

                      #
                      {prediction.prediction?.estimatedRank?.toLocaleString() ??
                        "--"}

                    </p>

                  </div>


                  {/* Rank Range */}

                  {prediction.prediction?.rankRange && (

                    <div>

                      <p className="text-slate-500">
                        Range
                      </p>

                      <p className="text-xl font-bold text-slate-900">

                        #
                        {prediction.prediction.rankRange.low?.toLocaleString() ??
                          "--"}

                        {" - "}

                        #
                        {prediction.prediction.rankRange.high?.toLocaleString() ??
                          "--"}

                      </p>

                    </div>

                  )}


                  {/* Percentile */}

                  <div>

                    <p className="text-slate-500">
                      Percentile
                    </p>

                    <p className="text-3xl font-bold text-cyan-700">

                      {prediction.prediction?.percentile?.toFixed(2) ??
                        "--"}
                      %

                    </p>

                  </div>


                  {/* Confidence */}

                  <div>

                    <p className="text-slate-500">
                      Confidence
                    </p>

                    <p className="text-xl font-bold text-slate-900">

                      {prediction.prediction?.confidence ??
                        "--"}

                    </p>

                  </div>

                </div>


                <p className="mt-3 text-xs font-medium text-cyan-700/80">

                  Based on your average mock test marks using the XGBoost model
                  calibrated for JEE Main 2026.

                </p>

              </div>



              {/* ==================================
                  Predicted Colleges
              ================================== */}

              <div className="space-y-4">

                <div className="flex items-center justify-between gap-3">

                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Predicted Colleges
                  </p>

                </div>


                {/* College Loading */}

                {collegeLoading && (

                  <div className="flex items-center justify-center rounded-3xl border border-dashed border-cyan-200 bg-cyan-50 p-8">

                    <FaSpinner className="mr-3 h-5 w-5 animate-spin text-cyan-700" />

                    <p className="text-sm font-semibold text-cyan-700">
                      Finding suitable colleges...
                    </p>

                  </div>

                )}


                {/* College Results */}

                {!collegeLoading &&
                  predictedColleges.length > 0 && (

                    <div className="grid gap-4 md:grid-cols-3">

                      {predictedColleges.map(
                        (college, index) => (

                          <PredictionCollegeCard
                            key={`${college.institute}-${college.branch}`}
                            title={college.institute}
                            branch={college.branch}
                            index={index + 1}
                          />

                        )
                      )}

                    </div>

                  )}


                {/* No Results */}

                {!collegeLoading &&
                  predictedColleges.length === 0 && (

                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">

                      <p className="text-sm font-medium text-slate-500">
                        No suitable college predictions found.
                      </p>

                    </div>

                  )}

              </div>

            </>

          )}

        </div>

      </div>

    </div>

  );
}


export default RankPredictionModal;