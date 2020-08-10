//모듈포함
const express = require('express');
const app = express();
var bodyParser = require('body-parser');

//hyperledger configuration
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', 'network' ,'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
//서버설정
const PORT = 8080;
const HOST = '0.0.0.0';
// app.use
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//HTML Rauting
//1.1 /라우팅
app.get('/', (req, res) => {
    res.sendFile(__dirnme + '/index.html');
})
//1.2 /키생성페이지 라우팅
app.get('/create', (req, res) => {
    res.sendFile(__dirnme + '/create.html');
})
//1.3 /키조회페이지 라우팅
app.get('/query', (req, res) => {
    res.sendFile(__dirnme + '/query.html');
})


//REST 라우팅
//2.1 /key POST라우팅
app.post('/key', async(req, res)=>{
    const key = req.body.key
    const value = req.body.value;

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userExists = await wallet.exists('user1');
    if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity : 'user1', discovery :{enabled:false}});
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mysacc');
    await contract.submitTransaction('set', key, value);
    console.log('Transaction has been submitted');
    await gateway.disconnect();

    res.status(200).send('Transaction hsa been submitted');

})
//2.2 /key GET 라우팅
app.get('/key', async(req, res)=>{
    const key = req.query.key;

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userExists = await wallet.exists('user1');
    if (!userExists) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity : 'user1', discovery : { enabled :false}});
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('mysacc');
    const result = await contract.evaluateTransaction('get', key);
    console.log(`Transaction has been evaluate, result is: ${result.toString()}`);
    await gateway.disconnect();
    
    var obj = JSON.parse(result);
    res.status(200).json(obj);

})


//서버시작
app.listen(PORT, HOST);
console.log(`Runing on http://${HOST}:${PORT}`);