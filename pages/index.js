import Head from 'next/head'
import TwitchApi from "../lib/TwitchApi";
import React, {useState, useEffect} from 'react';

const millisInDay = 86400000;

export async function getServerSideProps(context) {
    const myUser = 604277296 //my own user as an example
    const token = await TwitchApi.getAccessToken();
    const user_follows = await TwitchApi.getUserFollows(myUser, token.access_token)
    return {
        props: {
            follows: user_follows,
            token: token,
            clientId: process.env.TWITCH_CLIENT_ID
        },
    }
}

function VodPanel(props) {
    // TODO - useState/useEffect hooks
    // TODO - split into own file
    const [vod, setVod] = useState(undefined);

    useEffect(async () => {
        if (!vod) {
            const vods = await TwitchApi.getVodsForChannel(props.channel, props.token.access_token, props.clientId)
            const latestVod = vods.data[0]
            if (latestVod && Date.now() - Date.parse(latestVod.created_at) < millisInDay && latestVod.thumbnail_url) {
                setVod(latestVod)
            }
        }
    });

    return (
        <div>
            <pre id="json">
                {JSON.stringify(vod, undefined, 2)}
            </pre>
        </div>
    );
}

export default function Home({follows, token, clientId}) {
    return (
        <div>
            <Head>
                <title>Stream Calendar</title>
                <meta name="description" content="A calendar of streams"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <h1>
                    VODs from the last day
                </h1>
                <ul>
                    {follows.map((follow) => (
                        <li key={follow.to_login}>
                            <VodPanel channel={follow.to_id} token={token} clientId={clientId}/>
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
