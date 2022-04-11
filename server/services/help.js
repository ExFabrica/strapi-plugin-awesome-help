'use strict';

module.exports = ({ strapi }) => {
  const query = strapi.db.query('plugin::awesome-help.help');
  const findMany = async (params, populate) => {
    let helpEntities = undefined;
    try {
      //adding a default sort
      params = params ?? {};
      params["orderBy"] = "contentType";
      helpEntities = await query.findMany(params, populate);
    }
    catch (exp) {
      throw new Error(`Help Service: findMany: ${exp.message}`);
    }
    return helpEntities;
  };
  const findOne = async (params, populate) => {
    try {
      return query.findOne(params, populate);
    }
    catch (exp) {
      throw new Error(`Help Service: findOne: ${exp.message}`);
    }
  };
  const count = async (params) => {
    try {
      return query.count(params);
    }
    catch (exp) {
      throw new Error(`Help Service: count: ${exp.message}`);
    }
  }
  const createMany = async (data) => {
    try {
      return await query.createMany({ data: data });
    }
    catch (exp) {
      throw new Error(`Help Service: createMany: ${exp.message}`);
    }
  };
  const create = async (data) => {
    try {
      return await query.create({ data: data });
    }
    catch (exp) {
      throw new Error(`Help Service: create: ${exp.message}`);
    }
  };
  const update = async (data) => {
    try {
      return await query.update({
        data: { ...data },
        where: {
          id: data.id
        }
      });
    }
    catch (exp) {
      throw new Error(`Help Service: update: ${exp.message}`);
    }
  };
  const deleteAll = async () => {
    try {
      return query.deleteMany(
        {
          where: {
            id: {
              $gt: 0,
            },
          }
        }
      );
    }
    catch (exp) {
      throw new Error(`Help Service: deleteAll: ${exp.message}`);
    }
  };
  const deleteOne = async (params) => {
    try {
      return query.delete(params);
    }
    catch (exp) {
      throw new Error(`Help Service: delete: ${exp.message}`);
    }
  };
  return {
    findMany,
    findOne,
    count,
    create,
    createMany,
    update,
    deleteOne,
    deleteAll
  }
}
