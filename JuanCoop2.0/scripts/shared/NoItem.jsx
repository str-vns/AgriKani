import React from "react";
import { View, Text } from "react-native";
import styles from "@stylesheets/Shared/NoItem/style";

export default function NoItem (props) {
    const { title } = props;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{`No ${title} found !`}</Text>
        </View>
    );
}