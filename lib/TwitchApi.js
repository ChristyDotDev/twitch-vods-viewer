export default class TwitchApi {
    static getFetchOptions(accessToken) {
        return {
            headers: {
                "Client-Id": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }

    static async getVodsForChannel(channelId, accessToken, period='day') {
        return await TwitchApi.call(
            `https://api.twitch.tv/helix/videos?user_id=${channelId}&first=1&type=archive&period=${period}`,
            accessToken,
        );
    }

    static async getAccessToken() {
        try {
            const response = await fetch(
                `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=user_read`,
                {
                    method: "POST",
                    headers: { accept: "application/vnd.twitchtv.v5+json" },
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