import * as React from "react";
import { Button,Image,View,Platform } from "react-native";
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            image:null,
        }
    }
    getPermissionsAsync=async()=>{
        if (
            Platform.OS !== 'web'
        )
        {
            const {status}=await Permissions.askAsync(Permissions.CAMERA)
            if (status!=="granted") {
                alert("Sorry, we need camera roll permission")
            }
        }
    }

    componentDidMount(){
        this.getPermissionsAsync()
    }

    _pickimage=async()=>{
        try{
            let result=await ImagePicker.launchImageLibraryAsync(
                {
                    mediaTypes:ImagePicker.MediaTypeOptions.All,
                    allowsEditing:true,
                    aspect:[4,3],
                    quality:1,
                }
            )
            if(
                !result.canceled
            )
            {
                this.setState({image:result.data})
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }

    uploadImage=async(uri)=>{
        const data=new FormData()
        let filename=uri.split("/")[
            uri.split("/").length-1
        ]
        let type=`image/${uri.split(".")[
            uri.split(".").length-1
        ]}`
        const fileUpload={
            uri:uri,
            name:filename,
            type:type,
        }
        data.append("digit",fileUpload)
        fetch(" https://701b-45-250-247-165.in.ngrok.io/predict-digit",{
            method:"POST",
            body:data,
            headers:{
                "Content-Type":`multipart/form-data`
            }
        })
        .then(response=>response.json())
        .then((result)=>{
            console.log("SUCCESS:",result)
        })
        .catch((error)=>{
            console.log("ERROR:",error)
        })
    }

    render(){
        let {image}=this.state
        return(
            <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <Button
                title="Pick an Image from camera roll."
                onPress={this._pickimage}
                />
            </View>
        )
    }
}

