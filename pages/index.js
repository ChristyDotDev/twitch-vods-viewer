import { getSession } from "next-auth/client";
import { Box, Heading, Flex, Text, Button, Spacer } from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";

export async function getServerSideProps(req, res) {
  const session = await getSession(req);

  if (session?.user) {
    return {
      redirect: {
        destination: "/vods",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function Home({ follows, token, clientId }) {
  return (
    <Flex
      direction="column"
      align="center"
      maxW={{ xl: "1200px" }}
      m="12px auto"
    >
      <VStack spacing={8} align="stretch">
        <Spacer />
        <Box h="40px">
          This is a site to view VODs from the last day from streamers you
          follow on Twitch.tv. You can login using your Twitch credentials using
          OAuth
        </Box>
        <Spacer />
        <Box h="40px">
          View the source code{" "}
          <a href="https://github.com/christytc10/twitch-vods-viewer">here</a>
        </Box>
      </VStack>
    </Flex>
  );
}
