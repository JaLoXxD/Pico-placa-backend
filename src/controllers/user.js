class User {
	constructor() {
		this.userSchema = require('../models/user');
	}

	async create(userInfo) {
		const newUser = this.userSchema({
			...userInfo,
		});
        
        const query = await newUser.save();
        return query;
	}
}

module.exports = User
