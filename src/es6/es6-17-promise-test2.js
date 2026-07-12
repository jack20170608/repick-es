const getUsers = function (url) {
    const p = new Promise((resolve, reject) => {
        const handler = function(){
            if (this.readyState != 4){
                return;
            }
            if (this.status === 200){
                resolve(this.response);
            }else {
                reject(new Error(this.statusText));
            }
        }
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json";
        client.setRequestHeader("Accept", "application/json");
        client.send();
    })
    return p;
}

getUsers("http://localhost:12580/api/users").then(function(json){
    console.log(`result is ${json}`);
}, function(error){
    console.error(`error is ${error}`);
})