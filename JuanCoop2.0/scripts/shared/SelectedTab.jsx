import React, {useState} from 'react'
import styles from "@screens/stylesheets/Shared/SelectedTab/styles";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { use } from 'react';
import { useNavigation } from '@react-navigation/native';

export const SelectedTab = (props) => {
    const { isOrder } = props;
    const [selectedTab, setSelectedTab] = useState(props.selectedTab);
    const navigation = useNavigation();
    console.log("SelectedTab props:", selectedTab);
    const navigateToTab = (tabValue) => {
      if (selectedTab === tabValue) return; // Prevent unnecessary navigation
      setSelectedTab(tabValue);
      if (tabValue === "Rider") {
        navigation.navigate("Riderlist");
      } else if (tabValue === "Assign") {
        navigation.navigate("AssignList");
      } else if (tabValue === "MApproved") {
        navigation.navigate("MemberActive");
      } else if (tabValue === "MPending") {
        navigation.navigate("MemberList");
      } else if (tabValue === "CApproved") {
        navigation.navigate("CoopActive");
      } else if (tabValue === "CPending") {
        navigation.navigate("CoopList");
      } else if (tabValue === "DApproved") {
        navigation.navigate("DriverActive");
      } else if (tabValue === "DPending") {
        navigation.navigate("DriverList");
      } else if (tabValue === "WPending") {
        navigation.navigate("WithdrawsList");
      } else if (tabValue === "WApproved") {
        navigation.navigate("WithdrawsSuccess");
      } else if (tabValue === "RPending") {
        navigation.navigate("RefundProcess");
      } else if (tabValue === "RApproved") {
        navigation.navigate("RefundSuccess");
      }
      

    }

    const tabButtons = props.tabs && props.tabs.map((tab) => (
    <TouchableOpacity
      key={tab.value}
      style={[
        isOrder ? styles.tabButton : styles.isNotTabButton,
        selectedTab === tab.value && styles.activeTab,
      ]}
      onPress={() => {
        navigateToTab(tab.value);
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
        <View style={styles.isNotTabContiner}>
          {tabButtons}
        </View>
      )}
    </View>
  );
}

