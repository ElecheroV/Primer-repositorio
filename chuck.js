async function Chuck(){
try{
    const respuesta = await fetch("https://api.chucknorris.io/jokes/random")
    const respuestapars = await respuesta.json()
    console.log("id: "+respuestapars.id);
    console.log("update_at: "+respuestapars.updated_at);
    console.log("url: "+respuestapars.url);
    console.log("value: "+respuestapars.value);

}catch{
    console.log("Error")
}}
Chuck();