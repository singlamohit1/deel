const { Contract } = require("./../models/index");
const { UnauthorizedError } = require("./../utils/errorHandling");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

class ContractController {
  static async fetchContract(req, res) {
    try {
      const contractId = req.params.id;
      const authenticatedUser = req.profile;
      const contract = await Contract.findOne({
        where: { id: contractId },
        raw: true,
      });
      if (!contract) throw new Error("Contract not found");
      if (
        contract.ClientId !== authenticatedUser.id &&
        contract.ContractorId !== authenticatedUser.id
      ) {
        throw new UnauthorizedError();
      }
      res.json(contract);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res.status(500).send({ error: error.message });
    }
  }

  static async fetchAllContracts(req, res) {
    try {
      const userId = req.profile.id;
      const contracts = await Contract.findAll({
        where: {
          status: {
            [Op.not]: "terminated",
          },
          [Op.or]: [{ ContractorId: userId }, { ClientId: userId }],
        },
        raw: true,
      });
      res.json(contracts);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}
module.exports = ContractController;
