const {
    predictColleges
} = require("../services/collegePredictor");


// POST /api/predict-colleges
const predictCollegeOptions = async (req, res) => {

    try {

        const { predictedRank } = req.body;

        // Validate input
        if (
            predictedRank === undefined ||
            predictedRank === null ||
            isNaN(predictedRank)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid predictedRank is required"
            });
        }

        const rank = Number(predictedRank);

        if (rank <= 0) {
            return res.status(400).json({
                success: false,
                message: "Predicted rank must be greater than 0"
            });
        }


        // Get Top 3 college + branch options
        const colleges = await predictColleges(rank, 3);


        return res.status(200).json({
            success: true,
            predictedRank: rank,
            colleges
        });

    } catch (error) {

        console.error(
            "College prediction error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to predict colleges"
        });
    }
};


module.exports = {
    predictCollegeOptions
};