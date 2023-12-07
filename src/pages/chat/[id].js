import Sidebar from '@/components/SideBar';
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Heading,
  Icon,
  Input,
  Text,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { db, auth } from "../../../firebaseconfig";
import getOtherEmail from "../../../utils/getOtherEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { serverTimestamp, addDoc } from "firebase/firestore";
import { useRef, useEffect } from "react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";

export default function Chat() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { id } = router.query;
  const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp"));
  const [messages] = useCollectionData(q);
  const [chat] = useDocumentData(doc(db, "chats", id));
  const bottomOfChat = useRef();

  const getMessages = () =>
    messages?.map((msg) => {
      const sender = msg.sender === user.email;
      return (
        <Flex
          key={Math.random()}
          alignSelf={sender ? "flex-end" : "flex-start"}
          bg={sender ? "green.200" : "blue.100"}
          w="fit-content"
          minWidth="100px"
          borderRadius="lg"
          p={3}
          m={1}
        >
          <Text>{msg.text}</Text>
        </Flex>
      );
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomOfChat.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    // Função de limpeza
    return () => clearTimeout(timer);
  }, [messages]);

  const Topbar = ({ email }) => {
    const router = useRouter();

    const handleExitChat = () => {
      // Aqui você pode adicionar lógica para sair do chat, se necessário
      // Por exemplo, você pode redirecionar o usuário de volta à página inicial
      router.push("/");
    };

    return (
      <Flex
        bg="#00FF89"
        borderBlockEnd="1px solid black"
        h="81px"
        w="100%"
        align="center"
        p={5}
      >
        <Avatar src="" marginEnd={3} />
        <Heading size="lg">{email}</Heading>
        <Tooltip label="Sair da Conversar" aria-label="A tooltip">
          <IconButton
            bgColor="#00FF89" // Cor verde como exemplo
            size="lg"
            fontSize="4xl"
            isRound
            _hover={{ bg: "#00CF6F", cursor: "pointer" }}
            icon={<ChevronLeftIcon />} // Adicione um ícone de fechar ou outra representação de "sair"
            onClick={handleExitChat}
            marginLeft="auto"
          />
        </Tooltip>
      </Flex>
    );
  };

  const Bottombar = ({ id, user }) => {
    const [input, setInput] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();
      await addDoc(collection(db, `chats/${id}/messages`), {
        text: input,
        sender: user.email,
        timestamp: serverTimestamp(),
      });
      setInput("");
    };

    return (
      <FormControl p={4} onSubmit={sendMessage} as="form" bgColor="#201B2C">
        <Flex align="center">
          <Input
            placeholder="Insira sua mensagem"
            autoComplete="off"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            bgColor="#2F2841"
            color="white"
          />
          <IconButton
            bgColor="#00FF89"
            size="lg"
            isRound
            _hover="none"
            icon={<AddIcon />}
            onClick={sendMessage}
            marginLeft="20px"
          />
        </Flex>
      </FormControl>
    );
  };

  return (
    <Flex h="100vh">
      <Head>
        <title>Chat App</title>
      </Head>
      <Sidebar />

      <Flex flex={1} direction="column" bgColor="#2F2841">
        <Topbar email={getOtherEmail(chat?.users, user)} />
        <Flex
          flex={1}
          bgColor="#2F2841"
          direction="column"
          pt={4}
          mx={5} //era5
          overflowX="scroll"
          sx={{
            scrollbarWidth: "none",
            minHeight: "0",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {getMessages()}
          <div ref={bottomOfChat}></div>
        </Flex>

        <Bottombar id={id} user={user} />
      </Flex>
    </Flex>
  );
}