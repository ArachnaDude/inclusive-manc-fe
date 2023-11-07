import axios from "axios";

// API query for app Backend
const BEapi = axios.create({
  baseURL: "https://inclusive-manc-be.onrender.com/api",
});

// GET Requests
export const getVenueInfoById = (id) => {
  return BEapi.get(`accessinfo/${id}`).then((res) => {
    return res.data;
  });
};

export const getUsers = () => {
  return BEapi.get(`users/`).then((res) => {
    return res.data;
  });
};

// PATCH Requests
export const postCommentToVenueById = (id, commentForSubmit) => {
  const { author, body, total_confirmed_votes } = commentForSubmit;
  return BEapi.patch(`accessinfo/${id}`, {
    comments: {
      author: author,
      body: body,
      total_confirmed_votes: total_confirmed_votes,
    },
  });
};

export const patchAccessRatingById = (id, accessRating) => {
  const { accessibility_ratings } = accessRating;
  return BEapi.patch(`accessinfo/${id}`, {
    accessibility_ratings: accessibility_ratings,
  });
};

export const patchEqualityRatingById = (id, equalityRating) => {
  const { equality_ratings } = equalityRating;
  return BEapi.patch(`accessinfo/${id}`, {
    equality_ratings: equality_ratings,
  });
};

export const patchAttitudeRatingById = (id, attitudeRating) => {
  const { attitude_ratings } = attitudeRating;
  return BEapi.patch(`accessinfo/${id}`, {
    attitude_ratings: attitude_ratings,
  });
};
