async function pokemon(){
    try{
        const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/350");
        const respuestapars = await respuesta.json();
        
        console.log(JSON.stringify(respuestapars, null, 2));

    } catch (error) {
        console.log("Error:", error);
    }
}

pokemon();