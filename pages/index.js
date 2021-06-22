import Head from 'next/head'
import {ApiClient} from 'twitch';
import {ClientCredentialsAuthProvider} from 'twitch-auth';

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({authProvider});

export async function getServerSideProps(context) {
    console.log("Server Side");
    const myUser = 604277296 //my own user as an example
    const follows = await apiClient.helix.users.getFollows({user: myUser, first: 100})
    console.log(follows);
    const user_follows = []
    follows.data.forEach(follow => {
        console.log(follow.followedUserDisplayName)
        user_follows.push({
            followedUserDisplayName: follow.followedUserDisplayName
        })
    })
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
