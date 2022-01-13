const { database } = require('./firebase');
const axios = require('axios').default;

const BASEURL = 'https://www.strava.com/api/v3';
const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(
      `HTTP Error Response: ${response.status} ${response.statusText}`,
      ...args
    );
    this.response = response;
  }
}

async function renewToken({ refreshToken }) {
  const response = await axios.post(`${BASEURL}/oauth/token`, null, {
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
  });

  if (response.status !== 200) {
    throw new HTTPResponseError(response);
  }

  return response.data;
}

async function getActivities({
  accessToken,
  startTimestamp,
  page,
  pageSize = 100,
}) {
  const response = await axios.get(`${BASEURL}/athlete/activities`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      after: startTimestamp.seconds,
      page: page,
      per_page: pageSize,
    },
  });

  if (response.status !== 200) {
    throw new HTTPResponseError(response);
  }

  return response.data;
}

module.exports = {
  BASEURL,
  CLIENT_ID,
  CLIENT_SECRET,
  renewToken,
  getActivities,
};
