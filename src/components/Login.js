import Head from "next/head";
import React from "react";
import { ChatIcon } from "@chakra-ui/icons";
import {
  Flex,
  Text,
  Box,
  Button,
  SimpleGrid,
  Center,
  Stack,
} from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseconfig";

function Login() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  return (
    <Flex  bgColor="#201B2C">
      <Head>
        <title>Login</title>
      </Head>
      <Center h="100vh" justifyContent="center" w="100%">
        <Stack
          align="center"
          bgColor="#2F2841"
          p={20}
          borderRadius="30px"
          spacing={10}
          boxShadow="0 0 3px rgba(0, 255, 137, 0.5)"
        >
          <Box
            bgColor="#00FF89"
            w="fit-content"
            p={5}
            borderRadius="35px"
            boxShadow="md"
          >
            <ChatIcon w="100px" h="100px" color="white"  />
          </Box>

          <Button
            _hover={{ bg: "gray", cursor: "pointer", }}
            boxShadow="md"
            onClick={() => signInWithGoogle("", { prompt: "select_account" })}
          >
            Entar com o Google
          </Button>
        </Stack>
      </Center>
    </Flex>
  );
}

export default Login;