import Head from 'next/head'
import {ApiClient} from 'twitch';
import {ClientCredentialsAuthProvider} from 'twitch-auth';

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({authProvider});
import TwitchApi from "../lib/TwitchApi";

export async function getServerSideProps(context) {
    console.log("Server Side");
    const myUser = 604277296 //my own user as an example
    const follows = await apiClient.helix.users.getFollowsPaginated({user: myUser, first: 100}).getAll()
    const user_follows = []
    follows.forEach(follow => {
        //console.log(follow.followedUserDisplayName + ": " + follow.followedUserId)
        user_follows.push({
            followedUserDisplayName: follow.followedUserDisplayName
        })
    })

    const token = await TwitchApi.getAccessToken();
    console.log(token)
    const videos = await TwitchApi.getVodsForChannel(13831909, token.access_token)
    console.log(videos)

    return {
        props: {
            data: {
                name: "Twitch Calendar"
            },
            follows: user_follows
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
                    Welcome to {data.name}
                </h1>
                <ul>
                    {follows.map((follow) => (
                        <li>{follow.followedUserDisplayName}</li>
                    ))}
                </ul>
            </main>

            <footer>
                Footer goes here
            </footer>
        </div>
    )
}
