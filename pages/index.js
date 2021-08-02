import Head from 'next/head'
import TwitchApi from "../lib/TwitchApi";
import VodPanel from "../components/VodPanel"
import {SimpleGrid} from "@chakra-ui/react"
import {signIn, signOut, useSession} from 'next-auth/client'


export async function getServerSideProps(context) {
    const myUser = "ChristyC92" //FIXME - accept this from user?
    const token = await TwitchApi.getAccessToken();
    const user = await TwitchApi.getUser(myUser, token.access_token);
    const userId = user.data[0].id
    const user_follows = await TwitchApi.getUserFollows(userId, token.access_token)
    return {
        props: {
            follows: user_follows,
            token: token,
            clientId: process.env.TWITCH_CLIENT_ID
        },
    }
}

export default function Home({follows, token, clientId}) {
    const [session] = useSession()

    return (
        <div>
            <Head>
                <title>Twitch Videos</title>
                <meta name="description" content="A calendar of streams"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <div>
                    {session ? (
                        <button onClick={() => signOut()}>Log Out</button>
                    ) : (
                        <button onClick={() => signIn()}>Log In</button>
                    )}
                    {session && (
                        <div>
                            <small>Signed in as {session.user.name || session.user.email}</small>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
