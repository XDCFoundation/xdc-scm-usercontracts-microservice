/**
 * Created by AyushK on 18/09/20.
 */
import * as ValidationManger from "../middleware/validation";
import ContractModule from "../app/modules/contract";
import UserModule from "../app/modules/user";
import {stringConstants} from "../app/common/constants";
import NetworkModule from "../app/modules/network/index";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import {authenticate} from "../middleware/authentication";

module.exports = (app) => {
    app.get('/', (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

       /**
     * create swagger UI
     * **/
        app.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    /**
     * route definition
     */
    
    app.post("/contract", authenticate ,ValidationManger.addContract, new ContractModule().addContract);
    app.get("/contract", authenticate ,ValidationManger.checkForIdQuery, new ContractModule().getContractById);
    app.put("/contract" , new ContractModule().updateContract);
    app.delete("/contract",authenticate ,ValidationManger.checkForId, new ContractModule().removeContract);
    app.post("/import-contracts", new ContractModule().getImportedContractList);
    app.post("/contract-list",authenticate, new ContractModule().getContractsList);
    app.post("/contract/:address", authenticate ,new ContractModule().getContractByAddress);
    app.post("/hide-contract",authenticate, ValidationManger.checkForId, new ContractModule().hideContract);
    app.post("/show-contract",authenticate,ValidationManger.checkForId,  new ContractModule().showContract);
    app.put("/contract-name",authenticate,ValidationManger.renameContract , new ContractModule().renameContract);
    app.post("/scm-contracts", new ContractModule().getSCMContracts);
    app.post("/alert-contracts", new ContractModule().getAlertContracts);
    app.get("/check-address",authenticate, ValidationManger.checkAddress, new ContractModule().checkAddress);
    app.get("/check-verify-contract",authenticate, new ContractModule().checkVerifyContract);


    app.get("/tags",authenticate, new ContractModule().getListOfTags);
    app.post("/tags",authenticate,ValidationManger.addTagToContract,  new ContractModule().addTagToContract);
    app.delete("/tags",authenticate, new ContractModule().removeTagFromContract);

    // User Routes
    app.get("/user",authenticate, new UserModule().getUserDetails);
    app.post("/user", new UserModule().addUser);
    app.post("/add-network", new NetworkModule().addNetwork);
  app.post("/get-network", new NetworkModule().getNetworksList);
};
