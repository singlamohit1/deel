const Sequelize = require("sequelize");
const createProfileModel = require("./profile");
const createJobModel = require("./job");
const createContractModel = require("./contract");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite3",
});

const Profile = createProfileModel(sequelize);
const Job = createJobModel(sequelize);
const Contract = createContractModel(sequelize);

Profile.hasMany(Contract, { as: "Contractor", foreignKey: "ContractorId" });
Contract.belongsTo(Profile, { as: "Contractor" });
Profile.hasMany(Contract, { as: "Client", foreignKey: "ClientId" });
Contract.belongsTo(Profile, { as: "Client" });
Contract.hasMany(Job);
Job.belongsTo(Contract);

module.exports = {
  sequelize,
  Profile,
  Contract,
  Job,
};
