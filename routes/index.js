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

module.exports = (app) => {
    app.get('/', (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

       /**
     * create swagger UI
     * **/
        app.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    /**
     * route definition
     */
    
    app.post("/contract", ValidationManger.addContract, new ContractModule().addContract);
    app.get("/contract",ValidationManger.checkForIdQuery, new ContractModule().getContractById);
    app.put("/contract", new ContractModule().updateContract);
    app.delete("/contract",ValidationManger.checkForId, new ContractModule().removeContract);
    app.post("/contract-list", new ContractModule().getContractsList);
    app.post("/contract/:address", new ContractModule().getContractByAddress);
    app.post("/hide-contract", ValidationManger.checkForId, new ContractModule().hideContract);
    app.post("/show-contract",ValidationManger.checkForId,  new ContractModule().showContract);
    app.put("/contract-name",ValidationManger.renameContract , new ContractModule().renameContract);
    app.post("/scm-contracts", new ContractModule().getSCMContracts);
    app.post("/alert-contracts", new ContractModule().getAlertContracts);
    app.get("/check-address", new ContractModule().checkAddress);


    app.get("/tags", new ContractModule().getListOfTags);
    app.post("/tags",ValidationManger.addTagToContract,  new ContractModule().addTagToContract);
    app.delete("/tags", new ContractModule().removeTagFromContract);

    // User Routes
    app.get("/user", new UserModule().getUserDetails);
    app.post("/user", new UserModule().addUser);
    app.post("/add-network", new NetworkModule().addNetwork);
  app.post("/get-network", new NetworkModule().getNetworksList);
};
