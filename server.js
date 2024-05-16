import http from 'node:http'
import fs from 'node:fs/promises'
import { uptime } from 'node:process';

const hostname = '127.0.0.1';
const port = 3000;

function logRequest (url){
    
    let fecha = Date();
    const requestFile = './requests.log';
    
    fs.appendFile(requestFile, `${fecha} - ${url}\n`, (error) => {
        if (error) {
            console.log(`Ocurrio un error en al actualizacion de ${requestFile} `,error);
        }
    })    
}

const server = http.createServer(async(req, res) =>{
    
    let url = req.url;
    let ContentType = 'text/plain';

    if (url.endsWith('.html')){
        ContentType = 'text/html';
    }
    if (url.endsWith('.png')){
        ContentType = 'image/png';
    }
    if ((url == '/index') || (url == '/')){
        url = '/index.html';
    }
    
    console.log(`${url}`);
    logRequest(url);
    
    try{
        let data = await fs.readFile(`.${url}`)
        
        if (url == '/requests.log'){
            res.statusCode = 405;
            res.setHeader('Contetnt-Type','text/html');
            res.end(data = await fs.readFile('./error405.html'));
            return;
        }
        
        res.statusCode = 200;
        res.setHeader('Contetnt-Type', ContentType);
        res.end(data);
    }
    catch(error){
        res.statusCode = 404;
        res.setHeader('Content-Type','text/html');
        res.end(error = await fs.readFile('./error404.html'));
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at: http://${hostname}${port}`);
})
