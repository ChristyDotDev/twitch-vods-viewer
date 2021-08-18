import { getSession } from "next-auth/client";
import { Box, Flex, Spacer, VStack, Link, Icon } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

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
        <Link href="https://github.com/christytc10/twitch-vods-viewer" isExternal>
          <Icon as={FaGithub}/> View Source Code
        </Link>
        </Box>
      </VStack>
    </Flex>
  );
}
