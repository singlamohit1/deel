const { Job, Contract, Profile, sequelize } = require("./../models/index");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const { UnauthorizedError } = require("./../utils/errorHandling");

class JobController {
  static async getUnpaidJobs(req, res) {
    try {
      const userId = req.profile.id;
      const unpaidJobs = await Job.findAll({
        include: [
          {
            model: Contract,
            where: {
              [Op.and]: [
                { status: "in_progress" },
                {
                  [Op.or]: [{ ContractorId: userId }, { ClientId: userId }],
                },
              ],
            },
          },
        ],
        where: {
          paid: null,
        },
        raw: true,
      });
      res.json(unpaidJobs);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  static async payToContractor(req, res) {
    try {
      const jobId = req.params.jobId;
      const jobDetails = await Job.findOne({
        where: { id: jobId },
        include: [
          {
            model: Contract,
            attributes: [],
            include: [
              {
                model: Profile,
                as: "Client",
                attributes: ["id", "balance"],
              },
              {
                model: Profile,
                as: "Contractor",
                attributes: ["id"],
              },
            ],
          },
        ],
        attributes: ["price"],
        raw: true,
      });

      const {
        "Contract.Client.id": clientId,
        "Contract.Contractor.id": contractorId,
        "Contract.Client.balance": clientBalance,
      } = jobDetails;
      const jobPrice = jobDetails.price;

      if (clientBalance >= jobPrice) {
        await sequelize.transaction(async (t) => {
          await Profile.update(
            { balance: Sequelize.literal(`balance - ${jobPrice}`) },
            { where: { id: clientId }, t }
          );

          await Profile.update(
            { balance: Sequelize.literal(`balance + ${jobPrice}`) },
            { where: { id: contractorId }, t }
          );
        });
      } else {
        throw new Error("Client's balance is less than amount to be paid");
      }
      res.json({ message: "Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async depositToClient(req, res) {
    try {
      const idToWhichDepositMoney = req.params.userId;
      const authenticatedUserId = req.profile.id;
      if (idToWhichDepositMoney != authenticatedUserId) {
        throw new UnauthorizedError();
      }
      const totalJobsToPay = await Job.sum("price", {
        include: {
          model: Contract,
          attributes: [],
          include: { model: Profile, as: "Client", attributes: [] },
        },
        where: {
          paid: null,
          "$Contract.ClientId$": idToWhichDepositMoney,
        },
      });

      const depositAmount = 0.25 * totalJobsToPay;
      await Profile.update(
        { balance: sequelize.literal(`balance + ${depositAmount}`) },
        { where: { id: idToWhichDepositMoney } }
      );
      res.json({ message: "Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}
module.exports = JobController;
