const Job = require("../models/jobModel");
const { handleErrors } = require("../services/errorsHandler");
const { getIdFromToken, verifyToken } = require("../services/jwtToken");
const mongoose = require("mongoose");

const addJob = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const userId = getIdFromToken(token);

    const {
      name,
      email,
      phoneNumber,
      address,
      jobTitle,
      website,
      expirationDate,
      origin,
      status,
      comment,
    } = req.body;

    const job = await Job.create({
      employer: {
        name,
        email,
        phoneNumber,
        address,
      },
      jobTitle,
      website,
      expirationDate,
      origin,
      status,
      comment,
      jobSeeker: userId,
    });

    res.json(job);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

// http://localhost:3000/job?numPage=0&limit=3&asc=true&userid=12345&orderedBy=employer.name&ByStatus=Interested
const getJobs = async (req, res) => {
  let { numPage, limit, ByStatus, orderedBy, desc } = req.query;
  const token = req.cookies.jwt;
  let userId;
  try {
    userId = getIdFromToken(token);
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json(errors);
  }
  const userObjectId = new mongoose.Types.ObjectId(userId);

  numPage = Number(numPage) || 1;
  limit = Number(limit) || 999;

  if (ByStatus) {
    ByStatus = { status: ByStatus };
  }
  if (!ByStatus) {
    ByStatus = {};
  }

  let direction = desc == "true" ? -1 : 1;
  orderedBy = orderedBy || "expirationDate";

  let sortCriteria = {};
  if (orderedBy === "employer.name") {
    sortCriteria["employer.name"] = direction;
  } else {
    sortCriteria[orderedBy] = direction;
  }

  let result = await Job.aggregate([
    {
      $match: { jobSeeker: userObjectId },
    },
    {
      $match: ByStatus,
    },
    {
      $facet: {
        metaData: [
          {
            $count: "totalDocuments",
          },
          {
            $addFields: {
              numPage: numPage,
              totalPages: { $ceil: { $divide: ["$totalDocuments", limit] } },
            },
          },
        ],
        data: [
          {
            $sort: sortCriteria,
          },
          {
            $skip: (numPage - 1) * limit,
          },
          {
            $limit: limit,
          },
        ],
      },
    },
  ]);
  result = result[0];
  result.metaData = { ...result.metaData[0], count: result.data.length };
  res.json(result);
};

// Pour faciliter le front-end je render directement vers ejs
//exemple  : http://localhost:3000/api/job?id=66ab5f02d4421eece6d983ad
const getJob = async (req, res) => {
  try {
    const { id } = req.query;
    const job = await Job.findById(id);
    res.render("jobDetails", { job });
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateJob = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const userId = getIdFromToken(token);
    const { id } = req.query;

    // Find the job by ID
    const job = await Job.findById(id);

    // Check if the job belongs to the logged-in user
    if (job.jobSeeker.toString() === userId) {
      // Apply updates manually
      Object.assign(job, req.body);

      // Save the updated job
      await job.save();

      // Send the updated job back as the response
      res.json(job);
    } else {
      res.status(400).json({ Error: "You are not authorized to update this job." });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};



module.exports = {
  addJob,
  getJobs,
  getJob,
  updateJob,
};
