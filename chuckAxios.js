const axios = require('axios');

async function Chuck(){
try{
    const respuesta = await axios.get("https://api.chucknorris.io/jokes/random")
    console.log("id: "+respuesta.data.id);
    console.log("update_at: "+respuesta.data.updated_at);
    console.log("url: "+respuesta.data.url);
    console.log("value: "+respuesta.data.value);

}catch{
    console.log("Error")
}}
Chuck();