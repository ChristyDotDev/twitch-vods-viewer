import { Flex, Heading } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import Image from 'next/image'
import {signIn, signOut, useSession} from 'next-auth/client';

export default function Header() {
  const router = useRouter();
  const [session] = useSession()

  return (
    <Flex >
      <Heading as="h3" size="lg" m={1} cursor="pointer" onClick={() => router.push("/")}>
        Home
      </Heading>
      <div>
        {session ? (
            <button onClick={() => signOut()}>Log Out</button>
        ) : (
            <button onClick={() => signIn()}>Log In</button>
        )}
        {session && (
            <div>
                <small>Signed in as {session.user.name || session.user.email}</small>
                <Image src={session.user.image} width='32px' height='32px'/>
            </div>
        )}
      </div>
    </Flex>
  );
}