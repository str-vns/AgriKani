import React, {useState} from 'react'
import styles from "@screens/stylesheets/Shared/SelectedTab/styles";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export const SelectedTab = (props) => {
    const { isOrder } = props;
    const [selectedTab, setSelectedTab] = useState(props.selectedTab);

    const tabButtons = props.tabs && props.tabs.map((tab) => (
    <TouchableOpacity
      key={tab.value}
      style={[
        isOrder ? styles.tabButton : styles.isNotTabButton,
        selectedTab === tab.value && styles.activeTab,
      ]}
      onPress={() => {
        setSelectedTab(tab.value);
        if (props.onTabChange) props.onTabChange(tab.value);
      }}
    >
      <Text
        style={[
          isOrder ? styles.tabText : styles.isNotTabText,
          selectedTab === tab.value && styles.activeTabText,
        ]}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  ));

    return (
    <View style={styles.tabContainer}>
      {isOrder ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabButtons}
        </ScrollView>
      ) : (
        <View style={styles.tabContainer}>
          {tabButtons}
        </View>
      )}
    </View>
  );
}

