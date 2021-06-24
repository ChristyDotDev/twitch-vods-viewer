import {ApiClient} from 'twitch';
import {ClientCredentialsAuthProvider} from 'twitch-auth';

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({authProvider});

const millisInDay = 86400000;

export default class TwitchApi {
    static getFetchOptions(accessToken) {
        return {
            headers: {
                "Client-Id": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }

    static async getVodsForUserFollows(userId, token) {
        const follows = await apiClient.helix.users.getFollowsPaginated({user: userId, first: 100}).getAll()
        //FIXME - use the new one
        const follows_new = await TwitchApi.getUserFollows(userId, token.access_token)
        const user_follows = []
        for (const follow of follows) {
            const latestVod = await TwitchApi.getVodsForChannel(follow.followedUserId, token.access_token)
            if (latestVod.length > 0 && Date.now() - Date.parse(latestVod[0].created_at) < millisInDay) {
                user_follows.push({
                    followedUserDisplayName: follow.followedUserDisplayName,
                    followedUserId: follow.followedUserId,
                    vod: {
                        created: latestVod[0].created_at,
                        title: latestVod[0].title,
                        url: latestVod[0].url,
                        thumbnail: latestVod[0].thumbnail_url ? latestVod[0].thumbnail_url.replace("%{width}", "512").replace("%{height}", "512") : 'https://blog.twitch.tv/assets/uploads/01-twitch-logo.jpg',
                        duration: latestVod[0].duration
                    }
                })
                if (user_follows.length > 9) {
                    break;
                }
            }
        }
        return user_follows;
    }


    static async getVodsForChannel(channelId, accessToken) {
        return await TwitchApi.call(
            `https://api.twitch.tv/helix/videos?user_id=${channelId}&first=1&type=archive`,
            accessToken,
        );
    }

    static async getUserFollows(userId, access_token) {
        return await TwitchApi.call(
            `https://api.twitch.tv/helix/videos?user_id=${userId}&first=1&type=archive`,
            access_token,
        );
    }

    static async getAccessToken() {
        try {
            const response = await fetch(
                `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=user_read`,
                {
                    method: "POST",
                    headers: {accept: "application/vnd.twitchtv.v5+json"},
                },
            );
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }

    static async call(url, accessToken) {
        try {
            const response = await fetch(url, TwitchApi.getFetchOptions(accessToken));
            const responseJson = await response.json();
            return responseJson.data;
        } catch (error) {
            console.log(error);
        }
    }
}