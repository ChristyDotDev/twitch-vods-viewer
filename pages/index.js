import Head from 'next/head'
import Image from 'next/image'

import TwitchApi from "../lib/TwitchApi";

export async function getServerSideProps(context) {
    console.log("Server Side");
    const myUser = 604277296 //my own user as an example
    const token = await TwitchApi.getAccessToken();
    const user_follows = await TwitchApi.getVodsForUserFollows(myUser, token)
    console.log(user_follows)
    return {
        props: {
            follows: user_follows,
        },
    }
}

export default function Home({follows}) {
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
                        <li>
                            {follow.followedUserDisplayName} - <a href={follow.vod.url}>{follow.vod.title}</a>
                            <Image src={follow.vod.thumbnail} alt='Some text' width='128px' height='128px'/>
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
