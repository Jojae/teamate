CC_SRC_PATH=github.com/mysacc
CHANNEL_NAME=mychannel
CCNAME=mysacc
VERSION=1.0

docker exec cli peer chaincode install -n $CCNAME -v 1.0 -p $CC_SRC_PATH

docker exec cli peer chaincode instantiate -o orderer.example.com:7050 -C $CHANNEL_NAME -n $CCNAME -v $VERSION -c '{"Args":["a","100"]}' -P 'OR ("Org1MSP.member", "Org2MSP.member", "Org3MSP.member")'

sleep 5

docker exec cli peer chaincode query -C $CHANNEL_NAME -n $CCNAME -c '{"Args":["get", "a"]}'

docker exec cli peer chaincode invoke -C $CHANNEL_NAME -n $CCNAME -c '{"Args":["set","b","200"]}'

sleep 5

docker exec cli peer chaincode query -C $CHANNEL_NAME -n $CCNAME -c '{"Args":["get","b"]}'