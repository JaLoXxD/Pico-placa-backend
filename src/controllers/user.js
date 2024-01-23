class User {
	constructor() {
		this.userSchema = require('../models/user');
	}

	async create(userInfo) {
        try{
            const newUser = this.userSchema({
                ...userInfo,
            });
            const query = await newUser.save();
            return query;
        }catch(err){
            console.log('Error al crear usuario:', err);
            console.log(err.code)
            throw err.code;
        }
	}

	async deleteById(userId) {
		try {
			const query = await this.userSchema.findByIdAndDelete(userId);
			return query;
		} catch (err) {
			console.error('Error al eliminar usuario:', err);
		}
	}
}

module.exports = User;
