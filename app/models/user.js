let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, default: "" },
    accountAddress : { type: String, default: "" , required : true, unique : true},
    profilePicture : { type: String, default: "" },
    sessionToken : { type: String, default: "" },
});

UserSchema.method({
    saveData: async function () {
        return await this.save();
    },
});

UserSchema.static({
    getUser: function (findQuery) {
        return this.findOne(findQuery);
    },

    updateUser: function (findObj, updateObj) {
        return this.findOneAndUpdate(findObj, updateObj, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });
    },
    countData: function (findObj) {
        return this.count(findObj);
    },

    removeData: function (findObj) {
        return this.deleteOne(findObj)
    },

    updateManyUsers: function (findObj, updateObj) {
        return this.updateMany(findObj, updateObj);
    },
    getUserList: function (findObj, selectionKey = "", skip = 0, limit = 0, sort = 1) {
        return this.find(findObj, selectionKey).skip(skip).limit(limit).sort(sort);
    },
    bulkUpsert: function (bulkOps) {
        return this.bulkWrite(bulkOps);
    },
});
module.exports = mongoose.model("xin-users", UserSchema);
