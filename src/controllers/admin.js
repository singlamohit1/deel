const { Job, Contract, Profile } = require("./../models/index");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

class AdminController {
  static async getBestProfession(req, res) {
    try {
      const start = new Date(req.query.start.replace(" ", "T")).toISOString();
      const end = new Date(req.query.end.replace(" ", "T")).toISOString();
      const mostProfitableProfession = await await Profile.findOne({
        attributes: [
          "profession",
          [
            Sequelize.literal('SUM(`Contractor->Jobs`.price)'),
            "totalEarnings",
          ],
        ],
        include: [
          {
            model: Contract,
            as: "Contractor",
            attributes: [],
            include: [
              {
                model: Job,
                attributes: [],
                where: {
                  paid: true,
                  paymentDate: {
                    [Sequelize.Op.between]: [start, end],
                  },
                },
              },
            ],
          },
        ],
        group: ["Profile.profession"],
        order: [[Sequelize.literal("totalEarnings"), "DESC"]],
        subQuery: false,
        limit: 1,
      });
      res.json(mostProfitableProfession.profession);
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  }

  static async getBestClients(req, res) {
    try {
      const start = new Date(req.query.start.replace(" ", "T")).toISOString();
      const end = new Date(req.query.end.replace(" ", "T")).toISOString();
      const results =   Profile.findAll({
        attributes: [
          ['id', 'clientId'],
          ['firstName', 'first name'],
          ['lastName', 'last name'],
          [
            Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col(`Client.Jobs.price`)), 0),
            'totalPaid',
          ],
        ],
        include: [
          {
            model: Contract,
            as: 'Client',
            attributes: [],
            include: [
              {
                model: Job,
                as: 'Jobs',
                attributes: [],
                where: {
                  paid: true,
                  paymentDate: {
                    [Op.between]: [start, end],
                  },
                },
              },
            ],
          },
        ],
        group: ['Profile.id'],
        order: [[Sequelize.literal('totalPaid'), 'DESC']],
        limit: 2,
      });

      res.json(results);
    } catch (error) {
      res.status(500).send({ error: true, message: error.message });
    }
  }
}
module.exports = AdminController;
