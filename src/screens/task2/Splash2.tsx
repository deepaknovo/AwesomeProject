import React, {useEffect} from 'react';
import {View, ImageBackground, Image, Dimensions, StyleSheet, FlatList, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const rightMenuData = [
  { id: '1', label: 'Dresses',  icon: require('../../../assets/images/dress.png') },
  { id: '2', label: 'Makeup',   icon: require('../../../assets/images/brush.png') },
  { id: '3', label: 'Goggles',  icon: require('../../../assets/images/glasses.png') },
  { id: '4', label: 'Shoes',    icon: require('../../../assets/images/shoes.png') },
  { id: '5', label: 'Location', icon: require('../../../assets/images/location.png') },
];

export default function Splash2() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('LandingPage'); // within WardrobeStack
    }, 3000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={{flex:1}}>
      <ImageBackground
        style={styles.bgImage}
        resizeMode="stretch"
        source={require('../../../assets/images/rectangle.png')}
      >
        <View style={styles.leftContainer}>
          <Image source={require('../../../assets/images/model.png')}
                 resizeMode="contain" style={styles.modelImage}/>
        </View>

        <View style={styles.rightMenu}>
          <FlatList
            data={rightMenuData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{flexGrow:1, justifyContent:'center'}}
            renderItem={({item}) => (
              <View style={styles.menuItem}>
                <View style={styles.icon}>
                  <Image source={item.icon} style={{width:40, height:40}} resizeMode="contain" />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage:{ flex:1, flexDirection:'row', justifyContent:'space-between', height: height*0.9 },
  leftContainer:{ width: width*0.5, height:'100%' },
  modelImage:{ marginTop:20, width:'100%', height: height*0.9, overflow:'hidden' },
  rightMenu:{
    width: width*0.3, backgroundColor:'rgba(255,255,255,0.6)',
    alignItems:'center', paddingTop:40, justifyContent:'center'
  },
  menuItem:{ marginVertical:10, alignItems:'center' },
  icon:{ width:60, height:60, borderRadius:30, backgroundColor:'#fff', alignItems:'center', justifyContent:'center' },
  menuText:{
    marginTop:5, backgroundColor:'rgba(0,0,0,0.38)', color:'#fff', borderRadius:5,
    paddingHorizontal:14, paddingVertical:2, fontSize:14, textAlign:'center'
  }
});
