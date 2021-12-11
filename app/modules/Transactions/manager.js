import ContractModel from "../../models/Contract"
import Utils from '../../utils'
import { httpConstants, apiFailureMessage, apiSuccessMessage } from "../../common/constants";


let ERC20ABI = require("./jsonInterface").ERC20ABI;

export default class Manger {
    getTransactions = async ({ contractAddress }) => {
        // const responseW3 = await web3.eth.getTransactionCount(contractAddress);
        // const responseW3 = await web3.eth.getTransactionCount("0x8fFcABE2D92A76286b58f6C286980877C3C2C5C6")
        const responseW3 = await web3.eth.getTransactionCount(contractAddress)
            .then((b = console.log) => {
                console.log(b)
                for (var i = 0; i < 5; i++) {
                    web3.eth.getBlock(b - i).then((Block) => {
                        let a = [
                            Block.hash
                        ]
                        console.log("Block", a);
                        var iterator = a.values()
                        for (let elements of iterator) {
                            console.log("ELEMENTS", elements)
                            web3.eth.getTransactionFromBlock(elements, 1).then(console.log)
                        }
                    });
                }
            });

        return responseW3;
    }

}
