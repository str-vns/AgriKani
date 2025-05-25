import React, { useState } from 'react'
import { Modal, Text, View } from 'react-native'
import styles from '@screens/stylesheets/Shared/PopUps/styles'


export const MiniModalpop = (props) => {
    const { content, visible, color } = props;
  return (
   <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
   >
    <View style={styles.header}>
      <View style={[
            styles.backGroundContainer,
            color ? { backgroundColor: color } : null 
          ]}>
        <Text style={styles.contentText}>{content}</Text>
      </View>
    </View>
   </Modal>
  )
}


