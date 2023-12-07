import {
    Flex,
    Avatar,
    Text,
    IconButton,
    Button,
    Tooltip,
  } from "@chakra-ui/react";
  import { ArrowLeftIcon, CloseIcon } from "@chakra-ui/icons";
  import { signOut } from "firebase/auth";
  import { auth } from "../../firebaseconfig";
  import { useAuthState } from "react-firebase-hooks/auth";
  import { useCollection } from "react-firebase-hooks/firestore";
  import {
    collection,
    addDoc,
    doc,
    updateDoc,
    arrayRemove,
  } from "firebase/firestore";
  import { db } from "../../firebaseconfig";
  import getOtherEmail from "../../utils/getOtherEmail";
  import { useRouter } from "next/router";
  
  export default function Sidebar() {
    const [user] = useAuthState(auth);
    const [snapshot, loading, error] = useCollection(collection(db, "chats"));
    const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const router = useRouter();
  
    const redirect = (id) => {
      router.push(`/chat/${id}`);
    };
  
    const chatExists = (email) =>
      chats?.find(
        (chat) => chat.users.includes(user.email) && chat.users.includes(email)
      );
  
  
  
    //funcao de deletar usuário
    const deleteChatUser = async (chatId) => {
      // Obter o documento do chat
      const chatDoc = doc(db, "chats", chatId);
  
      // Atualizar o documento para remover o usuário
      await updateDoc(chatDoc, {
        users: arrayRemove(user.email),
      });
    };
  
  
  
    const newChat = async () => {
      const input = prompt("Insira o e-mail do destinatário do bate-papo");
    
      // Function to validate email format
      const isValidEmail = (email) => {
        // You can use a regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
    
      // Verificar se o email inserido não está vazio e é um email válido
      if (input && input.trim() !== "" && isValidEmail(input)) {
        // Verificar se o chat já existe
        if (!chatExists(input)) {
          // Adicionar um novo chat apenas se não existir
          await addDoc(collection(db, "chats"), { users: [user.email, input] });
        } else {
          alert("Chat com esse usuário já existe!");
        }
      } else {
        alert("Por favor, insira um e-mail válido!");
      }
    };
    
  
    const chatList = () => {
      return chats
        ?.filter((chat) => chat.users.includes(user.email))
        .map((chat) => (
          <Flex
            color="white"
            key={Math.random()}
            p={3}
            align="center"
            _hover={{ bg: "#2F2841", cursor: "pointer" }}
            onClick={() => redirect(chat.id)}
          >
            <Avatar src="" marginEnd={3} />
            <Text>{getOtherEmail(chat.users, user)}</Text>
            <Flex ml="auto">
            <Tooltip label="Excluir Usuário" aria-label="A tooltip">
            <IconButton
              variant="ghost"
              color="red.300"
              aria-label="Delete User"
              borderRadius={20}
              icon={<CloseIcon fontSize="xx-small"/>}
              onClick={() => deleteChatUser(chat.id)}
              _hover={{ bg: "#201B2C", cursor: "not-allowed", }}
            /></Tooltip>
            </Flex>
          </Flex>
        ));
    };
  
    return (
      <Flex
        bg="#201B2C"
        //w="400px"
        w={{base:"180px", sm: "230px", md: "310px", lg:"380px"}}
        h="100vh"
        borderEnd="1px solid black"
        borderColor="black"
        direction="column"
      >
        <Flex
          h="81px"
          bg="#00FF89"
          w="100%"
          align="center"
          justifyContent="space-between"
          borderBottom="1px solid black"
          borderColor="black"
          p={3}
        >
          <Flex align="center">
            <Avatar src={user.photoURL} marginEnd={3} />
            <Text fontSize={20}>{user.displayName}</Text>
          </Flex>
          <Tooltip label="Sair" aria-label="A tooltip">
            <IconButton
              bgColor="#00FF89"
              size="sm"
              isRound
              _hover="none"
              icon={<ArrowLeftIcon />}
              onClick={() => signOut(auth)}
            />
          </Tooltip>
        </Flex>
        <Button
          bgColor="gray"
          color="white"
          _hover={{ bg: "gray.500", cursor: "pointer" }}
          m={5}
          p={4}
          onClick={() => newChat()}
        >
          Nova conversa
        </Button>
  
        <Flex
          overflowX="scroll"
          direction="column"
          sx={{
            scrollbarWidth: "none",
            minHeight: "0",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
          flex={1}
        >
          {chatList()}
        </Flex>
      </Flex>
    );
  }