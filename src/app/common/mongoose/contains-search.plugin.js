const deps = require('../../../dependencies'),
	{ escapeRegex } = deps.utilService;

/**
 * @param schema
 * @param {Object} pluginOptions
 * @param {string[]} [pluginOptions.fields]
 */
const containsSearchPlugin = (schema, pluginOptions = {}) => {
	/**
	 * @param {string} search
	 * @param {string[]} [fields]
	 * @returns {*}
	 */
	schema.query.containsSearch = function (
		search,
		fields = pluginOptions.fields
	) {
		if (null == search || '' === search) {
			return this;
		}

		if (null == fields || fields.length === 0) {
			return this;
		}

		if (fields.length === 1) {
			return this.where({
				[fields[0]]: { $regex: new RegExp(escapeRegex(search), 'gim') }
			});
		}
		return this.where({
			$or: fields.map((element) => ({
				[element]: { $regex: new RegExp(escapeRegex(search), 'gim') }
			}))
		});
	};
};

module.exports = containsSearchPlugin;
