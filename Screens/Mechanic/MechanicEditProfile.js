import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';

import Loader from '../Loader/Loader';
import {Font, Commonstyles} from '../font/Font';
import port from '../Port/Port';

import CartProvider from '../ContextApi/contextApi';
import axios from 'axios';

import ImagePicker from 'react-native-image-crop-picker';

const MechanicEditProfile = ({navigation}) => {
  const {userdetails, setuserdetails} = useContext(CartProvider);

  const [firstname, setfirstname] = useState(userdetails?.firstname);
  const [lastname, setlastname] = useState(userdetails?.lastname);
  const [phonenumber, setphonenumber] = useState(userdetails?.phonenumber);

  const [permanentaddress, setpermanentaddress] = useState(
    userdetails?.permanentaddress,
  );

  const [PhotoUrl, setUrl] = useState(userdetails?.photoUrl);

  const [getcondition, setcondition1] = useState(true);

  //Get User details
  const getuserDetails = async () => {
    try {
      const result = await axios.get(
        `${port.herokuPort}/users/singleUser/${userdetails._id}`,
      );
      console.log(userdetails?.photoUrl);
      //   setuserdetails(result.data.data.doc);
      console.log(result.data.data.doc);

      setcondition1(false);
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  };

  //Update Profile
  const updateProfile = async () => {
    const shopData = {
      firstname: firstname,
      lastname: lastname,
      phonenumber: phonenumber,

      permanentaddress: permanentaddress,

      photoUrl: PhotoUrl,
    };

    try {
      const result = await axios.patch(
        `${port.herokuPort}/users/updateUser/${userdetails?._id}`,
        shopData,
      );

      setuserdetails(result.data.data);

      alert('Successfull');
      navigation.navigate('Profile');
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  };

  //Upload photo to cloudnary
  const handleUpload = async image => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'MuhammadTufailAli'),
      data.append('cloud_name', 'vehiclebuddy');

    fetch('https://api.cloudinary.com/v1_1/vehiclebuddy/image/upload', {
      method: 'post',
      body: data,
    })
      .then(res => res.json())
      .then(data => {
        var newUrl = data.url.slice(0, 4) + 's' + data.url.slice(4);
        setUrl(newUrl);
      });
  };

  //Image Picker
  const openImagePicker = () => {
    let imageList = [];

    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      compressImageQuality: 0.8,
      maxFiles: 10,
      mediaType: 'any',
      includeBase64: true,
    })
      .then(response => {
        response.map(image => {
          userdetails.photoUrl = image.path;
          imageList.push({
            filename: image.filename,
            path: image.path,
            data: image.data,
          });
        });

        let newfile = {
          uri: imageList[0].path,
          type: `test/${imageList[0].path.split('.')[2]}`,
          name: `test.${imageList[0].path.split('.')[2]}`,
        };
        handleUpload(newfile);
      })
      .catch(e => console.log('error', e.message));
  };

  React.useEffect(() => {
    getuserDetails();
  }, []);

  if (getcondition) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Loader />
        <Text
          style={{
            marginTop: -130,
            fontSize: 16,
            fontWeight: '700',
            marginLeft: 10,
            color: Font.LabelColor,
            fontFamily: 'Lexend-Regular',
          }}>
          Fetching Data for You
        </Text>
      </View>
    );
  } else {
    return (
      <ScrollView style={{backgroundColor: '#DCDCDC'}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>
              <View style={{marginTop: 20}}>
                <View style={{alignItems: 'center', backgroundColor: 'white'}}>
                  <Text
                    style={{
                      fontSize: 26,
                      marginTop: 90,
                      fontWeight: 'bold',
                      marginBottom: 10,
                      color: Font.TextColor,
                      fontFamily: 'Lexend-Regular',
                    }}>
                    Edit <Text style={{color: '#0e98f1'}}>Profile</Text>
                  </Text>
                </View>
                {!userdetails?.photoUrl ? (
                  <View>
                    <ImageBackground
                      source={require('../../assets/profile.png')}
                      resizeMode="cover"
                      style={{
                        width: 90,
                        marginLeft: 160,
                        height: 90,
                        marginTop: 10,
                      }}></ImageBackground>
                    <TouchableOpacity
                      onPress={openImagePicker}
                      style={{
                        alignItems: 'center',
                        marginLeft: 7,
                        marginTop: 7,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#0e98f1',
                          fontWeight: 'bold',
                          fontFamily: 'Lexend-Regular',
                        }}>
                        Change Profile Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Image
                      source={{
                        uri: userdetails?.photoUrl,
                      }}
                      style={{
                        width: 90,
                        height: 90,
                        marginLeft: 160,
                        borderRadius: 90 / 2,
                      }}
                    />
                    <TouchableOpacity
                      onPress={openImagePicker}
                      style={{
                        alignItems: 'center',
                        marginLeft: 7,
                        marginTop: 7,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#0e98f1',
                          fontWeight: 'bold',
                          fontFamily: 'Lexend-Regular',
                        }}>
                        Change Profile Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={{backgroundColor: 'white', marginTop: 20}}>
                  <TextInput
                    style={styles.inputText}
                    placeholder={userdetails?.firstname}
                    placeholderTextColor={Font.LightColor}
                    onChangeText={val => setfirstname(val)}
                  />

                  <TextInput
                    style={styles.inputText}
                    placeholder={userdetails?.lastname}
                    placeholderTextColor={Font.LightColor}
                    onChangeText={val => setlastname(val)}
                  />

                  <TextInput
                    style={styles.inputText}
                    keyboardType="numeric"
                    placeholderTextColor={Font.LightColor}
                    placeholder={
                      userdetails?.phonenumber
                        ? `${userdetails?.phonenumber.toString()}`
                        : 'Enter Phone Number'
                    }
                    onChangeText={val => setphonenumber(val)}
                  />
                </View>

                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: '#0e98f1',
                    width: '90%',
                    alignItems: 'center',
                    marginBottom: 20,
                    marginLeft: '5%',
                    marginRight: '5%',
                    marginTop: 15,
                  }}
                  onPress={() => {
                    updateProfile();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '500',
                      fontFamily: 'Lexend-Regular',
                    }}>
                    Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    marginTop: -100,
    flex: 1,
    justifyContent: 'space-around',
  },

  textInput: {
    height: 30,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 30,
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#0e98f1',
    padding: 40,

    alignItems: 'center',
    margin: 10,
    marginTop: 50,
  },
  dropDown: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 7,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  inputText: {
    padding: 10,
    borderBottomWidth: 0.3,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 7,
    marginBottom: 10,
    color: Font.TextColor,
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
  },
});

export default MechanicEditProfile;
