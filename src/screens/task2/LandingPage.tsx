import React, {useContext, useEffect, useState} from 'react';
import {View, ImageBackground, Image, Dimensions, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Alert} from 'react-native';
import {AppContext} from '../../store/AppContext';

const {width, height} = Dimensions.get('window');
type MappedSKU = { SKUID:string; Gender:string; Cat:number };

export default function LandingPage() {
  const {state, dispatch} = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('https://t03.tryndbuy.com/api/GetMappedSKUDetails', {
        method:'GET',
        headers: { authID: '3c643a25e11144ad' },
      });
      let json: any = await res.json();
      if (typeof json === 'string') json = JSON.parse(json);
      dispatch({ type: 'SET_API_DATA', payload: json.MappedSkuList ?? [] });
    } catch (e) {
      console.error('API Error', e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (skuId: string) => {
    if (Platform.OS === 'android') ToastAndroid.show(`SKUID: ${skuId}`, ToastAndroid.SHORT);
    else Alert.alert(`SKUID: ${skuId}`);
  };

  const getCategoryName = (cat: number) => {
    switch (cat) { case 0: return 'Dresses'; case 1: return 'Tops'; case 2: return 'Pants'; case 3: return 'Jeans'; default: return 'Item'; }
  };

  const renderItem = ({item}:{item:MappedSKU}) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => showToast(item.SKUID)} activeOpacity={0.7}>
      <View style={styles.circle}>
        <Image source={{uri:`https://demo03.tryndbuy.com/images/Th${item.SKUID}.jpg`}} style={styles.image} />
      </View>
      <Text style={styles.label}>{getCategoryName(item.Cat)}</Text>
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" /></View>;

  return (
    <View style={{flex:1}}>
      <ImageBackground style={styles.bgImage} resizeMode="stretch" source={require('../../../assets/images/rectangle.png')}>
        <View style={styles.leftContainer}>
          <Image source={require('../../../assets/images/model.png')} style={styles.modelImage} resizeMode="contain" />
        </View>

        <View style={styles.rightMenu}>
          <Text style={styles.menuTitle}>Types</Text>
          <FlatList
            data={state.apiData}
            keyExtractor={(it)=>it.SKUID}
            numColumns={2}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  loader:{flex:1, alignItems:'center', justifyContent:'center'},
  bgImage:{ flex:1, flexDirection:'row', justifyContent:'space-between', height: height*0.9 },
  leftContainer:{ width: width*0.5, height:'100%' },
  modelImage:{ marginTop:20, width:'100%', height: height*0.9, overflow:'hidden' },
  rightMenu:{ width: width*0.48, backgroundColor:'#fff', paddingTop:40, paddingHorizontal:10 },
  menuTitle:{ fontSize:18, fontWeight:'bold', marginBottom:10, textAlign:'left' },
  itemContainer:{ margin:10, alignItems:'center' },
  circle:{ width: width*0.15, height: width*0.15, borderRadius:(width*0.15)/2, borderWidth:2, borderColor:'#000',
    overflow:'hidden', alignItems:'center', justifyContent:'center' },
  image:{ width:'100%', height:'100%' },
  label:{ marginTop:8, fontSize:14, fontWeight:'500', textAlign:'center' },
});


