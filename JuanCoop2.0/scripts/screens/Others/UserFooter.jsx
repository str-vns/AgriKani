import React, { useContext, useState } from "react";
import { NativeBaseProvider, Box, Center, Text, HStack, Pressable, Icon } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AuthGlobal from "@redux/Store/AuthGlobal";

const UserFooter = () => {
  const [selected, setSelected] = useState(1);
  const navigation = useNavigation();
  const context = useContext(AuthGlobal);

  const handleMessage = () => {
    { context?.stateUser?.isAuthenticated ? 
      navigation.navigate("Messages") : 
      navigation.navigate("Login") }
  }
  const handleWish = () => {
    { context?.stateUser?.isAuthenticated ? 
      navigation.navigate("Wishlist") : 
      navigation.navigate("Login") }
  }

  return (

   
   <Box  width="100%" alignSelf="center" flexDirection="column">
       <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="white"
            safeAreaBottom
            shadow={6}
            borderTopRadius="20"
            px="4"
          >
            <HStack alignItems="center" justifyContent="space-between">
              <Pressable
                cursor="pointer"
                opacity={selected === 0 ? 1 : 0.5}
                py="2"
                flex={1}
                onPress={() => {
                  setSelected(0);
                  navigation.navigate("Notification");
                }}
              >
                <Center>
                  <Icon
                    mb="1"
                    as={
                      <MaterialCommunityIcons
                        name={selected === 0 ? "bell" : "bell-outline"}
                      />
                    }
                    color={selected === 0 ? "#f7b900" : "gray.400"}
                    size="lg"
                  />
                  <Text
                    color={selected === 0 ? "#f7b900" : "gray.400"}
                    fontSize="12"
                  >
                    Notification
                  </Text>
                </Center>
              </Pressable>

              <Pressable
                cursor="pointer"
                opacity={selected === 1 ? 1 : 0.5}
                py="2"
                flex={1}
                onPress={() => {
                  setSelected(1);
                  navigation.navigate("Search");
                }}
              >
                <Center>
                  <Icon
                    mb="1"
                    as={<MaterialIcons name="search" />}
                    color={selected === 1 ? "#f7b900" : "gray.400"}
                    size="lg"
                  />
                  <Text
                    color={selected === 1 ? "#f7b900" : "gray.400"}
                    fontSize="12"
                  >
                    Search
                  </Text>
                </Center>
              </Pressable>

              <Pressable
                cursor="pointer"
                onPress={() => {
                  setSelected(2);
                  navigation.navigate("Cart");
                }}
                p="4"
                bg="#f7b900"
                borderRadius="full"
                alignItems="center"
              >
                <Center>
                  <Icon
                    mb="1"
                    as={
                      <MaterialCommunityIcons
                        name={selected === 2 ? "cart" : "cart-outline"}
                      />
                    }
                    color="white"
                    size="xl"
                  />
                </Center>
              </Pressable>

              <Pressable
                cursor="pointer"
                opacity={selected === 3 ? 1 : 0.5}
                py="2"
                flex={1}
                onPress={() => handleWish()}
              >
                <Center>
                  <Icon
                    mb="1"
                    as={
                      <MaterialCommunityIcons
                        name={selected === 3 ? "heart" : "heart-outline"}
                      />
                    }
                    color={selected === 3 ? "#f7b900" : "gray.400"}
                    size="lg"
                  />
                  <Text
                    color={selected === 3 ? "#f7b900" : "gray.400"}
                    fontSize="12"
                  >
                    Wishlist
                  </Text>
                </Center>
              </Pressable>

              <Pressable
                cursor="pointer"
                opacity={selected === 4 ? 1 : 0.5}
                py="2"
                flex={1}
                onPress={() => handleMessage()}
              >
                <Center>
                  <Icon
                    mb="1"
                    as={
                      <MaterialCommunityIcons
                        name={selected === 4 ? "chat" : "chat-outline"}
                      />
                    }
                    color={selected === 4 ? "#f7b900" : "gray.400"}
                    size="lg"
                  />
                  <Text
                    color={selected === 4 ? "#f7b900" : "gray.400"}
                    fontSize="12"
                  >
                    Messages
                  </Text>
                </Center>
              </Pressable>
            </HStack>
          </Box>
     </Box>

  );
};

export default UserFooter;