import Head from 'next/head'
import TwitchApi from "../lib/TwitchApi";
import VodPanel from "../components/VodPanel"
import { SimpleGrid } from "@chakra-ui/react"

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
                <SimpleGrid columns={[1, 2, 3]} spacing="40px">
                {follows.map((follow) => (
                    <VodPanel key={follow.to_id} channel={follow.to_id} token={token} clientId={clientId}/>
                ))}
                </SimpleGrid>
            </main>

            <footer>
                Footer goes here
            </footer>
        </div>
    )
}
