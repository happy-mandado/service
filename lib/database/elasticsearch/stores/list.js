class ListStore {
	constructor(index, client) {
		this.index = index
		this.client = client
	}

	async findClosedByUserId(userId) {
		const query = {
			bool: {
				filter: [
					{
						exists: {
							field: "closedAt",
						},
					},
					{
						term: {
							['userId.keyword']: userId,
						},
					},
					{
						bool: {
							must_not: [
								{
									exists: {
										field: "deletedAt",
									},
								},
							]
						},
					},
				],
			},
		};

		let response;
		try {
			response = await this.client.search({
				index: this.index,
				body: { query },
			})
		} catch(error) {
			// TODO: Proper error handling
		}

		if (response.statusCode != 200) {
			throw new Error()
		}

		return response.body.hits.hits.map(this._modelToObject)
	}

	async findByIdAndUserId(listId, userId) {
		const query = {
			bool: {
				filter: [
					{
						term: {
							['userId.keyword']: userId,
						},
					},
					{
						ids: {
							values: listId,
						},
					},
					{
						bool: {
							must_not: [
								{
									exists: {
										field: "deletedAt",
									},
								},
							],
						},
					},
				],
			},
		};

		let response;
		try {
			response = await this.client.search({
				index: this.index,
				body: { query },
				version: true,
				seqNoPrimaryTerm: true,
			})
		} catch(error) {
			// TODO: Proper error handling
		}

		if (response.statusCode != 200) {
			throw new Error()
		}

		if (response.body.hits.total.value == 0) {
			throw new Error() // NotFound
		}

		return response.body.hits.hits.map(this._modelToObject)
	}

	async findLastUnclosedByUserId(userId) {
		// TODO: This should return only one
		const query = {
			bool: {
				filter: [
					{
						term: {
							['userId.keyword']: userId,
						},
					},
					{
						bool: {
							must_not: [
								{
									exists: {
										field: "closedAt",
									},
								},
								{
									exists: {
										field: "deletedAt",
									},
								},
							]
						},
					},
				],
			},
		};

		let response;
		try {
			response = await this.client.search({
				index: this.index,
				body: { query },
			})
		} catch(error) {
			// TODO: Proper error handling
		}

		if (response.statusCode != 200) {
			throw new Error()
		}

		return response.body.hits.hits.map(this._modelToObject)
	}

	async save(list) {
		// Always implement txn style
		let response
		try {
			response = await this.client.index({
				id: list.id,
				index: this.index,
				refresh: true,
				ifSeqNo: list.seqNo,
				ifPrimaryTerm: list.primaryTerm,
				body: {
					name: list.name,
					userId: list.userId,
					products: list.products,
					createdAt: list.createdAt,
					closedAt: list.closedAt,
				},
			})
		} catch(error) {
			// TODO: Proper error handling
			// console.log(error.meta.body.status)
			// 409 Version Conflict Engine Exception
			// 400 If wrong seqNo & primaryTerm given
		}

		if (response.statusCode != 201) {
			throw new Error()
		}

		return {
			...list,
			version: response.body._version,
			seqNo: response.body._seq_no,
			primaryTerm: response.body._primary_term,
		}
	}

	_modelToObject(model) {
		return {
			id: model._id,
			seqNo: model._seq_no,
			primaryTerm: model._primary_term,
			version: model._version,
			name: model._source.name,
			userId: model._source.userId,
			products: model._source.products,
			createdAt: model._source.createdAt,
			closedAt: model._source.closedAt,
		}
	}
}

module.exports = ListStore;
