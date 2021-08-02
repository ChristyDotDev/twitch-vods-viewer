import Head from 'next/head'
import {signIn, signOut, useSession} from 'next-auth/client'
import { getSession } from "next-auth/client"


export async function getServerSideProps(req,res) {
    const session = await getSession( req );

    if(session?.user){
        return {
        redirect: {
            destination: '/vods',
            permanent: false,
        },
        }
    }
    return {
        props: {}
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
