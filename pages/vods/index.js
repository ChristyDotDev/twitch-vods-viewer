import TwitchApi from "/lib/TwitchApi";
import VodPanel from "/components/VodPanel";
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
  const user_follows = await TwitchApi.getUserFollows(
    userId,
    token.access_token
  );
  return {
    props: {
      follows: user_follows,
      token: token,
      clientId: process.env.TWITCH_CLIENT_ID,
    },
  };
}

export default function Vods({ follows, token, clientId }) {
  return (
    <div>
      <main>
        <h1>VODs from the last day</h1>
        <SimpleGrid columns={[1, 2, 3]} spacing="40px">
          {follows.map((follow) => (
            <VodPanel
              key={follow.to_id}
              channel={follow.to_id}
              token={token}
              clientId={clientId}
            />
          ))}
        </SimpleGrid>
      </main>
    </div>
  );
}
