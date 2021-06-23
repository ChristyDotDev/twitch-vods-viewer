import Head from 'next/head'
import {ApiClient} from 'twitch';
import Image from 'next/image'
import {ClientCredentialsAuthProvider} from 'twitch-auth';

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({authProvider});
import TwitchApi from "../lib/TwitchApi";

const millisInDay = 86400000;

export async function getServerSideProps(context) {
    console.log("Server Side");
    const myUser = 604277296 //my own user as an example
    const follows = await apiClient.helix.users.getFollowsPaginated({user: myUser, first: 100}).getAll()
    const user_follows = []
    const token = await TwitchApi.getAccessToken();
    for (const follow of follows) {
        const latestVod = await TwitchApi.getVodsForChannel(follow.followedUserId, token.access_token, 'day')
        if (latestVod.length > 0 && Date.now() - Date.parse(latestVod[0].created_at) < millisInDay) {
            user_follows.push({
                followedUserDisplayName: follow.followedUserDisplayName,
                followedUserId: follow.followedUserId,
                vod: {
                    created: latestVod[0].created_at,
                    title: latestVod[0].title,
                    url: latestVod[0].url,
                    thumbnail: latestVod[0].thumbnail_url,
                    duration: latestVod[0].duration
                }
            })
            if(user_follows.length > 9){
                break;
            }
        }
    }

    return {
        props: {
            data: {
                name: "Twitch Calendar"
            },
            follows: user_follows,
        },
    }
}

export default function Home({data, follows}) {
    return (
        <div>
            <Head>
                <title>Stream Calendar</title>
                <meta name="description" content="A calendar of streams"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <h1>
                    VODs from the last day (first 10 for now)
                </h1>
                <ul>
                    {follows.map((follow) => (
                        <li>
                            {follow.followedUserDisplayName} - <a href={follow.vod.url}>{follow.vod.title}</a>
                        </li>
                    ))}
                </ul>
            </main>

            <footer>
                Footer goes here
            </footer>
        </div>
    )
}
