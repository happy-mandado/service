
class Service {
	constructor(db) {
		this.db = db;
	}

	getUserClosedLists(userId) {
		// Returns a summary of each list created by a user.
		return this.db.lists.findClosedByUserId(userId)
	}

	createUserList(userId, list) {
		// The user will be allowed to have just one open list at a time
		const unclosedList = this.db.lists.findLastUnclosedByUserId(userId)
		if (unclosedList.length) {
			throw new Error('Unclosed lists found for user')
		}

		list.userId = userId
		list.name = 'Mandado :)'
		list.createdAt = Date.now()
		list.closedAt = null
		list.deletedAt = null

		return this.db.lists.save(list)
	}

	async closeUserList(userId, listId, products) {
		let savedList = await this.db.lists.findByIdAndUserId(listId, userId);

		if (savedList.closedAt) {
			throw new Error('User list is already closed');
		}

		savedList.products = products;
		savedList.closedAt = Date.now();

		savedList = await this.db.lists.save(savedList);

		const productIds = products.map(({ id }) => id);
		await this.db.products.setAsBoughtAllWithUserIdCreatedBeforeThan(
			userId, productIds, savedList.closedAt
		);

		return savedList;
	}

	updateUserList(userId, list) {
		let savedList = this.db.lists.findByIdAndUserId(list.id, userId)

		if (savedList.closedAt) {
			throw Exception('User list is already closed');
		}

		savedList.name = list.name;

		savedList = this.db.lists.save(savedList);

		return savedList;
	}

	getUserUnclosedList(userId) {
		// ES index
		// id
		// name
		// createdAt
		// deletedAt -> this shouldnt be allowed
		// closedAt -> property to link products
		return this.db.lists.findLastUnclosedByUserId(userId);
	}

	// Returns all the products created ever by a user
	getUnbougthUserProducts(userId) {
		return this.db.products.findUnboughtByUserId(userId);
	}

	getBoughtUserProducts(userId) {
		return this.db.products.findBoughtByUserId(userId);
	}

	// Creates a product using a timestamp
	createUserProduct(userId, product) {
		/*
		We could use log indexes for users and lists where we log the action
		but at the same time lock the action
		Example:
			1. Get last action timestamp
			2. Try to udpate with last action timestamp (transactions in ES)
			3. If not possible, cancel the action
			4. This should mess up error logging
			*/
		// ES index
		// id
		// createdAt -> logging proposes
		// boughtAt -> link to a list in mongo or even here. Comes from the closed list
		// deletedAt -> boolean to know if the user has deleted it
		// name
		// description (eventually)
		product.userId = userId
		product.createdAt = Date.now()
		product.boughtAt = null

		return this.db.products.save(product)

	}

	updateUserProduct() {
		// Will only allow to update those that are not deleted nor bought
		// Params to edit => name and description
	}

	async removeUserProduct(userId, productId) {
		// Will only allow to delete those products that have not been bought
		const product = await this.db.products.findUnboughtByIdAndUserId(
			productId, userId
		);

		product.deletedAt = Date.now();

		return this.db.products.save(product);
	}

	getUserSuggestions() {
	}
}

module.exports = Service;
