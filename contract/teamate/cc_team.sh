CC_SRC_PATH=github.com/teamate
CHANNEL_NAME=mychannel
CCNAME=teamate
VERSION=1.0

docker exec cli peer chaincode install -n $CCNAME -v 1.0 -p $CC_SRC_PATH

docker exec cli peer chaincode instantiate -n $CCNAME -v $VERSION -C $CHANNEL_NAME -c '{"Args":[]}' -P 'OR ("Org1MSP.member", "Org2MSP.member", "Org3MSP.member")'

sleep 5

docker exec cli peer chaincode invoke -n $CCNAME -C $CHANNEL_NAME -c '{"Args":["addUser","user1"]}'

docker exec cli peer chaincode query -n $CCNAME -C $CHANNEL_NAME -c '{"Args":["readRating", "user1"]}'

sleep 5

docker exec cli peer chaincode invoke -n $CCNAME -C $CHANNEL_NAME -c '{"Args":["addRating","user1","p1","5.0"]}'


echo '--------------------------------------END--------------------------------------'