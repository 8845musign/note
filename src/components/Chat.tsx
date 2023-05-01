import { Avatar, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Message } from "../types";

const Chat = ({ content, role }: Message) => {
    const [chatMessage, setChatMessage] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < content.length) {
            const timeoutId = setTimeout(() => {
                setChatMessage((prevText) => prevText + content[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 80);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [content, currentIndex]);

    return (
        <div
            style={{
                alignSelf: role === "assistant" ? "flex-start" : "flex-end",
                width: "auto",
            }}
        >
            <Flex
                gap="5px"
                w="full"
                flexDir={role === "assistant" ? "row" : "row-reverse"}
                mt="10"
            >
                <Avatar
                    name={role === "user" ? "Me" : "GPT"}
                    w="40px"
                    h="40px"
                    src={
                        role === "assistant"
                            ? "https://placehold.jp/60/3d4070/ffffff/150x150.png?text=GPT"
                            : "https://placehold.jp/60/158427/ffffff/150x150.png?text=YOU"
                    }
                />
                <Flex
                    borderWidth={1}
                    borderColor="blue.400"
                    bg="main-bg"
                    p="0.5rem 1rem"
                    w="auto"
                    mt="16"
                    rounded={
                        role === "assistant" ? "0 20px 20px 20px" : "20px 0 20px 20px"
                    }
                    fontSize={{ base: "8px", md: "18px" }}
                    flexDir="column"
                >
                    {role === "assistant" && (
                        <Flex
                            alignSelf="flex-end"
                            fontStyle="italic"
                            opacity={0.8}
                            fontSize="11px"
                            as="small"
                            fontWeight={500}
                        >
                            GPT
                        </Flex>
                    )}
                    {role === "user" && (
                        <Flex
                            alignSelf="flex-start"
                            fontStyle="italic"
                            opacity={0.8}
                            fontSize="11px"
                            as="small"
                            fontWeight={500}
                        >
                            あなた
                        </Flex>
                    )}
                    {role === "assistant" ? chatMessage || "" : content || ""}
                </Flex>
            </Flex>
        </div>
    );
};

export default Chat;
