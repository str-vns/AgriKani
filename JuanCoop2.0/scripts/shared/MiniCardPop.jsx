import React, { useEffect, useState } from "react";
import { Modal, Text, View } from "react-native";
import styles from "@screens/stylesheets/Shared/PopUps/styles";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
  withDelay,
} from "react-native-reanimated";

export const MiniModalpop = (props) => {
  const { content, visible, color } = props;
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.header}>
        <View
          style={[
            styles.backGroundContainer,
            color ? { backgroundColor: color } : null,
          ]}
        >
          <Text style={styles.contentText}>{content}</Text>
        </View>
      </View>
    </Modal>
  );
};

export const MiniAnimatedPop = ({ content, visible, color }) => {
  const letters = content.split('');
  const animations = letters.map(() => useSharedValue(0));

  useEffect(() => {
    letters.forEach((_, index) => {
      animations[index].value = withDelay(
        index * 100,
        withSequence(
          withTiming(-20, { duration: 300 }),
          withTiming(0, { duration: 300 })
        )
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, visible]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.header}>
        <View
          style={[
            styles.backGroundContainer,
            color ? { backgroundColor: color } : null,
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {letters.map((letter, index) => {
              const animatedStyle = useAnimatedStyle(() => ({
                transform: [{ translateY: animations[index].value }],
              }));
              return (
                <Animated.Text
                  key={index}
                  style={[styles.contentText, animatedStyle]}
                >
                  {letter}
                </Animated.Text>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};