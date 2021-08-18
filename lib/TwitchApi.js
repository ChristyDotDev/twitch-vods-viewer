export default class TwitchApi {
  static getFetchOptions(accessToken, clientId) {
    return {
      headers: {
        "Client-Id": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  static async getVodsForChannel(
    channelId,
    accessToken,
    clientId = `${process.env.TWITCH_CLIENT_ID}`
  ) {
    return await TwitchApi.call(
      `https://api.twitch.tv/helix/videos?user_id=${channelId}&first=1&type=archive`,
      accessToken,
      clientId
    );
  }

  static async getUser(
    username,
    accessToken,
    clientId = `${process.env.TWITCH_CLIENT_ID}`
  ) {
    return await TwitchApi.call(
      `https://api.twitch.tv/helix/users?login=${username}`,
      accessToken,
      clientId
    );
  }

  static async getUserFollows(userId, access_token) {
    let follows = [];
    let done = false,
      cursor = undefined,
      batch = 100;
    while (!done) {
      let url = `https://api.twitch.tv/helix/users/follows?from_id=${userId}&first=${batch}`;
      if (cursor) {
        url += `&after=${cursor}`;
      }
      const follows_data = await TwitchApi.call(url, access_token);
      if (follows_data.data.length > 0) {
        follows = follows.concat(follows_data.data);
        if (follows_data.pagination.cursor) {
          cursor = follows_data.pagination.cursor;
        } else {
          done = true;
        }
      } else {
        done = true;
      }
    }
    return follows;
  }

  static async getLiveStreams(userId, access_token) {
    const follows = await this.getUserFollows(userId, access_token);
    const followsLogins = follows.map((f) => f.to_login);
    let followsLive = [];
    var chunk = 99;
    for (var i = 0, j = chunk; i < follows.length; i += chunk, j+=chunk) {
      let url = `https://api.twitch.tv/helix/streams?user_login=${followsLogins.slice[i]}`;
      followsLogins.slice(i+1, j).forEach(f => {
        url += `&user_login=${f}`;  
      });
      const follows_data = await TwitchApi.call(url, access_token);
      followsLive = followsLive.concat(follows_data.data);
      console.log(follows_data.data);
      console.log(follows_data.data.length);
    }
    console.log(followsLive)
    return followsLive;
  }

  static async getAccessToken() {
    try {
      const response = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=user_read`,
        {
          method: "POST",
          headers: { accept: "application/vnd.twitchtv.v5+json" },
        }
      );
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log(error);
    }
  }

  static async call(
    url,
    accessToken,
    clientId = `${process.env.TWITCH_CLIENT_ID}`
  ) {
    try {
      const response = await fetch(
        url,
        TwitchApi.getFetchOptions(accessToken, clientId)
      );
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
}
