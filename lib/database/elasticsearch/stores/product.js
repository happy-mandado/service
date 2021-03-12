class ProductStore {
	constructor(index, client) {
		this.index = index
		this.client = client
	}

	async setAsBoughtAllWithUserIdCreatedBeforeThan(userId, productIds, boughtAt) {
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
							values: productIds,
						},
					},
					{
						range: {
							createdAt: {
								lt: boughtAt,
							}
						}
					},
					{
						bool: {
							must_not: [
								{
									exists: {
										field: "boughtAt",
									},
								},
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

		const script = {
			lang: 'painless',
			source: `ctx._source["boughtAt"] = ${boughtAt}L`
		};

		let response;
		try {
			response = await this.client.updateByQuery({
				index: this.index,
				refresh: true,
				body: { script, query },
			})
		} catch(error) {
			// TODO: Proper error handling
			// TODO: Investigate how updateByQuery works with concurrency
			// En teoria no debe haber problemas de concurrencia porque los
			// productos a actualizar estan ligados a una sola lista. El problema
			// puede existir cuando la misma lista se actualiza al mismo tiempo
			console.log(error, error.meta.body)
			throw error;
		}

		if (response.statusCode != 200) {
			throw new Error()
		}

		return;
	}

	async findUnboughtByIdAndUserId(productId, userId) {
		const query = {
			bool: {
				filter: [
					{
						ids: {
							values: productId,
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
										field: "boughtAt",
									},
								},
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
			throw error;
		}

		if (response.statusCode != 200) {
			throw new Error();
		}

		if (response.body.hits.total.value == 0) {
			throw new Error("Product Not Found");
		}

		return this._modelToObject(response.body.hits.hits[0]);
	}

	async findBoughtByUserId(userId) {
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
							must: [
								{
									exists: {
										field: "boughtAt",
									},
								},
							],
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
			// This response does not need version, seqno, nor primary term
			// Only one-object-responses need it
			response = await this.client.search({
				index: this.index,
				size: 1000, // TODO: Implement scroll/pagination
				body: { query },
			})
		} catch(error) {
			// TODO: Proper error handling
			throw error;
		}

		if (response.statusCode != 200) {
			throw new Error()
		}

		return response.body.hits.hits.map(this._modelToObject)
	}

	async findUnboughtByUserId(userId) {
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
										field: "boughtAt",
									},
								},
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
			// This response does not need version, seqno, nor primary term
			// Only one-object-responses need it
			response = await this.client.search({
				index: this.index,
				size: 1000, // TODO: Implement scroll/pagination
				body: { query },
			})
		} catch(error) {
			// TODO: Proper error handling
			throw error;
		}

		if (response.statusCode != 200) {
			throw new Error()
		}

		return response.body.hits.hits.map(this._modelToObject)
	}

	async save(product) {
		let response
		try {
			response = await this.client.index({
				id: product.id,
				index: this.index,
				refresh: true,
				ifSeqNo: product.seqNo,
				ifPrimaryTerm: product.primaryTerm,
				body: {
					name: product.name,
					userId: product.userId,
					products: product.products,
					createdAt: product.createdAt,
					broughtAt: product.broughtAt,
					deletedAt: product.deletedAt,
				},
			})
		} catch(error) {
			// TODO: Proper error handling
			// console.log(error.meta.body.status)
			// 409 Version Conflict Engine Exception
			// 400 If wrong seqNo & primaryTerm given
			console.log(error);
			throw error;
		}

		if (response.statusCode != 201 && response.statusCode != 200) {
			throw new Error("Product Not Saved");
		}

		return {
			...product,
			id: response.body._id,
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
			createdAt: model._source.createdAt,
			boughtAt: model._source.boughtAt,
			deletedAt: model._source.deletedAt,
		}
	}
}

module.exports = ProductStore;
