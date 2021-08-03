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
    return (
        <div>
            <head>
                <title>Twitch Videos</title>
                <meta name="description" content="A calendar of streams"/>
                <link rel="icon" href="/favicon.ico"/>
            </head>
        </div>
    )
}
