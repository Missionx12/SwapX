import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import {StatusBar } from 'expo-status-bar'

const Welcome = () => {
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
          {/* welcome image */}
          <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/image/welcome.png')} />


          {/* title */}
          <View style={{gap: 20}}>
               <Text style={styles.tittle}>LinkUp!</Text>
               <Text style={styles.punchline}>
                 Where every thought finds a home and every image tells a story.
          </View>

          {/* footer */}
          <view style={styles.footer}>
            
          </view>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },
    welcomeImage:{
        height: hp(30),
        width:wp(100),
        alignself: 'center',
    },
    tittle: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: 'center',
        fontweight: theme.fonts.extraBold
    },
    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontsize: hp(1.7),
        color: theme.colors.text

    }

})