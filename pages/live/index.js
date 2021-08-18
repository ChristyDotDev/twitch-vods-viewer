import TwitchApi from "/lib/TwitchApi";
import LiveChannel from "/components/LiveChannel";
import { SimpleGrid } from "@chakra-ui/react";
import { getSession } from "next-auth/client";

export async function getServerSideProps(req, res) {
  const session = await getSession(req);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const myUser = session.user.name;
  const token = await TwitchApi.getAccessToken();
  const user = await TwitchApi.getUser(myUser, token.access_token);
  const userId = user.data[0].id;
  const liveStreams = await TwitchApi.getLiveStreams(
    userId,
    token.access_token
  );
  return {
    props: {
      liveStreams: liveStreams,
      token: token,
      clientId: process.env.TWITCH_CLIENT_ID,
    },
  };
}

export default function Live({ liveStreams, token, clientId }) {
  return (
    <div>
      <main>
        <h1>Live Channels You Follow</h1>
        <SimpleGrid columns={[1, 2, 3]} spacing="40px">
          {liveStreams.map((liveStream) => (
            <LiveChannel
              key={liveStream.id}
              channel={liveStream}
            />
          ))}
        </SimpleGrid>
      </main>
    </div>
  );
}
