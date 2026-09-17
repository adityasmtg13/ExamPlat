const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const csvPath = path.join(
    __dirname,
    "../../jee_model/college_cutoffs_2023_2026_4yr.csv"
);

let historicalData = null;


// Load and process CSV
function loadCollegeData() {
    return new Promise((resolve, reject) => {

        const data = [];

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on("data", (row) => {
                data.push(row);
            })
            .on("end", () => {

                // Group by College + Branch
                const grouped = {};

                data.forEach((row) => {

                    const institute = row["Institute"];
                    const branch = row["Branch"];

                    if (!institute || !branch) {
                        return;
                    }

                    const key = `${institute}|||${branch}`;

                    if (!grouped[key]) {
                        grouped[key] = {
                            institute,
                            branch,
                            cutoffs: {}
                        };
                    }

                    const year = Number(row["Year"]);
                    const closingRank = Number(row["Closing Rank"]);

                    if (
                        !isNaN(year) &&
                        !isNaN(closingRank)
                    ) {
                        grouped[key].cutoffs[year] = closingRank;
                    }
                });


                // Convert grouped object to array
                const results = Object.values(grouped);


                // Keep only College + Branch combinations
                // having at least 2 years of history
                historicalData = results.filter((item) => {

                    const yearsAvailable =
                        Object.keys(item.cutoffs).length;

                    return yearsAvailable >= 2;
                });


                console.log(
                    `College predictor loaded: ${historicalData.length} college + branch combinations`
                );

                resolve(historicalData);
            })
            .on("error", reject);
    });
}


// Predict Top N colleges
async function predictColleges(predictedRank, topN = 3) {

    if (!historicalData) {
        await loadCollegeData();
    }

    const weights = {
        2023: 0.05,
        2024: 0.15,
        2025: 0.30,
        2026: 0.50
    };


    const results = historicalData.map((college) => {

        let weightedSum = 0;
        let availableWeight = 0;


        for (const year in weights) {

            const yearNumber = Number(year);
            const cutoff = college.cutoffs[yearNumber];

            if (cutoff !== undefined && !isNaN(cutoff)) {

                weightedSum +=
                    cutoff * weights[yearNumber];

                availableWeight +=
                    weights[yearNumber];
            }
        }


        // Renormalize weights when a year is missing
        if (availableWeight === 0) {
            return null;
        }


        const weightedCutoff =
            weightedSum / availableWeight;


        const rankMargin =
            weightedCutoff - predictedRank;


        return {
            institute: college.institute,
            branch: college.branch,
            weightedCutoff: Number(weightedCutoff.toFixed(2)),
            rankMargin: Number(rankMargin.toFixed(2))
        };

    }).filter(Boolean);


    // Only colleges where student's rank
    // is within the predicted cutoff
    const eligible = results.filter(
        (college) =>
            college.weightedCutoff >= predictedRank
    );


    // Closest cutoff first
    eligible.sort(
        (a, b) =>
            a.rankMargin - b.rankMargin
    );


    return eligible.slice(0, topN);
}


module.exports = {
    loadCollegeData,
    predictColleges
};