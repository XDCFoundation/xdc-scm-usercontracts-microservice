/**
 * Created by AyushK on 18/09/20.
 */
import * as ValidationManger from "../middleware/validation";
import ContractModule from "../app/modules/Contract";
import {stringConstants} from "../app/common/constants";

module.exports = (app) => {
    app.get('/', (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

    /**
     * route definition
     */
    app.post("/contract", new ContractModule().addContract);
    app.get("/contract", new ContractModule().getContractById);
    app.post("/contract-list", new ContractModule().getContractsList);
    app.post("/hide-contract", new ContractModule().hideContract);
    app.post("/show-contract", new ContractModule().showContract);
    app.delete("/contract", new ContractModule().removeContract);
};
